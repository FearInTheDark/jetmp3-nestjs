import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { TrackCreateInputWithImages } from 'src/track/dto/TrackCreateWithImages';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {
  }
  
  
  async create(createTrackDto: Prisma.TrackCreateInput) {
    return this.databaseService.track.create({
      data: createTrackDto,
    });
  }
  
  async createWithImages(createTrackWithImagesDto: TrackCreateInputWithImages) {
    const { images, ...trackData } = createTrackWithImagesDto;
    
    const track = await this.databaseService.track.create({
      data: {
        ...trackData,
        images: {
          create: images?.map(image => ({ url: image })),
        },
      },
      include: {
        images: true,
      },
    });
    
    return {
      ...track,
      images: track.images.map(e => e.url),
    };
  }
  
  async findAll(img: boolean, userId: number) {
    const tracks = await this.databaseService.track.findMany({
      include: {
        images: img,
        Favorite: {
          where: { userId: userId },
        },
      },
    });
    return tracks.map(track => ({
      ...track,
      images: img ? track.images.map(e => e.url) : undefined,
      Favorite: !!track.Favorite.length,
    }));
  }
  
  async findOne(userId: number, id: number) {
    const track = await this.databaseService.track.findUnique({
      where: { id },
      include: {
        images: true,
        Favorite: {
          where: { userId },
        },
        listenHistories: true,
      },
    });
    if (!track) {
      return null;
    }
    
    return {
      ...track,
      images: track.images.map(e => e.url),
      Favorite: !!track.Favorite.length,
    };
  }
  
  async update(id: number, updateTrackDto: Prisma.TrackUpdateInput) {
    return this.databaseService.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }
  
  async remove(id: number) {
    return this.databaseService.track.delete({
      where: { id },
    });
  }
  
  async addListenedTrack(userId: number, trackId: number) {
    const history = await this.databaseService.listenHistory.create({
      data: {
        userId, trackId,
      },
    });
    
    if (!history) return null;
    
    return {
      message: 'Track added to history successfully',
      action: 'ADDED',
    };
  }
  
  async getUserCategories(userId: number) {
    const playlists = await this.databaseService.playList.findMany({
      where: { userId },
      include: {
        tracks: {
          include: {
            images: true,
          },
        },
      },
    });
    
    const favoriteTracks = await this.databaseService.favorite.findMany({
      where: { userId },
      include: {
        track: true,
      },
    })
    
    return {
      favorite: {
        title: 'Favorite Tracks',
        iconUri: 'https://misc.scdn.co/liked-songs/liked-songs-640.jpg',
        url: 'favorites/',
        trackIds: favoriteTracks.map(e => e.track.id),
      },
      playlists: playlists.map(e => ({
        title: e.name,
        iconUri: e.tracks[0]?.images[0]?.url ?? null,
        url: `playlists/${e.id}`,
        trackIds: e.tracks.map(track => track.id),
      })),
      history: {
        title: 'History Tracks',
        iconUri: null,
        url: 'history/',
        trackId: 0
      },
    };
  }
  
  async getUserHistory(userId: number) {
    const histories = await this.databaseService.listenHistory.findMany({
      where: { userId },
      include: {
        track: {
          include: {
            images: true,
            Favorite: {
              where: { userId },
            },
          },
        },
      },
      orderBy: {
        listenedAt: 'desc',
      },
    });
    
    // Deduplicate by trackId, keeping the most recent
    const seenTrackIds = new Set<number>();
    const uniqueTracks: any[] = [];
    
    for (const history of histories) {
      if (!seenTrackIds.has(history.trackId)) {
        seenTrackIds.add(history.trackId);
        uniqueTracks.push({
          ...history.track,
          images: history.track.images.map(e => e.url),
          Favorite: !!history.track.Favorite.length,
        });
      }
    }
    return {
      title: 'My History Tracks',
      description: 'Tracks you listened to recently',
      thumbnailUri: null,
      type: 'HISTORY',
      data: {
        tracks: uniqueTracks,
        total: uniqueTracks.length,
      },
    };
    
  }
  
  async getTrackHistoryData(userId: number, trackId: number) {
    const histories = await this.databaseService.listenHistory.findMany({
      where: {
        userId, trackId
      },
      orderBy: {
        listenedAt: 'desc',
      },
    })
    
    return histories.map(e => ({
      trackId: e.trackId,
      listenedAt: e.listenedAt
    }));
  }
}
