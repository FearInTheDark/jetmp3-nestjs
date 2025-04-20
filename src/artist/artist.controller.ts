import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Prisma } from "generated/prisma";
import ArtistUpdateInput = Prisma.ArtistUpdateInput;

@Controller('artist')
export class ArtistController {
	constructor(private readonly artistService: ArtistService) {
	}
	
	@Post()
	create(@Body() createArtistDto: Prisma.ArtistCreateInput) {
		return this.artistService.create(createArtistDto);
	}
	
	@Get()
	findAll() {
		return this.artistService.findAll();
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.artistService.findOne(+id);
	}
	
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateArtistDto: ArtistUpdateInput) {
		return this.artistService.update(+id, updateArtistDto);
	}
	
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.artistService.remove(+id);
	}
}
