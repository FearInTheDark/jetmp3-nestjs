import { $Enums } from '@prisma/client';

export type ArtistSearchResult = {
  id: number,
  artistId: string | null,
  name: string,
  uri: string | null,
  popularity: number | null
} & {
  images?: { url: string }[]
}
export type TrackSearchResult = {
    id: number,
    artistId: string,
    name: string,
    uri: string,
    artistType: $Enums.ArtistType,
    createdAt: Date,
    updatedAt: Date
  } & {
  images?: { url: string }[]
}
