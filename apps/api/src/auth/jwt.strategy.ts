import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Token gecerliyse, buradan donen deger req.user olarak erisilebilir olur.
  async validate(payload: { sub: string }) {
    // MVP'de tek rol var (Owner), ileride Staff eklenince burada
    // veritabanindan gercek rol de cekilebilir.
    return { businessId: payload.sub, role: 'OWNER' as const };
  }
}
