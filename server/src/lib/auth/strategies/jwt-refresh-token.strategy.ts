import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from 'src/config';
import { UserService } from 'src/lib/user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: environment.JWT_REFRESH_TOKEN_SECRET!,
            passReqToCallback: true,
            ignoreExpiration: false,
        });
    }

    async validate(request: Request, payload: JwtPayload, done: (err: unknown, user?: unknown) => void): Promise<void> {
        try {
            const { refresh_token } = request.body;

            // Validate the user using the refresh token and JWT payload
            const user = await this.userService.getUserIfRefreshTokenMatches(refresh_token, payload);

            if (!user) {
                return done(new UnauthorizedException('Unauthorized'), false);
            }

            done(null, user);
        } catch (error) {
            // Handler errors and provide a meaningful response
            return done(new UnauthorizedException('Unauthorized', error.message), false);
        }
    }
}
