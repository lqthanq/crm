import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestContextMiddleware.name);
    private readonly loggingEnabled = true;

    constructor(private readonly clsService: ClsService) {}

    /**
     * Middleware to manage request context and log request lifecycle
     */
    use(req: Request, res: Response, next: NextFunction) {
        // Start a new context using the ClsService
        this.clsService.run(() => {
            const id = uuidv4();

            const context = new RequestContext({ id, req, res });

            this.clsService.set(RequestContext.name, context);

            // Build the full request URL
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

            // Log the start of the request if logging is enabled
            if (this.loggingEnabled) {
                const contextId = RequestContext.getContextId();
                this.logger.log(`Context ${contextId}: ${req.method} request to ${fullUrl} started.`);
            }

            // Capture the original res.end function
            const originalEnd = res.send.bind(res);

            // Override the res.end function to log when the response finishes
            res.end = (...args: any[]): Response => {
                if (this.loggingEnabled) {
                    const contextId = RequestContext.getContextId();
                    this.logger.log(
                        `Context ${contextId}: ${req.method} request to ${fullUrl} completed with status ${res.statusCode}`,
                    );
                }

                // Call the origial res.end and return its result
                return originalEnd(...args);
            };

            next();
        });
    }
}
