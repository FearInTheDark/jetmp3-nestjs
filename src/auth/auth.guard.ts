import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {
	}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		console.log(`token: ${token}`)
		if (!token) throw new UnauthorizedException("No token provided")
		
		try {
			request['user'] = await this.jwtService.verifyAsync(
				token, {secret: process.env.JWT_SECRET}
			)
		} catch (error) {
			throw new UnauthorizedException(`${error}`)
		}
		
		return true
	}
	
	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		console.log(`type: ${type}`)
		return type === 'Bearer' ? token : undefined
	}
}