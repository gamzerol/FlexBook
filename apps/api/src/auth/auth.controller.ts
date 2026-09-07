import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const COOKIE_NAME = 'refreshToken';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    dto: { name: string; sector?: string; email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.register(dto);
    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    return { accessToken };
  }

  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.login(dto.email, dto.password);
    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies?.[COOKIE_NAME];
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.refresh(rawToken);
    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
    return { accessToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies?.[COOKIE_NAME];
    if (rawToken) await this.authService.logout(rawToken);
    res.clearCookie(COOKIE_NAME);
    return { loggedOut: true };
  }

  private setRefreshCookie(res: Response, token: string, expiresAt: Date) {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // Not: gelistirmede HTTPS olmadigi icin false. Uretimde true olmali.
      sameSite: 'lax', // Not: gelistirmede farkli portlar arasi (5173->3000) oldugu icin "lax".
      expires: expiresAt,
      path: '/api/v1/auth',
    });
  }
}
