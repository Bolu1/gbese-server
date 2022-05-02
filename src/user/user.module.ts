/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { JwtStrategy } from "../auth/strategy";

@Module({
    imports: [JwtModule.register({}), PrismaService, MailModule, JwtStrategy],
    providers: [UserService,  PrismaService, JwtStrategy],
    controllers: [UserController]
})

export class UserModule {}