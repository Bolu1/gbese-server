/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, isString, IsString } from "class-validator"

export class EditUserDto {


    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    accountName?: string
}

export class EditPasswordDto {

    password: string

    newPassword: string
}