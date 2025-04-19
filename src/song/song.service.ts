import { Injectable } from '@nestjs/common';
import { Prisma } from "generated/prisma";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SongService {
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	create(createSongDto: Prisma.SongCreateInput) {
		return this.databaseService.song.create({
			data: createSongDto,
		})
	}
	
	findAll() {
		return this.databaseService.song.findMany();
	}
	
	findOne(id: number) {
		return this.databaseService.song.findUnique({
			where: {id},
		});
	}
	
	update(id: number, updateSongDto: Prisma.SongUpdateInput) {
		return this.databaseService.song.update({
			where: {id},
			data: updateSongDto
		});
	}
	
	remove(id: number) {
		return this.databaseService.song.delete({
			where: {id}
		});
	}
}