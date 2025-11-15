import slugify from 'slugify';

export function sluggable(string: string, replacement: string = '-'): string {
    return slugify(string, {
        replacement: replacement,
        remove: /[*+~()'"!:@,.]/g,
        lower: true,
        trim: true,
    }).replace(/[_]/g, replacement);
}
