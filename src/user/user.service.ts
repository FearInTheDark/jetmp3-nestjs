import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from "generated/prisma";
import { DatabaseService } from "src/database/database.service";
import Role = $Enums.Role;

@Injectable()
export class UserService {
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	async create(createUserDto: Prisma.UserCreateInput) {
		return this.databaseService.user.create({
			data: createUserDto,
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
