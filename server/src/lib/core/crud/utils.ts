import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export function parseFindCountOptions<T>(options: FindManyOptions): FindManyOptions<T> {
    //
    const ormOptions: FindManyOptions<T> = {
        loadEagerRelations: false,
    };

    //
    let where: FindOptionsWhere<T> = {};

    //
    if (options && options.where) {
        where = options.where as FindOptionsWhere<T>;
    }

    // Merge
    return { ...ormOptions, where };
}
