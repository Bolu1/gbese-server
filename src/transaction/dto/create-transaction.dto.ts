/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsOptional, isString, IsString } from "class-validator"
export class TransferDto {

    @IsString()
    pin: string

    @IsString()
    amount: string

    @IsString()
    accountNumber: string

    @IsString()
    @IsOptional()
    message?: string
}