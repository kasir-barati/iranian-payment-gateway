export enum PaymentDevice {
    'mobile' = 'mobile',
    'desktop' = 'desktop',
}

export interface PaymentError {
    redirectTo: string;
    message: string;
    paymentGatewayResponse: any;
}

export interface IPaymentService {
    device: PaymentDevice;
    redirectUrl: string;
    errorResponse: PaymentError;
    createPaymentGateway(
        payment: CreatePaymentGatewayInput,
    ): Promise<string> | never;
    verifyPayment(): boolean;
}

export interface CreatePaymentGatewayInput {
    amountInToman: number;
    description: string;
    phoneNumber: string;
    email: string;
}
