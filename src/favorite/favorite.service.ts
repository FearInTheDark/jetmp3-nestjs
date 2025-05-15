import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly databaseService: DatabaseService) {
  }
  
  async toggleUserFavorite(userId: number, trackId: number) {
    console.log(`userID: ${userId}, trackId: ${trackId}`);
    const existingFavorite = await this.databaseService.favorite.findFirst({
      where: {
        userId,
        trackId,
      },
    });
    
    if (existingFavorite) {
      return await this.databaseService.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      }) && {
        message: 'Favorite removed successfully',
        action: 'REMOVED',
      };
    }
    
    return await this.databaseService.favorite.create({
      data: {
        userId,
        trackId,
      },
    }) && {
      message: 'Favorite added successfully',
      action: 'ADDED',
    };
  }
  
  async getUserFavoriteTracks(userId: number, page = 0, size = 10) {
    if (page < 0 || size <= 0) {
      throw new Error('Invalid pagination parameters');
    }
    
    const skip = page * size;
    
    const [favorites, total] = await this.databaseService.$transaction([
      this.databaseService.favorite.findMany({
        where: { userId },
        include: {
          track: {
            include: { images: true },
          },
        },
        skip,
        take: size,
      }),
      this.databaseService.favorite.count({
        where: { userId },
      }),
    ]);
    
    return {
      title: 'My Favorites Tracks',
      thumbnailUri: 'https://misc.scdn.co/liked-songs/liked-songs-640.jpg',
      data: {
        tracks: favorites.map(fav => ({
          ...fav.track,
          images: fav.track.images.map(e => e.url),
        })),
        total,
        page,
        size,
      },
    };
  }
  
  async getTrackIsFavoriteBy(trackId: number) {
    const favorites = await this.databaseService.favorite.findMany({
      where: { trackId },
    });
    
    return {
      data: favorites.map(fav => fav.userId),
      total: favorites.length,
    };
  }
}
