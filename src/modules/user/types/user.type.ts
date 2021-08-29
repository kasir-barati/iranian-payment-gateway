export interface User extends Document {
    _id: string;
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
