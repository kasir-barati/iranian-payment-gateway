import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentGatewayModule } from './modules/payment-gateway/payment-gateway.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [PaymentGatewayModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
