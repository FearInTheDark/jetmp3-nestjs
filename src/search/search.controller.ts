import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from 'src/search/search.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }
  
  @Get()
  async search(
    @Req() req: any,
    @Query('q') query: string,
    @Query('threshold') threshold?: number,
  ) {
    if (query.length === 0)  return []
    return await this.searchService.search(req.user.userId, query, threshold);
  }
}
