import { isEmpty } from "./is-empty";

export function isNotEmpty(item: any): boolean {
    return !isEmpty(item);
}