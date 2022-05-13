/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Patch, Delete, ParseIntPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { userInfo } from "os";
import { UserService } from "./user.service";
import { JwtGuard } from '../auth/guard'
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client";
import { EditUserDto, EditPasswordDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('user')

export class UserController {
    constructor(private userService: UserService){}
    @Get('me')
    getAll(@GetUser() user:User ){

        delete user.pin
        return user
    }

    @Post('getName')
    getName(
        @Body('account') accountNumber: any
    ){
        return this.userService.getName(accountNumber)
    }

    @Get(':id')
    getUser(
        @GetUser() user:User,
        @Param('id', ParseIntPipe) userId:any
    ){
        return this.userService.getUser(userId)
    }

    @Patch('edit')
    editUser(
        @GetUser() user: any,
        @Body() dto: EditUserDto){
            return this.userService.editUser(user, dto)
        }

    @Patch('editPassword')
    editPassword(
        @GetUser('id') userId: any,
        @Body('newPassword') newPassword: any,
        @Body('password') password: any){
            return this.userService.editPassword(userId, password, newPassword)
        }

    @Delete('delete')
    delete(@GetUser('id') userId:number ){
        return this.userService.delete(userId)
    }

    @Get("account/:account")
    getAccount(
        @GetUser('id') userId: number,
        @Param('account', ParseIntPipe) account:number ){
        return this.userService.getAccount(account)
    }
    

    @Patch("editPin")
    editPin(
        @GetUser('id') userId: any,
        @Body('pin') pin: any,
        @Body('newPin') newPin: any
    ){
        return this.userService.editPin(userId, pin, newPin)
    }

    @Post("forgotPin")
    forgotPin(
        @GetUser('id') userId: any,
        @GetUser('email') email: string,
    ){
        return this.userService.forgotPin(email, userId)
    }

    @Post("resetPin")
    resetPin(
        @GetUser('id') userId: any,
        @Body('pin') pin: any
    ){
        return this.userService.resetPin(pin, userId)
    }

}