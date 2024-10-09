import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ProxyAgent } from 'proxy-agent';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: process.env.COGNITO_DOMAIN,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.COGNITO_DOMAIN}/.well-known/jwks.json`,
        requestAgent: process.env.HTTPS_PROXY
          ? new ProxyAgent()
          : undefined,
      }),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
