import {
    Model,
    Optional,
    DataTypes,
    Sequelize,
} from 'sequelize';

import { PaymentStatus } from '../contracts/payment-states.contract';
import { PaymentLabel } from '../contracts/payment-labels.contract';
import { PaymentInfo } from './payment-info.model';

// These are all the attributes in the User model
interface PaymentAttributes {
    id: string;
    paidAt: Date;
    amount: number;
    state: PaymentStatus;
    userId: string;
    label: PaymentLabel[];
    userCreditBeforePayment: number;
    refId?: string;
    authority?: string;
    paymentInfoId?: string;
}
interface PaymentCreationAttributes
    extends Optional<PaymentAttributes, 'id'> {}

export class PaymentModel
    extends Model<
        PaymentAttributes,
        PaymentCreationAttributes
    >
    implements PaymentAttributes
{
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public paidAt: Date;
    public amount: number; // for nullable fields
    public state: PaymentStatus;
    public userId: string;
    public label: PaymentLabel[];
    public userCreditBeforePayment: number;
    public refId?: string;
    public authority?: string;
    public paymentInfoId?: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    // public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    // public addProject!: HasManyAddAssociationMixin<
    //     Project,
    //     number
    // >;
    // public hasProject!: HasManyHasAssociationMixin<
    //     Project,
    //     number
    // >;
    // public countProjects!: HasManyCountAssociationsMixin;
    // public createProject!: HasManyCreateAssociationMixin<Project>;

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    // public static associations: {
    //     projects: Association<User, Project>;
    // };
}
export const TABLE_NAME = 'payments';
export function init(sequelize: Sequelize) {
    PaymentModel.init(
        {
            id: {
                type: DataTypes.UUIDV4,
                primaryKey: true,
            },
            state: {
                type: DataTypes.ENUM(
                    ...Object.values(PaymentStatus),
                ),
            },
            paidAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            amount: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.UUIDV4,
            },
            label: {
                type: DataTypes.ENUM(
                    ...Object.values(PaymentLabel),
                ),
            },
            userCreditBeforePayment: {
                type: DataTypes.INTEGER,
            },
            refId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            authority: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            paymentInfoId: {
                type: DataTypes.UUIDV4,
                allowNull: true,
            },
        },
        {
            tableName: TABLE_NAME,
            sequelize,
            timestamps: true,
            paranoid: true,
        },
    );

    PaymentModel.hasOne(PaymentInfo, {
        constraints: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        sourceKey: 'id',
    });
    PaymentInfo.belongsTo(PaymentModel, {
        targetKey: 'id',
        onDelete: 'SET NULL',
    });
}
