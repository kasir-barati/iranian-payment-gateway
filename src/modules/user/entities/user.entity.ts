import { Schema, Document, model, Model, Types } from 'mongoose';
import { UserOutputDto } from '../dto/output-dto/user.output-dto';

export const COLLECTION_NAME = 'user';
export interface User extends Document {
    _id: Types.ObjectId;
    role: UserRoles;
    phoneNumber: string;
    username: string;
    password: {
        salt: string;
        hash: string;
    };
    lastname: string;
    name: string;
    gender: GenderEnum;
    isPhoneNumberVerified: boolean;
    verificationCode: string;
    whatsappPhoneNumber: string;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}
export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UNKNOWN = 'UNKNOWN',
}

export enum UserRoles {
    ADMIN = 'ADMIN',
    CONTRACTOR = 'CONTRACTOR',
}

const userSchema = new Schema<User, UserStaticMethods>(
    {
        phoneNumber: { type: String, required: true, unique: true },
        role: { type: String, enum: Object.keys(UserRoles) },
        username: { type: String, unique: true, required: false },
        password: {
            salt: String,
            hash: String,
        },
        lastname: String,
        name: String,
        gender: { type: String, enum: Object.values(GenderEnum) },
        isPhoneNumberVerified: { type: Boolean, default: false },
        verificationCode: String,
        whatsappPhoneNumber: String,
    },
    {
        timestamps: true,
    },
);

userSchema.index({ lastname: 1 });
userSchema.index({ phoneNumber: 1 });

interface UserStaticMethods extends Model<User> {
    isPhoneNumberTaken(phoneNumber: string): Promise<boolean>;
    toDto(user: User): UserOutputDto;
}

userSchema.static('toDto', function (user: User): UserOutputDto {
    return new UserOutputDto(user);
});

userSchema.static(
    'isPhoneNumberTaken',
    async function (phoneNumber: string): Promise<boolean> {
        const user = await this.findOne({ phoneNumber: phoneNumber });

        if (user) return true;
        else return false;
    },
);

export const UserModel = model<User, UserStaticMethods>(
    COLLECTION_NAME,
    userSchema,
);
