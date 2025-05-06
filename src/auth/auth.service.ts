import * as argon from 'argon2';
import { AuthDto } from 'src/auth/dto';
import { Prisma } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
	}
	
	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password, {type: argon.argon2id})
		try {
			const user = await this.databaseService.user.create({
				data: {
					email: dto.email,
					password: hash,
					name: dto.name
				}
			})
			return {
				access_token: await this.signToken(user.id, user.email),
				expired_in: this.configService.get<string>('JWT_EXPIRED_IN') || process.env.JWT_EXPIRED_IN,
			}
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
		if (!user) throw new ForbiddenException("Credentials incorrect", {description: "The email or password is incorrect"})
		
		const passwordMatches = await argon.verify(user.password, dto.password)
		if (!passwordMatches) throw new ForbiddenException("Credentials incorrect", {description: "The email or password is incorrect"})
		
		return {
			access_token: await this.signToken(user.id, user.email),
			expired_in: this.configService.get<string>('JWT_EXPIRED_IN') || process.env.JWT_EXPIRED_IN,
		}
	}
	
	async signToken(userId: number, email: string): Promise<string> {
		const payload = {
			userId,
			email,
		}
		
		return this.jwtService.signAsync(payload)
	}
}
