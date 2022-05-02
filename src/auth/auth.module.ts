/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { MailModule } from "src/mail/mail.module";
import { JwtStrategy } from "./strategy";

@Module({
  imports: [JwtModule.register({}), PrismaService, MailModule, JwtStrategy],
  providers: [AuthService, PrismaService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})


export class AuthModule {}