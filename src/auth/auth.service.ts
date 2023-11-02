import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDTO } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService) { }

  async register(dto: AuthDTO) {
    try {
      //generate login hash
      const hash = await argon.hash(dto.pass);
      //save new user to database
      const user = await this.prisma['user'].create({
        data: {
          email: dto.email,
          hash: hash,
        },
      })
      delete user.hash;
      return { message: 'Register success' }//this.signInToken(user)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken'
          )
        }
      }
      throw error;
    }
  }
  async login(dto: AuthDTO) {
    const getUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!getUser) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const pwMatches = await argon.verify(
      getUser.hash,
      dto.pass,
    );
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect', '');
    }
    delete getUser.hash;
    return {
      ... await this.signInToken(getUser),
      data: { ...getUser }
    };
  }
  async logout() {
    return { msg: 'Logout func' }
  }
  async signInToken(user: any): Promise<{
    access_token: string,
    data?: any
  }> {
    const payload = { ...user }
    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret
    })
    return {
      access_token: accessToken,
    }
  }

}