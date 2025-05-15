import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly databaseService: DatabaseService) {
  }
  
  
  async create(createPlaylistDto: Prisma.PlayListCreateInput, userId: number, trackId?: number) {
    const playlist = await this.databaseService.playList.create({
      data: {
        ...createPlaylistDto,
        user: {
          connect: { id: userId },
        },
        tracks: trackId ? {
          connect: { id: trackId },
        } : undefined,
      },
    });
    return playlist && {
      message: 'Playlist created successfully',
      action: 'CREATED',
    };
  }
  
  async toggleTrackToPlaylist(playlistId: number, trackId: number) {
    const playlist = await this.databaseService.playList.findUnique({
      where: {
        id: playlistId,
      },
      include: {
        tracks: true,
      },
    });
    
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    const trackExists = playlist.tracks.some((track) => track.id === trackId);
    
    await this.databaseService.playList.update({
      where: { id: playlistId },
      data: {
        tracks: trackExists ? {
          disconnect: { id: trackId },
        } : {
          connect: { id: trackId },
        },
      },
    });
    
    return {
      message: trackExists ? 'Track removed from playlist' : 'Track added to playlist',
      action: trackExists ? 'REMOVED' : 'ADDED',
    };
  }
  
  async findAll() {
    return this.databaseService.playList.findMany({
      include: {
        tracks: true,
      },
    });
  }
  
  async findOne(userId: number, id: number) {
    const playlist = await this.databaseService.playList.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            images: true,
            Favorite: { where: { userId } }
          },
        },
      },
    });
    
    return {
      title: playlist?.name,
      description: playlist?.description,
      thumbnailUri: playlist?.tracks?.length && playlist?.tracks.at(0)?.images[0]?.url,
      type: 'PLAYLIST',
      data: {
        tracks: playlist?.tracks.map((track) => ({
          ...track,
          images: track.images.map((e) => e.url),
          Favorite: !!track.Favorite.length,
        })),
        total: playlist?.tracks.length,
      }
    }
  }
  
  async update(id: number, updatePlaylistDto: Prisma.PlayListUpdateInput) {
    return this.databaseService.playList.update({
      where: {
        id,
      },
      data: updatePlaylistDto,
    });
  }
  
  async remove(id: number) {
    return this.databaseService.playList.delete({
      where: { id },
    });
  }
}
