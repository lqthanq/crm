import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Subscription } from "rxjs";
import { EventBus } from "../../event-bus";

@Injectable()
export class AccountRegistrationHandler implements OnModuleInit, OnModuleDestroy {
    private subscription: Subscription;

    constructor(private readonly eventBus: EventBus) {}

    /**
     * Handles the account registeration event.
     */
    public async execute(event: AccountRegistrationEven)
}