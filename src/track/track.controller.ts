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
		@Req() req: any
	) {
		return this.trackService.getUserCategories(req.user.userId);
	}
	
	@Get('history')
	getUserHistory(
		@Req() req: any,
	) {
		return this.trackService.getUserHistory(req.user.userId);
	}
	
	@Get(':id')
	findOne(
		@Req() req: any,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.trackService.findOne(req.user.userId, id);
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
