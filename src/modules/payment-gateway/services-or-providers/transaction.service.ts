import { FilterQuery, UpdateQuery } from 'mongoose';
import { ObjectId } from 'mongodb';
import axios from 'axios';

import {
    RefModel,
    TransactionLabels,
    TransactionModel,
    TransactionStatus,
} from '../models/transaction.model';
import config from '../config/consts';
import { Transaction } from '../models/transaction.model';
import { BaseRepository } from './base-repository';
import { PaginationQueryStringDto } from '../dto/input-dto/pagination-query-string.dto';
import {
    AdminTransactionFilterDto,
    UserTransactionFilterDto,
} from '../dto/input-dto/transaction-filter.input-dto';
import { logger } from '../config/winston';
import { MembershipPlan } from '../models/memberShip-plan.model';
import { Contractor } from '../models/contractor.model';
import { ContractorService } from './contractor.service';

export class PaymentError extends Error {
    public redirectUrl: string;
    constructor(message: string, redirectUrl: string) {
        super(message);
        this.redirectUrl = redirectUrl;
    }
}

export class CreatePaymentGatewayError extends Error {
    public data: string;
    constructor(message: string, data: string) {
        super(message);
        this.data = data.toUpperCase();
    }
}

class TransactionRepository extends BaseRepository<Transaction> {
    constructor() {
        super(TransactionModel);
    }
}

