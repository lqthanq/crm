import { moment } from "./moment-extend";

export function freshTimestamp(): Date {
    return new Date(moment.now());
}
