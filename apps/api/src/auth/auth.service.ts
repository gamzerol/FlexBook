import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

const REFRESH_TOKEN_TTL_DAYS = 30;
const ACCESS_TOKEN_TTL = '15m';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: {
    name: string;
    sector?: string;
    email: string;
    password: string;
  }) {
    const existing = await this.prisma.business.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new ConflictException('Bu e-posta zaten kayıtlı.');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const slug =
      input.name.toLowerCase().replace(/\s+/g, '-') +
      '-' +
      randomUUID().slice(0, 6);

    const business = await this.prisma.business.create({
      data: {
        name: input.name,
        sector: input.sector,
        email: input.email,
        passwordHash,
        slug,
      },
    });

    return this.issueTokenPair(business.id, randomUUID());
  }

  async login(email: string, password: string) {
    const business = await this.prisma.business.findUnique({
      where: { email },
    });
    if (!business || !(await bcrypt.compare(password, business.passwordHash))) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri.');
    }
    return this.issueTokenPair(business.id, randomUUID());
  }

  async refresh(rawToken: string) {
    if (!rawToken) throw new UnauthorizedException('Oturum bulunamadı.');
    const tokenHash = hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!existing || existing.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Oturum süresi doldu, tekrar giriş yapın.',
      );
    }

    if (existing.revoked) {
      // Reuse tespiti: bu token daha once rotate edilmisti, tekrar geldi.
      await this.prisma.refreshToken.updateMany({
        where: { familyId: existing.familyId },
        data: { revoked: true },
      });
      throw new UnauthorizedException(
        'Güvenlik ihlali tespit edildi, tekrar giriş yapın.',
      );
    }

    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revoked: true },
    });
    return this.issueTokenPair(existing.businessId, existing.familyId);
  }

  async logout(rawToken: string) {
    if (!rawToken) return;
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(rawToken) },
      data: { revoked: true },
    });
  }

  private async issueTokenPair(businessId: string, familyId: string) {
    const accessToken = this.jwt.sign(
      { sub: businessId },
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    const rawRefreshToken = randomUUID() + randomUUID();
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_TTL_DAYS * 86_400_000,
    );

    await this.prisma.refreshToken.create({
      data: {
        businessId,
        familyId,
        tokenHash: hashToken(rawRefreshToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      refreshTokenExpiresAt: expiresAt,
    };
  }
}
