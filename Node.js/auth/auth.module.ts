import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: {
        expiresIn: '60s',
        algorithm: 'RS256',
      },
    }),
  ],
  providers: [
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule { }
