/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { TransactionService } from './transaction.service';
import { JwtGuard } from '../auth/guard'
import { GetUser } from 'src/auth/decorator';
import { User } from "@prisma/client";
import { TransferDto } from './dto/create-transaction.dto';

@UseGuards(JwtGuard)

@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
        ){}

        @Post('transfer')
        transfer(
            @GetUser() user:User,
            @Body() dto:TransferDto
        ){
          return this.transactionService.transfer(user, dto)
        }
    
}
