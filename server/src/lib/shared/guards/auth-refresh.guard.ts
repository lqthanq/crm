import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthRefreshGuard extends AuthGuard('jwt-refresh-token') {
    /**
     * Determines if the current request can proceed by invoking the base class's `canActivate` method.
     * This is used tot enforece authenciation and authorization logic define in the extended class.
     *
     * @param context
     * @returns
     */
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
