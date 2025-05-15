import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { ArtistSearchResult, TrackSearchResult } from 'src/search/dto';

@Injectable()
export class SearchService {
  constructor(private readonly database: DatabaseService) {
  }
  
  async search(query: string, type: string, limit?: number, offset?: number) {
    let dataArtists: ArtistSearchResult[];
    let dataTracks: TrackSearchResult[];
    
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
    const trackQuery: Prisma.TrackFindManyArgs = {
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      skip: offset,
      include: {
        images: true,
        Favorite: true,
      },
    };
    
    dataArtists = await this.database.artist.findMany(artistQuery);
    dataTracks = await this.database.track.findMany(trackQuery);
    
    return {
      artists: dataArtists.map(artist => ({
        ...artist,
        images: artist.images?.map(e => e.url),
      })),
      tracks: dataTracks.map(track => ({
        ...track,
        images: track.images?.map(e => e.url),
        Favorite: !!track.Favorite?.length
      })),
    };
  }
}
