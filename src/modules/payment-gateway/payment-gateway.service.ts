import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

import { PaginationQueryStringDto } from 'src/common/providers/pagination.dto';
import {
    AdminTransactionFilterDto,
    UserTransactionFilterDto,
} from './dto/get-transaction.dto';
import { Transaction } from './types/transaction-type';

const paypingBaseUrl = 'https://api.payping.ir';
const paypingToken =
    '6691451faecfe6691451faecfe3f1c67347f4571bbc003f1c67347f4571bbc00';

@Injectable()
export class PaymentGatewayService {
    async create(transaction: Transaction) {
        // TODO: save transaction in DB
        return transaction;
    }

    async getTransactionById(id: string) {
        let transaction: Transaction;
        id;
        // TODO: fetch transaction from DB
        return transaction;
    }

    async getUserTransactions(
        userId: string,
        query: UserTransactionFilterDto,
        page: PaginationQueryStringDto,
    ) {
        let count: number, transactions: Transaction[];
        userId;
        query;
        page;
        // TODO: fetch all the transactions based on the pagination and the filters
        return { count, transactions };
    }

    async adminFindAllTransactions(
        query: AdminTransactionFilterDto,
        page: PaginationQueryStringDto,
    ) {
        let count: number, transactions: Transaction[];
        query;
        page;
        // TODO: fetch all the transactions based on the pagination and the filters
        return { count, transactions };
    }

    async requestPayment(
        amount: number,
        phoneNumber: string,
        payerName: string,
        description: string,
        returnUrl: string,
        clientRefId: string,
    ): Promise<string> | never {
        try {
            const response = await axios.post(
                `${paypingBaseUrl}/v2/pay`,
                {
                    amount,
                    payerIdentity: phoneNumber,
                    payerName: payerName,
                    description: description,
                    clientRefId: clientRefId,
                    returnUrl: returnUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer `,
                    },
                },
            );

            if (!response) {
                throw new BadRequestException(
                    'PAY_FAILED',
                    'No response received from the Payping',
                );
            }
            if (Number(response.status) !== 200) {
                throw new BadRequestException(
                    'PAY_FAILED',
                    'Response HTTP status code in not 200',
                );
            }

            const paymentGatewayUrl = `${paypingBaseUrl}/v2/pay/gotoipg/${response.data.code}`;

            return paymentGatewayUrl;
        } catch (error) {
            // TODO: add & config the winston
            // logger.error('create payment gateway failed', {
            //     meta: error,
            // });
            throw new BadRequestException(error, 'PAY_FAILED');
        }
    }

    async verifyPayment(
        refId: string,
        amount: number,
    ): Promise<boolean> | never {
        const response = await axios.post(
            `${paypingBaseUrl}v2/pay/verify`,
            {
                refId: refId,
                amount: amount,
            },
            {
                headers: {
                    Authorization: `Bearer ${paypingToken}`,
                },
            },
        );

        console.log(response);

        if (response.status !== 200) {
            return false;
        }
        return true;
    }

    update(id: string, fields: Transaction) {
        // TODO: update transaction in DB
        return { id, fields };
    }
}
