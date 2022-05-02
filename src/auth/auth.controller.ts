/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Post, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SigninDto } from './dto';
import { JwtGuard } from '../auth/guard'
import { GetUser } from "src/auth/decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('signup')
    signup(@Body() dto:AuthDto) {
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto:SigninDto) {
        return this.authService.signin(dto)
    }

    @UseGuards(JwtGuard)
    @Get('confirm')
    confirm(
        @GetUser('id') userId: any){
        return this.authService.confirm(userId)
    }

    @Post('forgotPassword')
    forgotPassword(
        @Body('email') email:string
    ){
        return this.authService.forgotPassword(email)
    }


    @UseGuards(JwtGuard)
    @Post('resetPassword')
    resetPassword(
        @GetUser('id') userId: any,
        @Body('password') password: string
        ){
            return this.authService.resetPassword(userId, password)
        }

        
        
}
