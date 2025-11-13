import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {

    /**
     * Intercepts the execution context and the call handler.
     * Transforms the data using class-transformer's instanceToPlain.
     * Catches and handles errors, returning appropriate exceptions.
     */
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => instanceToPlain(data)),
            catchError((error: any) => {
                if (error instanceof BadRequestException) {
                    throw new BadRequestException(error.getResponse());
                }

                throw new HttpException(error.message, error.status);
            }),
        );
    }
}
