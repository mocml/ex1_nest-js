import { Injectable, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) { }
  async createBookmark(uid: number, data: BookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId: uid,
        title: data.title,
        link: data?.link,
        description: data.description,
      }
    })
    return {
      msg: 'Create book mark success',
      data: bookmark,
      status: 200,
    }
  }

  async getBookmarks() {
    const bookmarks = await this.prisma.bookmark.findMany();
    return {
      data: bookmarks ?? [],
      total: bookmarks?.length ?? 0
    }
  }

  async getBookMarkById(id: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: id
      }
    })
    return bookmark ?? {};
  }

  async getBookmarkByUid(uid: number) {
    const bookmark = await this.prisma.bookmark.findMany({
      where: {
        userId: uid
      }
    });
    return bookmark ?? []
  }

  async getBookmarkByOwner(id: number) {
    return this.getBookmarkByUid(id);
  }
}
