import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CurrencyRepository extends Repository<Currency> {
    constructor(@InjectRepository(Currency) readonly repository: Repository<Currency>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