export class TransactionService {
    private transactionRepository: TransactionRepository;
    protected contractorService: ContractorService;
    protected transaction: Transaction | null;
    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.contractorService = new ContractorService();
    }

    async create(body: DeepPartial<Transaction>) {
        const transaction = await this.transactionRepository.create(
            body,
        );
        return transaction;
    }

    async getTransactionById(id: string) {
        const transaction = await this.transactionRepository.findById(
            id,
        );
        return transaction;
    }

    async userGetTransactions(
        userId: string,
        query: UserTransactionFilterDto,
        page: PaginationQueryStringDto,
    ) {
        const mongodbQuery: { $and: any[] } = {
            $and: [
                {
                    owner: userId,
                },
            ],
        };

        if (query.endDate) {
            mongodbQuery.$and.push({
                createdAt: {
                    $lte: query.endDate,
                },
            });
        }
        if (query.startDate) {
            mongodbQuery.$and.push({
                createdAt: {
                    $gte: query.startDate,
                },
            });
        }
        if (query.label) {
            mongodbQuery.$and.push({ label: query.label });
        }
        if (query.status) {
            mongodbQuery.$and.push({ status: query.status });
        }

        const count = await this.transactionRepository.countDocuments(
            mongodbQuery,
        );
        const transactions = await this.transactionRepository.find(
            mongodbQuery,
            undefined,
            {
                [page.sortBaseOn]: page.sort,
            },
            {
                skip: (page.page - 1) * page.limit,
                limit: page.limit,
            },
        );

        return { count, transactions };
    }

    async adminFindAll(
        query: AdminTransactionFilterDto,
        page: PaginationQueryStringDto,
    ) {
        const $match: { $and: any[] } = {
            $and: [
                ...(query.endDate
                    ? [
                          {
                              createdAt: {
                                  $lte: query.endDate,
                              },
                          },
                      ]
                    : []),
                ...(query.startDate
                    ? [
                          {
                              createdAt: {
                                  $gte: query.startDate,
                              },
                          },
                      ]
                    : []),
                ...(query.label ? [{ label: query.label }] : []),
                ...(query.userId
                    ? [{ owner: new ObjectId(query.userId) }]
                    : []),
                ...(query.status ? [{ status: query.status }] : []),
            ],
        };

        const $facet = {
            transactions: [
                { $sort: { [page.sortBaseOn]: page.sort } },
                { $skip: page.limit * (page.page - 1) },
                { $limit: page.limit },
            ],
        };
        const mongodbQuery = [
            ...($match.$and.length > 0 ? [{ $match }] : []),
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            {
                $unwind: {
                    path: '$owner',
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $facet },
        ];

        const count = await this.transactionRepository.countDocuments(
            $match.$and.length > 0 ? $match : {},
        );
        const { transactions }: { transactions: Transaction[] } = (
            await this.transactionRepository.aggregate(mongodbQuery)
        )[0];

        return { count, transactions };
    }

    async find(
        query: FilterQuery<Transaction>,
    ): Promise<Transaction | null> | never {
        const transaction = await this.transactionRepository.findOne(
            query,
        );
        return transaction;
    }

    count(query: any): Promise<number> | never {
        return this.transactionRepository.countDocuments(query);
    }

    async requestPayment(
        amount: number,
        phoneNumber: string,
        payerName: string,
        description: string,
        returnUrl: string,
        clientRefId: string,
    ): Promise<string> | never {
        const transaction = await this.find({
            authority: clientRefId,
        });
        try {
            const response = await axios.post(
                `${config.payping_base_url}v2/pay`,
                {
                    amount,
                    payerIdentity: phoneNumber,
                    payerName,
                    description,
                    clientRefId,
                    returnUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.payping_token}`,
                    },
                },
            );

            if (!response) {
                throw new CreatePaymentGatewayError(
                    'response is empty',
                    'empty_response',
                );
            }
            if (Number(response.status) !== 200) {
                throw new CreatePaymentGatewayError(
                    'response.status is not 200 while creating payment gateway',
                    'response_status_is_not_200',
                );
            }
            return `${config.payping_base_url}v2/pay/gotoipg/${response.data.code}`;
        } catch (error) {
            await this.update(transaction!._id.toString(), {
                status: TransactionStatus.FAILED,
                'paymentGateWayFailedData.paymentGateWayFailedData':
                    Object.values(error.response.data),
            });

            throw error;
        }
    }

    async verifyPayment(
        refId: string,
        amount: number,
    ): Promise<boolean> | never {
        let result: boolean;
        try {
            const response = await axios.post(
                `${config.payping_base_url}v2/pay/verify`,
                {
                    refId,
                    amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.payping_token}`,
                    },
                },
            );

            logger.info('Payment verified', { meta: response });
            if (response.status !== 200) {
                result = false;
            } else {
                result = true;
            }
        } catch (error) {
            await this.update(this.transaction!._id.toString(), {
                status: TransactionStatus.FAILED,
                refId: refId,
                'paymentGateWayFailedData.verifyPayment':
                    Object.values(error.response.data),
            });
            result = false;
        }

        return result;
    }

    update(id: string, fields: UpdateQuery<Transaction>) {
        // @ts-ignore
        return this.transactionRepository.update(id, fields);
    }

    async addMembershipPlan(
        membershipPlan: MembershipPlan,
        contractor: Contractor,
    ): Promise<void> | never {
        await this.create({
            amount: membershipPlan?.price ?? 1,
            realAmount: membershipPlan?.price ?? 1,
            owner: contractor!.user!.toString(),
            status: TransactionStatus.SUCCESSFUL,
            refModel: RefModel['bought-plan'],
            asTo: membershipPlan!._id.toString(),
            label: [TransactionLabels.BUY_SUBSCRIBE_PACKAGE_BY_ADMIN],
        });

        await this.contractorService.update(
            contractor._id.toString(),
            {
                activePlan: {
                    plan: membershipPlan?._id.toString(),
                    expireAt: new Date(
                        new Date().getTime() +
                            1000 *
                                24 *
                                60 *
                                60 *
                                membershipPlan!.planLength,
                    ),
                    isActivated: true,
                    activatedAt: new Date(),
                },
                activity: {
                    permittedBuyLead:
                        membershipPlan!.numberOfPermittedBuyLead,
                    permittedBuyLeadBasedOnLevel: {
                        ...(contractor!.level === 3
                            ? { one: 0 }
                            : {
                                  one: membershipPlan!
                                      .levelOneLeadOnLevelOneContractor,
                              }),
                        ...(contractor!.level === 3
                            ? { two: 0 }
                            : {
                                  two: membershipPlan!
                                      .levelTwoLeadOnLevelOneContractor,
                              }),

                        three: membershipPlan!.levelThreeLead,
                    },
                    ...(contractor!.level === 1 ||
                    contractor!.level === 2 ||
                    contractor!.level === 3
                        ? { permittedOnProgressProject: 2 }
                        : {}),
                    ...(contractor!.level === 1 ||
                    contractor!.level === 2 ||
                    contractor!.level === 3
                        ? { permittedUnspecifiedProject: 3 }
                        : {}),
                },
                credit: contractor!.credit - membershipPlan!.price,
                ...(contractor!.credit - membershipPlan!.price <= 0
                    ? { usableCredit: 0 }
                    : { usableCredit: 5 * contractor!.credit }),
            },
        );
    }
}
