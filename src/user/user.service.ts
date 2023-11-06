import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  getUserProfile(user: any) {
    return { info: { ...user } };
  }

  async editUser(uid: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: uid,
      },
      data: {
        ...dto
      }
    })
    delete user.hash
    return user;
  }
  async getProfileByEmail(email?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) {
      return {
        message: `User not found by email ${email}`,
        code: 200,
      }
    }
    delete user.hash;
    return user;
  }
  async getProfileById(uid: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid
      }
    });
    if (!user) {
      return {
        message: `User not found by id ${uid}`,
        code: 200,
      }
    }
    delete user.hash;
    return user;
  }
}
