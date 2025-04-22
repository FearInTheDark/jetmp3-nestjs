import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
	
	constructor(private readonly databaseService: DatabaseService) {
	}
	
	async create(createArtistDto: Prisma.ArtistCreateInput) {
		return this.databaseService.artist.create({
			data: createArtistDto
		})
	}
	
	async findAll() {
		return this.databaseService.artist.findMany();
	}
	
	async findOne(id: number) {
		return this.databaseService.artist.findUnique({
			where: {id}
		})
	}
	
	async update(id: number, updateArtistDto: Prisma.ArtistUpdateInput) {
		return this.databaseService.artist.update({
			where: {id},
			data: updateArtistDto
		});
	}
	
	async remove(id: number) {
		return this.databaseService.artist.delete({
			where: {id},
		});
	}
}
