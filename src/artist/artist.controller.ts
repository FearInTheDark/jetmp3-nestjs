import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import ArtistUpdateInput = Prisma.ArtistUpdateInput;

@Controller('artists')
@UseGuards(AuthGuard)
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
	
	@Get(':artistId/tracks')
	getTracks(@Param('artistId') artistId: string, @Query('page') page: number, @Query('size') size: number) {
		return this.artistService.getTracksByArtistId(artistId, page, size);
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
