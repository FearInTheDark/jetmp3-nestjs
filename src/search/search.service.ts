import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import Fuse from 'fuse.js';

@Injectable()
export class SearchService {
  constructor(private readonly database: DatabaseService) {
  }
  
  async search(userId: number, query: string, threshold = 0.5) {
    
    const [rawArtists, rawTracks] = await Promise.all([
      this.database.artist.findMany({
        include: { images: true },
      }),
      this.database.track.findMany({
        include: {
          images: true,
          Favorite: {
            where: { userId },
          },
        },
      }),
    ]);
    
    const artistFuse = new Fuse(rawArtists, {
      keys: ['name'],
      threshold: 0.3,
    });
    
    const trackFuse = new Fuse(rawTracks, {
      keys: ['name', 'artist.name'],
      threshold,
    });
    
    const filteredArtists = artistFuse.search(query).map(a => a.item);
    const filteredTracks = trackFuse.search(query).map(t => t.item);
    
    return {
      artists: filteredArtists.map(artist => ({
        ...artist,
        images: artist.images?.map(i => i.url),
      })),
      tracks: filteredTracks.map(track => ({
        ...track,
        images: track.images?.map(i => i.url),
        Favorite: !!track.Favorite?.length,
      })),
    };
  }
}
