import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthDTO } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from '../prisma/prisma.service';
import *  as jwk from "jsonwebtoken";
import axios, { HttpStatusCode } from "axios";
import { log } from "console";
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
  async gentoken() {
    const UNICA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgIp12J6n68q+y2GuH
qVgF1FeUxj5SJTNAKgcuVDuJCgagCgYIKoZIzj0DAQehRANCAASF+OnOzrv2ZWKE
KjOSsJwWqQVIEe8kElOHkwPK62lIZjMAEgOCtPhMhlpp0GCgrJPEIYGmrCustghS
2SaxsqY+
-----END PRIVATE KEY-----
`;
    const jwtSign = jwk.sign({
      bid: "com.inet.UnicaStudent",
    }, UNICA_PRIVATE_KEY, {
      expiresIn: "18m",
      algorithm: "ES256",
      audience: "appstoreconnect-v1",
      issuer: "69a6de8b-3153-47e3-e053-5b8c7c11a4d1",
      keyid: "34HRQ6FX5H",
    })
    return { appleToken: jwtSign };
  }

  async detoken(token?: string) {
    try {
      const decodeApple = jwk.decode(token);
      return decodeApple
    } catch (error) {
      return error
    }
  };
  async getTransactionId(id?: number) {
    const url = `https://unica.vn/api/v2/get-receipt-apple`;
    const payload = {
      email: 'havanvan2601@gmail.com',
      order_id: id,
      limit: 5,
    }
    try {
      const obj = await axios.post(
        url, payload,
      )
      return obj.data?.data[0] ?? { data: null }
    } catch (error) {

    }
  }
  async checktrans(id?: number) {
    const token = (await this.gentoken()).appleToken;
    const appleUrl = `https://api.storekit.itunes.apple.com/inApps/v1/transactions/${id}`;
    try {
      const signedTransactionInfo = await axios.get(appleUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const transactionsSigned = signedTransactionInfo?.data?.signedTransactionInfo
      return this.detoken(transactionsSigned);
    } catch (error) {
      throw new HttpException(JSON.stringify(error), 500)
    }
  }
  async traninfo(id?: number) {
    try {
      const orderDetail = await this.getTransactionId(id);
      const transDetail = await this.checktrans(orderDetail?.Transaction_id);
      return {
        order_detail: orderDetail ?? {},
        transInfo: transDetail ?? {},
      }
    } catch (error) {
      return {
        order_detail: null,
        transInfo: null,
      }
    }
  }
}