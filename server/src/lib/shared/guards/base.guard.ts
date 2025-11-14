import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export abstract class BaseGuard implements CanActivate {
    /**
     * Determines whether the current request is authorized to proceed.
     * @param context
     * @returns
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        return true;
    }

    /**
     * Retrieves the request object from the execution context
     */
    protected getRequest(context: ExecutionContext): Request {
        return context.switchToHttp().getRequest();
    }
}
