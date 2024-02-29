import { Body, Controller, HttpCode, HttpStatus, Post, Get, Param, Query } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDTO } from "./dto";
import router from "../constants/router";
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: AuthDTO) {
    return this.authService.register(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDTO) {
    return this.authService.login(dto);
  }

  @Post("log-out")
  logout() {
    return this.authService.logout();
  }
  @Get('gentoken')
  gentoken() {
    return this.authService.gentoken();
  }
  @Post('detoken')
  detoken(@Body() params: { token?: string }) {
    return this.authService.detoken(params?.token)
  }
}