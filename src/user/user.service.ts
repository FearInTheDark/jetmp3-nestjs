import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from "generated/prisma";
import { DatabaseService } from "src/database/database.service";
import * as argon from "argon2"
import Role = $Enums.Role;

@Injectable()
export class UserService {
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	async create(createUserDto: Prisma.UserCreateInput) {
		const hashed = await argon.hash(createUserDto.password, {
			type: argon.argon2id,
		})
		return this.databaseService.user.create({
			data: {
				...createUserDto,
				password: hashed
			},
		});
	}
	
	async findAll(role?: Role) {
		return this.databaseService.user.findMany(role && {
			where: {role}
		});
	}
	
	async findOne(id: number) {
		return this.databaseService.user.findUnique({
			where: {id}
		});
	}
	
	async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
		return this.databaseService.user.update({
			where: {id},
			data: updateUserDto
		});
	}
	
	async remove(id: number) {
		return this.databaseService.user.delete({
			where: {id},
		});
	}
}
