import { $Enums } from '@prisma/client';

export type TrackCreateInputWithImages = {
    name: string
    uri: string
    artistId: string
    artistType: $Enums.ArtistType
    images?: string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }