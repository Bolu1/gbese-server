/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditPasswordDto, EditUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
              private mailService: MailService,
              private config: ConfigService,
              private jwt: JwtService,
    ) {}

  async editUser(userId: any, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.pin
    delete user.hash;

    return user;
  }

  async editPassword(userId: any, password: any, newPassword: any) {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          id: userId,
        },
      });
      if (!user[0]) throw new ForbiddenException();

      const pwMatch = await argon.verify(user[0].hash, password);

      if (!pwMatch) throw new BadRequestException('Password not correct');
      const hash = await argon.hash(newPassword);
      const User = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hash: hash,
        },
      });
      delete User.pin
      delete User.hash;

      return User;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentails taken');
        }
      }
      console.log(error);
      throw error;
    }
  }

  async delete(userId: any) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return 'User deleted';
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId:number){

    try{
        const user =  await this.prisma.user.findMany({
            where:{
                id: userId
            } 
        })
        delete user[0].pin
        delete user[0].hash
    
        return user[0]
    }catch(error){
        console.log(error)
        throw error
    }

  }

  async getAccount(account:number){

        try{

            const user = await this.prisma.user.findMany({
                where:{
                    accountNumber: account
                },
                select:{
                    accountName: true,
                    accountNumber: true,
                    email: true
                }

            })
            return user

        }catch(error){
            console.log(error)
            throw error
        }
  }

  async editPin(userId:number, pin:any, newPin:any){

    try {
        const user = await this.prisma.user.findMany({
          where: {
            id: userId,
          },
        });
        if (!user[0]) throw new ForbiddenException();
  
        const pwMatch = await argon.verify(user[0].pin, pin);
  
        if (!pwMatch) throw new BadRequestException('Pin not correct');
        const hash = await argon.hash(newPin);
        const User = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            pin: hash,
          },
        });
   
        delete User.pin
        delete User.hash;
  
        return User;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentails taken');
          }
        }
        console.log(error);
        throw error;
      }
  }

  async forgotPin(email:string, userId:any){

    try{
        const token = await this.signMail(email, userId)
        const url = `http://localhost:8000/auth/confirm/${token}`
        const message = `<b>Yo click this suspious looking link to reset your pin ${url}</b>`
        await this.mailService.sendMail(email, message)

        return "Mail sent"
    }catch(error){
      console.log(error)
      throw error
    }
  }

  async resetPin(pin:any, userId:any){
    try{

      const hash = await argon.hash(pin);
      await this.prisma.user.update({
        where:{
          id: userId
        },
        data:{
          pin: hash
        }
      })

      return "Updated"
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

}
