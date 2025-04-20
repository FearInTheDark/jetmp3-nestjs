import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
	
	@IsOptional()
	@IsString()
	name: string | null;
	
	@IsEmail()
	@IsNotEmpty()
	email: string;
	
	@IsString()
	@IsNotEmpty()
	password: string;
}