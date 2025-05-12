import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { ArtistSearchResult, TrackSearchResult } from 'src/search/dto';

@Injectable()
export class SearchService {
  constructor(private readonly database: DatabaseService) {
  }
  
  async search(query: string, type: string, limit?: number, offset?: number) {
    let dataArtists: ArtistSearchResult[] = [];
    let dataTracks: TrackSearchResult[] = [];
    if (type === 'artist') {
      const artistQuery: Prisma.ArtistFindManyArgs = {
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: limit,
        skip: offset,
        include: {
          images: true,
        },
      };
      
      dataArtists = await this.database.artist.findMany(artistQuery);
    } else if (type === 'track') {
      const trackQuery: Prisma.TrackFindManyArgs = {
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: limit,
        skip: offset,
        include: {
          images: true,
          // Favorite: true,
          // listenHistories: true,
        },
      };
      
      dataTracks = await this.database.track.findMany(trackQuery);
    } else {
      [dataArtists, dataTracks] = await Promise.all([
        this.database.artist.findMany({
          where: {
            name: { contains: query, mode: 'insensitive' },
          },
          take: limit,
          skip: offset,
          include: {
            images: true,
          },
        }),
        this.database.track.findMany({
          where: {
            name: { contains: query, mode: 'insensitive' },
          },
          take: limit,
          skip: offset,
          include: {
            images: true,
            // Favorite: true,
            // listenHistories: true,
          },
        }),
      ]);
    }
    
    return {
      artists: dataArtists.map(artist => ({
        ...artist,
        images: artist.images?.map(e => e.url),
      })),
      tracks: dataTracks.map(track => ({
        ...track,
        images: track.images?.map(e => e.url),
      })),
    };
  }
}
