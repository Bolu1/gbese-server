/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsNumber, IsOptional, isString, IsString } from "class-validator"
export class InitPaymentDto {

    @IsString()
    amount: string

    @IsString()
    @IsOptional()
    message: string
}