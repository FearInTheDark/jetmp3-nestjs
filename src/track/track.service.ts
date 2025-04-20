import { Injectable } from '@nestjs/common';
import { Prisma } from "generated/prisma";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class TrackService {
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	
	async create(createTrackDto: Prisma.TrackCreateInput) {
		return this.databaseService.track.create({
			data: createTrackDto,
		});
	}
	
	async findAll() {
		return this.databaseService.track.findMany();
	}
	
	async findOne(id: number) {
		return this.databaseService.track.findUnique({
			where: { id },
		});
	}
	
	async update(id: number, updateTrackDto: Prisma.TrackUpdateInput) {
		return this.databaseService.track.update({
			where: { id },
			data: updateTrackDto,
		});
	}
	
	async remove(id: number) {
		return this.databaseService.track.delete({
			where: { id },
		});
	}
}
