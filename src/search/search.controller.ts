import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from 'src/search/search.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }
  
  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type: string = "any",
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (query.length === 0)  return []
    return await this.searchService.search(query, type, limit, offset);
  }
}
