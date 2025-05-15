import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from 'src/favorite/favorite.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Role } from 'src/role/role.decorator';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {
  }
  
  @Post()
  async toggleUserFavorite(
    @Req() req: Request,
    @Query("trackId", ParseIntPipe) trackId: number
  ) {
    const user = req['user'] as JwtPayload
    return this.favoriteService.toggleUserFavorite(user.userId, trackId)
  }
  
  @Get()
  async getMyFavorites(
    @Req() req: Request,
    @Query("page") page?: number,
    @Query("size") size?: number
  ) {
    const user = req['user'] as JwtPayload
    return this.favoriteService.getUserFavoriteTracks(user.userId, page, size)
  }
  
  @Role("ADMIN")
  @Get(":trackId")
  async getFavoriteUsers(
    @Req() req: Request,
    @Param("trackId", ParseIntPipe) trackId: number
  ) {
    return this.favoriteService.getTrackIsFavoriteBy(trackId)
  }
}
