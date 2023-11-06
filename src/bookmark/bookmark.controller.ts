import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { BookmarkDto } from './dto/bookmark.dto';
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) { }

  @UseGuards(JwtGuard)
  @Post('createBookmark')
  createBookmark(@GetUser('id', ParseIntPipe) uid: number, @Body() bookmarkDto: BookmarkDto) {
    return this.bookmarkService.createBookmark(uid, bookmarkDto);
  }

  @Get('getBookmarks')
  getBookmarks() {
    return this.bookmarkService.getBookmarks();
  }

  @Get('getBookMarkById')
  getBookMarkById(@Query('id', ParseIntPipe) id: number) {
    return this.bookmarkService.getBookMarkById(id);
  }

  @Get('getBookmarkByUid')
  getBookmarkByUid(@Query('userId', ParseIntPipe) userId: number) {
    return this.bookmarkService.getBookmarkByUid(userId);
  }

  @UseGuards(JwtGuard)
  @Get('getBookmarkByOwner')
  getBookmarkByOwner(@GetUser('id', ParseIntPipe) id: number) {
    return this.bookmarkService.getBookmarkByOwner(id)
  }
}
