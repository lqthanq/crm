import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { EmployeeService } from 'src/lib/employee/employee.service';
import { environment as env } from 'src/config';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from 'src/contracts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    public loggingEnabled: boolean = false;

    constructor(
        private readonly _authService: AuthService,
        private readonly _employeeService: EmployeeService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET!,
        });
    }

    async validate(payload: JwtPayload, done: (err: unknown, user?: unknown) => void): Promise<void> {
        try {
            const { id, employeeId } = payload;

            if (this.loggingEnabled) {
                console.log('Validate JWT payload:', payload);
            }

            const user: IUser | null = await this._authService.getAuthenticatedUser(id);

            if (!user) {
                return done(new UnauthorizedException('unauthorized'), false);
            } else {
                // Check if employeeId exists in payload
                if (employeeId) {
                    // Retrieve employee details associated with the user
                    const employee = await this._employeeService.findOneByUserId(user.id!);

                    // Check if the employeeId from payload matches the employeeId retrieved
                    if (!employee || employeeId !== employee.id) {
                        return done(new UnauthorizedException('unauthorized'), false);
                    }

                    // Assign employeeId to user if employee if found, otherwise assign null
                    user.employeeId = employee.id;
                }

                done(null, user);
            }
        } catch (error) {
            console.error('Error occurred during JWT validator:', error);
            return done(new UnauthorizedException('unauthorized', error.message), false);
        }
    }
}
