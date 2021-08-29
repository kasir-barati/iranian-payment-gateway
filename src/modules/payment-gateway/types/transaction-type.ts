import { User } from 'src/modules/user/types/user.type';

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

export interface Transaction {
    amount?: number;
    realAmount?: number;
    status: TransactionStatus;
    userId: string | User;
    refId: string;
    authority: string;
    label: TransactionLabels[];
    description: string;
    usedCouponCode: string;
    creditBeforeTransaction: number;
}
