/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
const https = require('https');
import axios from 'axios';
import { isCurrency } from 'class-validator';
import { InitPaymentDto } from './dto';
const request = require('request');
const { initializePayment, verifyPayment } =
  require('../utils/paystack')(request);
import * as Redis from 'redis';
import { Cache } from 'cache-manager';
import { OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { User } from '@prisma/client';
var s = false;
var a,
  b = 0;

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async initPayment(
    amount: any,
    message: any,
    email: string,
    accountNumber: number,
  ) {
    try{
    const {data} = await axios.post('https://api.paystack.co/transaction/initialize', {
      amount:amount*100,
      email:email,
      metadata:{
        amount: amount*100,
        message: message || '',
        debitorAccount: accountNumber,
        creditorAccount: 'test',
      }
    },{
        headers: {
          Authorization:
            'Bearer sk_test_530cc30f2989b68e407c5f8997ee137e23ab40ef',
            'Content-Type': 'application/json'
        },
      });

    return data.data.authorization_url
    }catch(error){
      console.log(error)
    }
  }

  async verify(ref: string, email: string) {
    await this.producerService.produce({
      topic: 'test',
      messages: [
        {
          value: ref,
        },
      ],
    });

    const res = await this.onModuleInit();
    try {
      if (s == false) {
        s = false;
        a = 0;
        b = 0;
        throw new ForbiddenException('Forbidden');
      } else {
        const message = `<b>Your deposit of ${a} was successful your balanace is ${b}</b>`;
        await this.mailService.sendMail(email, message);
        s = false;
        a = 0;
        b = 0;
        return 'Deposit was successful';
      }
    } catch (error) {
      throw error;
    }
  }

  //consumer that processes the transacion

  async onModuleInit(): Promise<any> {
    return await this.consumerService.consume(
      { topic: 'test' },
      {
        eachMessage: async ({ topic, partition, message }): Promise<any> => {
          const ref = message.value.toString();
          console.log(ref);
          try {
            const exists = await this.prisma.transaction.findMany({
              where: {
                ref: ref,
              },
            });
            if (exists[0]) {
              //  throw new ForbiddenException('Cannot process transaction more than once')
              console.log("No")
              return (s = false);
            }
            console.log(ref, ' Pay');
            verifyPayment(ref, async (error, body): Promise<any> => {
              if (error) {
                //handle errors appropriately
                console.log(error);
                console.log('coul error');
                throw new Error('coul error');
              }
              const response = JSON.parse(body);
              console.log(response)
              if (!response.status) {
                console.log("hee")
                return (s = false);
              }
              const mdata = response.data.metadata;
              const transaction = await this.prisma.transaction.create({
                data: {
                  successful: true,
                  amount: parseInt(mdata.amount)/100,
                  creditorAccount: mdata.debitorAccount,
                  debitorAccount: '0',
                  message: mdata.message,
                  ref: ref,
                },
              });
              if (!transaction) {
                console.log('no trans');
              }
              const user = await this.prisma.user.findMany({
                where: {
                  accountNumber: parseInt(mdata.debitorAccount),
                },
              });
              const balance = user[0].balance;
              const am = parseInt(mdata.amount)/100
              const total = balance + am;
              const uu = await this.prisma.user.update({
                where: {
                  accountNumber: parseInt(mdata.debitorAccount),
                },
                data: {
                  balance: total,
                },
              });
              a = am;
              b = total;
              return (s = true);
            });
          } catch (error) {
            throw error;
          }
        },
      },
    );
  }

  async resolve(accountNumber: any, amount: any,user:User) {
    let cachedItem = await this.cacheManager.get('banks');
    if(amount > user.balance) throw new BadRequestException('Insufficient funds');
    if (!cachedItem) {
      const response = await axios.get('https://api.paystack.co/bank', {
        headers: {
          Authorization:
            'Bearer sk_test_c12b45c4a24b3f2822dc455384aae998665807ea',
        },
      });
      const banks = response.data.data;
      const bank = banks.find((item) => item.name === 'Guaranty Trust Bank');
      if (!bank) {
        throw new BadRequestException('Pin not correct');
      }
      console.log('weeee');
      await this.cacheManager.set('banks', JSON.stringify(banks), { ttl: 10 });
      cachedItem = await this.cacheManager.get('banks');
    }
    console.log('JSON.parse(cachedItem)');
    const bank = cachedItem;

    const response1 = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bank.code}`,
      {
        headers: {
          Authorization:
            'Bearer sk_test_c12b45c4a24b3f2822dc455384aae998665807ea',
        },
      },
    );
    // console.log(response1)
    const det = response1.data.data;

    const trans = await this.prisma.transaction.create({
      data: {
        successful: true,
        amount: parseInt(amount),
        creditorAccount: '0',
        debitorAccount: user.accountNumber.toString(),
        message: 'to bank',
        ref: "",
      },
    });

    if(!trans){
      throw new ForbiddenException('Forbidden');
    }

    const total = user.balance - parseInt(amount)

    // const payload = {
    //   type: 'nuban',
    //   name: det.account_name,
    //   account_number: accountNumber,
    //   bank_code: bank.code,
    //   isCurrency: 'NGN',
    // };
    // const recipient = await axios.post(
    //   `https://api.paystack.co/transferrecipient`,
    //   payload,
    //   {
    //     headers: {
    //       Authorization:
    //         'Bearer sk_test_c12b45c4a24b3f2822dc455384aae998665807ea',
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    // const rec = recipient.data.data.recipient_code;
    // const a = parseInt(amount);

    // const payload2 = {
    //   source: 'balance',
    //   amount: a,
    //   recipient: rec,
    //   reason: 'withdrawal from gbese',
    // };

    // console.log(payload2);

    // const response2 = await axios.post(
    //   `https://api.paystack.co/transfer`,
    //   payload2,
    //   {
    //     headers: {
    //       Authorization:
    //         'Bearer sk_test_c12b45c4a24b3f2822dc455384aae998665807ea',
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );

    // console.log(response2);
  }
}
