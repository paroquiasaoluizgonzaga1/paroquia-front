import { DateTime } from 'luxon';

export function isValidBirthDate(value: string): boolean {
    const date = value.replace(/\D/g, '');
    if (date.length !== 8) return false;

    const day = parseInt(date.slice(0, 2));
    const month = parseInt(date.slice(2, 4));
    const year = parseInt(date.slice(4, 8));

    if (year >= new Date().getFullYear() || year < 1900) return false;

    if (month < 1 || month > 12) return false;

    const dateObj = DateTime.fromObject({ year, month, day });
    if (!dateObj.isValid) return false;

    return true;
}
