export interface IPagination<T> {
    readonly items: T[];

    readonly total: number;
}
