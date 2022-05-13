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
    phone?: string

    @IsString()
    @IsOptional()
    profile?: string
}

export class EditPasswordDto {

    password: string

    newPassword: string
}