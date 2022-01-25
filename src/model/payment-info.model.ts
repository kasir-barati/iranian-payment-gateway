import {
    Model,
    Optional,
    DataTypes,
    Sequelize,
} from 'sequelize';

// These are all the attributes in the User model
interface PaymentAttributes {
    id: string;
    description: string;
    discountId?: string;
    createPaymentGatewayData?: any;
    verifyPaymentGatewayData?: any;
}
interface PaymentCreationAttributes
    extends Optional<PaymentAttributes, 'id'> {}

export class PaymentInfo
    extends Model<
        PaymentAttributes,
        PaymentCreationAttributes
    >
    implements PaymentAttributes
{
    public id!: string; // Note that the `null assertion` `!` is required in strict mode.
    public description: string;
    public discountId: string;
    public createPaymentGatewayData: any;
    public verifyPaymentGatewayData: any;

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
    PaymentInfo.init(
        {
            id: {
                type: DataTypes.UUIDV4,
                primaryKey: true,
            },
            description: {
                type: DataTypes.STRING,
            },
            discountId: {
                type: DataTypes.UUIDV4,
                allowNull: true,
            },
            createPaymentGatewayData: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            verifyPaymentGatewayData: {
                type: DataTypes.JSON,
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
}
