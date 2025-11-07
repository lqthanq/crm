import { Request, Response } from 'express';
import { CLS_ID, ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

import { ELanguages, ID, IUser } from 'src/contracts';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestContext {
    protected static clsService: ClsService;
    private static loggingEnabled: boolean = false;

    private readonly _id: ID;
    private readonly _res: Response;
    private readonly _req: Request;
    private readonly _languageCode: ELanguages;

    get id(): ID {
        return this._id;
    }

    /**
     * Create an instance of RequestContext
     */
    constructor(options: { id?: ID; req: Request; res: Response; languageCode?: ELanguages; isAuthorized?: boolean }) {
        // Set the context ID
        const contextId = options.id || uuidv4();
        RequestContext.setContextId(contextId);

        // Assign values the instance properties.
        this._id = contextId;
        this._req = options.req;
        this._res = options.res;
        this._languageCode = options.languageCode!;

        if (RequestContext.loggingEnabled) {
            console.log('RequestContext: setting context with generated Id: ', RequestContext.getContextId());
        }
    }

    /**
     * Static method to set the context ID in the ClsService.
     */
    public static setContextId(id: ID): void {
        // Check if the ClsService is available
        if (RequestContext.clsService) {
            RequestContext.clsService.set(CLS_ID, id);
        }
    }

    /**
     * Static method to get the context ID from the ClsService
     */
    public static getContextId(): ID | undefined {
        // Check if the ClsService is available
        if (RequestContext.clsService) {
            return RequestContext.clsService.get(CLS_ID);
        }
    }

    /**
     * Sets the ClsService instance to be used by RequestContext
     */
    static setClsService(service: ClsService) {
        RequestContext.clsService = service;
    }

    /**
     * Gets the current request context.
     */
    static currentRequestContext(): RequestContext {
        // Log if loggin is enabled
        if (RequestContext.loggingEnabled) {
            console.log('RequestContext: retrieving context...');
        }

        // Retrieve the context from the ClsService
        const context = RequestContext.clsService?.get(RequestContext.name);

        // Log context ID if logging is enabled
        if (RequestContext.loggingEnabled) {
            console.log('RequestContext: context retrieved with ID: ', context?.id);
        }

        return context;
    }
    
    /**
     * Retrieves the current user from the request context
     */
    static currentUser(throwError?: boolean): IUser | null {
        const requestContext = RequestContext.currentRequestContext();

        // Check if request context exists
        if (requestContext) {

            const user: IUser = requestContext._req['user'];

            if (user) {
                return user;
            }
        }

        if (throwError) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }

        return null;
    }

    /**
     * Retrieves the current tenant ID associated with the user in the RequestContext.
     */
    static currentTenantId(): ID | null {
        const user: IUser | null = RequestContext.currentUser();
        return user?.tenantId || null;
    }
}
