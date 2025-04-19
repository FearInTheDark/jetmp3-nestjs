import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SongService } from './song.service';
import { Prisma } from "generated/prisma";

@Controller('song')
export class SongController {
	constructor(private readonly songService: SongService) {
	}
	
	@Post()
	create(@Body() createSongDto: Prisma.SongCreateInput) {
		return this.songService.create(createSongDto);
	}
	
	@Get()
	findAll() {
		return this.songService.findAll();
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.songService.findOne(+id);
	}
	
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateSongDto: Prisma.SongUpdateInput) {
		return this.songService.update(+id, updateSongDto);
	}
	
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.songService.remove(+id);
	}
}
