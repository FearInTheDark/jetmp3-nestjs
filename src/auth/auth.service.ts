import * as argon from "argon2"
import { AuthDto } from "src/auth/dto";
import { Prisma } from "generated/prisma";
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from "src/database/database.service";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

@Injectable()
export class AuthService {
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password, {type: argon.argon2id})
		try {
			return await this.databaseService.user.create({
				data: {
					...(dto.name && {name: dto.name}),
					...dto,
					password: hash,
				},
			})
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002')
				throw new ForbiddenException("Credentials taken", {description: "The email or username is already taken"})
			throw error
		}
	}
	
	async signin(dto: AuthDto) {
		const user = await this.databaseService.user.findUnique({
			where: {
				email: dto.email
			}
		})
	}
}
