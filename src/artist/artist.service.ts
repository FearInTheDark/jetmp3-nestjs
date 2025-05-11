import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  
  constructor(private readonly databaseService: DatabaseService) {
  }
  
  async create(createArtistDto: Prisma.ArtistCreateInput) {
    return this.databaseService.artist.create({
      data: createArtistDto,
    });
  }
  
  async findAll(ids?: string) {
    const arr = ids?.split(',').map((id) => ({ artistId: id }));
    return this.databaseService.artist.findMany({
      where: {
        OR: arr,
      },
      include: {
        images: true,
      },
    });
  }
  
  async findOne(artistId: string) {
    return this.databaseService.artist.findUnique({
      where: { artistId },
    });
  }
  
  async update(id: number, updateArtistDto: Prisma.ArtistUpdateInput) {
    return this.databaseService.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }
  
  async remove(id: number) {
    return this.databaseService.artist.delete({
      where: { id },
    });
  }
  
  async getTracksByArtistId(artistId: string, page = 1, size = 10) {
    const skip = (page - 1) * size;
    
    return this.databaseService.track.findMany({
      where: {
        artistId: artistId,
      },
      include: {
        images: true,
        Favorite: true,
        listenHistories: true,
      },
      skip,
      take: size,
    });
  }
}
