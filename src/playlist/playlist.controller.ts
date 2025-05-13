import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@UseGuards(AuthGuard)
@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {
  }
  
  @Post()
  createPlaylist(
    @Body() createPlaylistDto: Prisma.PlayListCreateInput,
    @Req() req: Request,
  ) {
    const user = req['user'] as JwtPayload
    return this.playlistService.create(createPlaylistDto, user.userId);
  }
  
  @Post(':trackId')
  create(
    @Body() createPlaylistDto: Prisma.PlayListCreateInput,
    @Req() req: Request,
    @Param('trackId') trackId?: number,
    ) {
    const user = req['user'] as JwtPayload
    return this.playlistService.create(createPlaylistDto, user.userId, trackId);
  }
  
  @Post('add/:playlistId/:trackId')
  toggleTrackToPlayList(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    return this.playlistService.toggleTrackToPlaylist(playlistId, trackId);
  }
  
  @Get()
  findAll() {
    return this.playlistService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: Prisma.PlayListUpdateInput) {
    return this.playlistService.update(+id, updatePlaylistDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }
}
