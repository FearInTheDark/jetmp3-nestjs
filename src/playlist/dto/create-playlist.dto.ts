export interface CreatePlaylistDto {
  name: string;
  description?: string;
  userId: number;
  trackIds?: number[];
}
