/* eslint-disable prettier/prettier */
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';
import * as redisStore from 'cache-manager-redis-store'
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({isGlobal:true,}), 
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
      isGlobal: true
    }),
    AuthModule, 
    PrismaModule, UserModule, TransactionModule, PaymentModule, KafkaModule],
})
export class AppModule {}
