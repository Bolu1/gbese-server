/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, SigninDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService
  ) {}

  async signup(dto: AuthDto) {
    
    try {
      if(dto.password.length<6){
          throw new BadRequestException('Password too short');
      }
      const hash = await argon.hash(dto.password);
      let acc = 0;
      const random = async () => {
        acc = 6900000000 +(Math.floor(10000000 + Math.random() * 90000000));

        const exists = await this.prisma.user.findMany({
          where: {
            accountNumber: acc,
          },
        });

        if (exists[0]){
          if (exists[0].accountNumber == acc) {
            random();
          }
        }
      };
      random();

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          accountNumber: acc,
          accountName: `${dto.firstName} ${dto.lastName}`,
          confirmed: false,
          pin: hash,
          recipient_code: " ",
        },
      });

        const payload ={
          id: user.id
        }

      const token = await this.signMail(user.email, user.id)
      const url = `http://localhost:8000/auth/confirm/${token}`
      const message = `<b>welcome click this suspious looking link to confirm your email ${url}</b>`
      await this.mailService.sendMail(dto.email, message)
      delete user.pin
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentails taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException();

    const pwMatch = await argon.verify(user.hash, dto.password);

    if (!pwMatch) {
      throw new ForbiddenException('Credentails Incorrect');
    }

    // if(!user.confirmed){
    //   throw new UnauthorizedException('Confrim your email')
    // }

    return this.signToken(user.id, user.email, user.balance, user.accountName, user.accountNumber, user.firstName, user.lastName);
  }

  async forgotPassword(email:string){

    try{

        const user = await this.prisma.user.findUnique({
            where:{
                email: email
            }
        })
        if(!user){
            throw new BadRequestException('Account does not exist');
        }

        const token = await this.signMail(user.email, user.id)
        const url = `http://localhost:8000/auth/confirm/${token}`
        const message = `<b>Yo click this suspious looking link to reset your password ${url}</b>`
        await this.mailService.sendMail(user.email, message)

        return "Mail sent"

    }catch(error){
        throw error
    }
  }


  signMail(email: string, userId:any): Promise<string> {
    const payload = {
      sub: userId,
      email
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  signToken(userId: any, email: string, balance:any, accountName:any, accountNumber:any, firstName, lastName): Promise<string> {
    const payload = {
      sub: userId,
      email,
      balance,
      accountNumber,
      accountName,
      firstName,
      lastName
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
  GET
  async confirm(userId){

    try{
      
      const user = await this.prisma.user.update({
        where:{
          id: userId
        },
        data:{
          confirmed: true
        }
      })
      delete user.hash
      delete user.pin
      return user

    }catch(error){
      throw error
    }

  }

  async resetPassword(userId:any, password:string){

    try{
      const hash = await argon.hash(password);
      const user = await this.prisma.user.update({
        where:{
          id: userId
        },
        data:{
          hash: hash
        }
      })
    }catch(error){
      throw error
    }
  }

}
