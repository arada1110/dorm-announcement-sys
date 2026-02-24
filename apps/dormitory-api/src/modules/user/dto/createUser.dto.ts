import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsNotEmpty()
    role: string;
}
