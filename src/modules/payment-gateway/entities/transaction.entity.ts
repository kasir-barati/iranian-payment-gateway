import { Document, Model, model, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

import { User } from './user.model';

export enum RefModel {
    'bought-lead' = 'bought-lead',
    'demand-lead' = 'demand-lead',
    'bought-plan' = 'bought-plan',
    'membership-plan' = 'membership-plan',
}
export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    OUT_OF_CALCULATION = 'out_of_calculation',
}
export enum TransactionLabels {
    PAY_BACK = 'PAY_BACK',
    BUY_LEAD = 'BUY_LEAD',
    CREDIT_INCREMENT = 'CREDIT_INCREMENT',
    CREDIT_INCREMENT_BY_ADMIN = 'CREDIT_INCREMENT_BY_ADMIN',
    CREDIT_DECREMENT_BY_ADMIN = 'CREDIT_DECREMENT_BY_ADMIN',
    ADD_BY_ADMIN = 'ADD_BY_ADMIN',
    VIOLATION_OF_PAYBACK = 'VIOLATION_OF_PAYBACK',
    CREDIT_MODIFICATION = 'CREDIT_MODIFICATION',
    REDUCE_CREDIT_PERCENTAGE_LEAD = 'REDUCE_CREDIT_PERCENTAGE_LEAD',
    FREEZ_TRANSACTION = 'FREEZ_TRANSACTION',
    ADDITIONAL_CONTRACT_AMOUNT = 'ADDITIONAL_CONTRACT_AMOUNT',
    BUY_SUBSCRIBE_PACKAGE_BY_ADMIN = 'BUY_SUBSCRIBE_PACKAGE_BY_ADMIN',
    DECREASE_GENESIS_CREDIT = 'DECREASE_GENESIS_CREDIT',
    BUY_MEMBER_SHIP_PLAN = 'BUY_MEMBER_SHIP_PLAN',
    YOUR_MEMBERSHIP_PLAN_WAS_EXPIRED = 'YOUR_MEMBERSHIP_PLAN_WAS_EXPIRED',
}

// README: I have to export first, because of using the enums in the transaction.output-dto
// and transaction.output-dto uses this file (cyclic dependency)
import {
    AdminTransactionOutputDto,
    UserTransactionOutputDto,
} from '../dto/output-dto/transaction.output-dto';

const schemaOption = {
    timestamps: true,
};
const COLLECTION_NAME = 'transaction';

export interface Transaction extends Document {
    _id: string | ObjectId;
    amount?: number;
    realAmount?: number;
    status: TransactionStatus;
    owner: string | User;
    asTo: string | ObjectId | any;
    refModel: RefModel;
    refId: string;
    authority: string;
    label: TransactionLabels[];
    description: string;
    usedCouponCode: string;
    creditBeforeTransaction: number;
    paymentGateWayFailedData?: {
        createPaymentGateway?: string[];
        verifyPayment?: string[];
    };
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

interface TransactionStaticMethods extends Model<Transaction> {
    toAdminDto(transaction: Transaction): AdminTransactionOutputDto;
    toUserDto(transaction: Transaction): UserTransactionOutputDto;
}

const transactionSchema = new Schema<
    Transaction,
    TransactionStaticMethods
>(
    {
        amount: Number,
        realAmount: Number,
        status: {
            type: String,
            required: true,
            default: TransactionStatus.PENDING,
            enum: Object.values(TransactionStatus),
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        asTo: { type: Schema.Types.ObjectId, refPath: 'refModel' },
        refModel: {
            type: String,
            enum: Object.values(RefModel),
        },
        refId: String,
        authority: String,
        label: [
            { type: String, enum: Object.values(TransactionLabels) },
        ],
        description: String,
        usedCouponCode: {
            type: Schema.Types.ObjectId,
            ref: 'coupon-code',
        },
        creditBeforeTransaction: Number,
        paymentGateWayFailedData: {
            createPaymentGateway: [String],
            verifyPayment: [String],
        },
    },
    schemaOption,
);
transactionSchema.static(
    'toUserDto',
    function (transaction: Transaction): UserTransactionOutputDto {
        return new UserTransactionOutputDto(transaction);
    },
);
transactionSchema.static(
    'toAdminDto',
    function (transaction: Transaction): AdminTransactionOutputDto {
        return new AdminTransactionOutputDto(transaction);
    },
);

export const TransactionModel = model<
    Transaction,
    TransactionStaticMethods
>(COLLECTION_NAME, transactionSchema);
