import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PUBLIC_METHOD_METADATA } from 'src/constants';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    constructor(private readonly _reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('AuthGuard canActivate called');

        const request = this.getRequest(context);

        if (request.method === 'OPTIONS') {
            return true;
        }

        // Check if the route or controller has the PUBLIC decorator
        const isPublic =
            this._reflector.get(PUBLIC_METHOD_METADATA, context.getHandler()) ||
            this._reflector.get(PUBLIC_METHOD_METADATA, context.getClass());

        // Allow access if the method or class has the PUBLIC decorator
        if (isPublic) {
            return true;
        }

        // Delegate authorization to the parent guard (JWT or API Key authentication)
        return super.canActivate(context);
    }

    getRequest(context: ExecutionContext): Request {
        return context.switchToHttp().getRequest();
    }
}
