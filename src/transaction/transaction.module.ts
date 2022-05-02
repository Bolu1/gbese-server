/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { JwtStrategy } from "../auth/strategy";
import { PrismaService } from "src/prisma/prisma.service";
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ MailModule, PrismaService, JwtStrategy, ],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, JwtStrategy]
})
export class TransactionModule {}
