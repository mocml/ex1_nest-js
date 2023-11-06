import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
// import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profileById/:id')
  async getProfileByIdParams(@Param('id') id: Number) {
    return this.userService.getProfileById(Number(id));
  }
  @Get('profileById')
  async getProfileByIdQuery(@Query() params: { id: number }) {
    return this.userService.getProfileById(Number(params.id));
  }
  @Get('profileByEmail')
  async getProfileByEmail(@Query() params: { email: string }) {
    return this.userService.getProfileByEmail(params?.email);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getUserProfile(
    @GetUser() user: User
  ) {
    return this.userService.getUserProfile(user);
  }

  @UseGuards(JwtGuard)
  @Patch('edit-profile')
  async editProfile(@GetUser('id') uid: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(uid, dto);
  }
}
