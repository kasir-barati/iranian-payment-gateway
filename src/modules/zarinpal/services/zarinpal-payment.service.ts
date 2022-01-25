import axios from 'axios';

import {
    CreatePaymentGatewayInput,
    IPaymentService,
    PaymentDevice,
    PaymentError,
} from '../../../contracts/payment-interface.contract';

export class ZarinpalPaymentGatewayService
    implements IPaymentService
{
    #device;
    #errorResponse;
    #redirectUrl;

    set device(device: PaymentDevice) {
        this.#device = device;
    }

    get device() {
        return this.#device;
    }

    set errorResponse(error: PaymentError) {
        this.#errorResponse = error;
    }

    get errorResponse() {
        return this.#errorResponse;
    }

    set redirectUrl(redirectUrl: string) {
        this.#redirectUrl = redirectUrl;
    }

    get redirectUrl() {
        return this.#redirectUrl;
    }

    verifyPayment() {
        return true;
    }
    async createPaymentGateway(
        payment: CreatePaymentGatewayInput,
    ) {
        const url = `https://www.zarinpal.com/pg/StartPay/${authority}`;
        const {
            description,
            amountInToman,
            email,
            phoneNumber,
        } = payment;
        try {
            const response = await axios.post(url, {
                description,
                amount: amountInToman,
                email,
                phoneNumber,
            });
        } catch (error) {}
        return '';
    }
}
