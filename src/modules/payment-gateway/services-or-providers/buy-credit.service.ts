import { ObjectId } from 'mongodb';
import { PaypingVerifyDto } from '../dto/payping-verify.input-dto';

import {
    TransactionLabels,
    TransactionStatus,
} from '../models/transaction.model';
import {
    PaymentError,
    TransactionService,
} from './transaction.service';

export class BuyCreditService extends TransactionService {
    private contractor: Contractor | undefined;
    private completedTransaction: PaypingVerifyDto | undefined;
    constructor(data?: {
        contractor?: Contractor;
        completedTransaction?: PaypingVerifyDto;
    }) {
        super();

        this.contractor = data?.contractor;
        this.completedTransaction = data?.completedTransaction;
    }

    async requestPayment(
        amount: number,
        phoneNumber: string,
        payerName: string,
        description: string,
        returnUrl: string,
        clientRefId: string,
    ): Promise<string> | never {
        if (!this.contractor!.isVerified) {
            throw new BadRequestError('NOT_VERIFIED_CONTRACTOR');
        }
        this.transaction = await super.create({
            amount,
            realAmount: amount,
            owner:
                typeof this.contractor!.user === 'string' ||
                this.contractor!.user instanceof ObjectId
                    ? this.contractor!.user.toString()
                    : this.contractor!.user._id.toString(),
            authority: clientRefId,
            label: [TransactionLabels.CREDIT_INCREMENT],
        });

        const paymentGatewayUrl = await super.requestPayment(
            amount,
            phoneNumber,
            payerName,
            description,
            returnUrl,
            clientRefId,
        );

        return paymentGatewayUrl;
    }

    async verifyPayment(
        clientRefId: string,
    ): Promise<boolean> | never {
        this.transaction = await super.find({
            authority: clientRefId,
        });

        if (!this.transaction) {
            throw new PaymentError(
                'Transaction not found',
                'callback?status=FAILED&message=TRANSACTION_NOT_FOUND',
            );
        }

        const contractor =
            await this.contractorService.getContractorByUserId(
                this.transaction.owner.toString(),
            );

        if (!contractor) {
            throw new PaymentError(
                'Transaction not found',
                'callback?status=FAILED&message=CONTRACTOR_NOT_FOUND',
            );
        }

        if (this.transaction.status !== TransactionStatus.PENDING) {
            throw new PaymentError(
                'Transaction status is not pending',
                'callback?status=FAILED&message=TRANSACTION_NOT_IN_PENDING',
            );
        }

        const result = await super.verifyPayment(
            this.completedTransaction!.refid,
            this.transaction.amount!,
        );

        if (result !== true) {
            throw new PaymentError(
                'Payment does not verified',
                'callback?status=failed',
            );
        }

        await super.update(this.transaction._id.toString(), {
            status: TransactionStatus.SUCCESSFUL,
            refId: this.completedTransaction!.refid,
            label: [TransactionLabels.CREDIT_INCREMENT],
            creditBeforeTransaction: contractor.credit,
        });

        const finalAmount =
            contractor.credit + this.transaction.amount!;

        await this.contractorService.update(
            contractor._id.toString(),
            {
                credit: contractor.credit + this.transaction.amount!,
                ...(finalAmount > 0
                    ? {
                          usableCredit:
                              contractor.usableCredit +
                              5 * finalAmount,
                      }
                    : {}),
            },
        );

        return result;
    }
}
