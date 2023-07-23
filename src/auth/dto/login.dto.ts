import { IsEmail, IsString, MinLength } from "class-validator";



export class LoginDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password should be at least 6 characters' })
    password: string;
}