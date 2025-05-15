import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
		@Query("img") img: boolean = true,
		@Req() req: any
	) {
		console.log("Route: GET /tracks");
		return this.trackService.findAll(img, req.user.userId);
	}
	
	@Get('categories')
	getUserCategories(
		@Req() user: any
	) {
		return this.trackService.getUserCategories(user.userId);
	}
	
	@Get('history')
	getUserHistory(
		@Req() user: any,
		@Query('page') page: number = 0,
		@Query('size') size: number = 10,
	) {
		return this.trackService.getUserHistory(user.userId, page, size);
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.trackService.findOne(+id);
	}
	
	@Post('listen/:trackId')
	addListenedTrack(
		@Req() req: any,
		@Param('trackId', ParseIntPipe) trackId: number,
	) {
		return this.trackService.addListenedTrack(req.user.userId, trackId);
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
