import { Injectable } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma:PrismaService){}
  createBookmarks(@GetUser('id') uid: number) {

  }
  getBookmarks() {

  }
}
