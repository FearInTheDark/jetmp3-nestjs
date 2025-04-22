import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { $Enums, Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import Role = $Enums.Role;

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {
	}
	
	@Post()
	create(@Body() createUserDto: Prisma.UserCreateInput) {
		return this.userService.create(createUserDto);
	}
	
	@Get()
	findAll(@Query('role') role?: Role) {
		return this.userService.findAll(role);
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}
 
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
		return this.userService.update(+id, updateUserDto);
	}
	
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
