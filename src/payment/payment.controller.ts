/* eslint-disable prettier/prettier */
import { Body, Controller, ParseIntPipe, Post, UseGuards, Get, Param } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { InitPaymentDto } from './dto';
import { PaymentService } from './payment.service';
import { JwtGuard } from '../auth/guard'
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('payment')

export class PaymentController {

    constructor(private paymentService:PaymentService){}

    @Post('init')
    initPayment(
       @Body('amount', ParseIntPipe) amount:any,
       @Body('message') message:any,
       @GetUser('email') email: string,
       @GetUser('accountNumber') accountNumber: number,
    ){
        return this.paymentService.initPayment(amount, message, email, accountNumber)
    }

    @Post('verify')
    verify(
        @Body('ref') ref:string,
        @GetUser('email') email:string
    ){
        return this.paymentService.verify(ref, email)
    }

    @Post('withdraw')
    withdraw(
        @Body('account') accountNumber:any,
        @Body('amount') amount:any,
        @GetUser() user:User
    ){
        return this.paymentService.resolve(accountNumber, amount, user)
    }
}
