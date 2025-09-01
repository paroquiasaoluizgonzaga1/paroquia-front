export function isValidPhoneNumber(value: string): boolean {
    if (value.length < 12) return false;

    const number = value.replace(/\D/g, '');

    if (number.slice(0, 2) == '55' && number.length != 13) return false;

    return true;
}
