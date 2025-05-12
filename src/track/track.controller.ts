import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TrackService } from './track.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { TrackCreateInputWithImages } from 'src/track/dto/TrackCreateWithImages';

@Controller('tracks')
@UseGuards(AuthGuard)
export class TrackController {
	constructor(private readonly trackService: TrackService) {
	}
	
	@Post()
	create(@Body() createTrackDto: Prisma.TrackCreateInput) {
		return this.trackService.create(createTrackDto);
	}
	
	@Post("images")
	createWithImages(@Body() trackWithImages: TrackCreateInputWithImages) {
		return this.trackService.createWithImages(trackWithImages)
	}
	
	@Get()
	findAll(
		@Query("img") img?: boolean,
	) {
		return this.trackService.findAll(img);
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.trackService.findOne(+id);
	}
	
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTrackDto: Prisma.TrackUpdateInput) {
		return this.trackService.update(+id, updateTrackDto);
	}
	
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.trackService.remove(+id);
	}
}
