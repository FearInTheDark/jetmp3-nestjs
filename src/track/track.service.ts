import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

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
		const tracks =  await this.databaseService.track.findMany({
			include: {
				images: true
			},
		});
		
		return tracks.map(track => ({
			...track,
			images: track.images.map(e => e.url)
		}))
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
