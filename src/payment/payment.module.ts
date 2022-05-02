/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { JwtStrategy } from "../auth/strategy";
import { PrismaService } from "src/prisma/prisma.service";


@Module({
  imports: [ MailModule, PrismaService, JwtStrategy],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
