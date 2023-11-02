import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) { }
  @Get('createBookmark')
  createBookmarks() {

  }
  @Get('getBookmarks')
  getBookmarks() {

  }

}
