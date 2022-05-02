/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { TransferDto } from './dto/create-transaction.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TransactionService{
  constructor(
    private producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

  async transfer(user:User, dto:TransferDto){
    try{

      const pwMatch = await argon.verify(user.pin, dto.pin);
      const recepient = await this.prisma.user.findUnique({
        where: {
          accountNumber: parseInt(dto.accountNumber),
        }
      })

      const am = parseInt(dto.amount)

      //checks
      if(!recepient) throw new BadRequestException('Recepient does not exsist');
      if (!pwMatch) throw new BadRequestException('Pin not correct');
      if(am > user.balance) throw new BadRequestException('I\'m afraid you don\'t have the funds for that big man');

      //update ledger first
      const transaction = await this.prisma.transaction.create({
        data: {
          successful: true,
          amount: am,
          debitorAccount: user.accountNumber.toString(),
          creditorAccount: dto.accountNumber,
          message: dto.message,
          ref: "transfer",
        },
      });
      const total = user.balance - am
      await this.prisma.user.update({
        where:{
          accountNumber: user.accountNumber
        },
        data:{
          balance: total
        }
      })
      const total1 = recepient.balance + am
      await this.prisma.user.update({
        where:{
          accountNumber: parseInt(dto.accountNumber)
        },
        data:{
          balance: total1
        }
      })
      const message = `<b>You sent ${am} to ${dto.accountNumber} your balanace is now ${total}</b>`;
      await this.mailService.sendMail(user.email, message);

      const message1 = `<b>You recieved ${am} from ${user.accountNumber} your balanace is now ${total1}</b>`;
      await this.mailService.sendMail(recepient.email, message);

      return "Transaction was successful"

    }catch(error){
      throw error
    }
    

  }

}
