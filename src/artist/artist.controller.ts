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
	findAll(
		@Query("ids") ids?: string
	) {
		return this.artistService.findAll(ids);
	}
	
	@Get(':artistId/tracks')
	getTracks(@Param('artistId') artistId: string) {
		return this.artistService.getTracksByArtistId(artistId);
	}
	
	@Get(':artistId')
	findOne(@Param('artistId') artistId: string) {
		return this.artistService.findOne(artistId);
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
