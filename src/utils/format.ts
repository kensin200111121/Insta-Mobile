export const formatUSNumber = (entry: string): string => {
    const match = entry?.replace(/\D+/g, '')?.match(/([^\d]*\d[^\d]*){1,10}$/)?.[0];
    if(!match) {
        return '';
    }
    const part1 = match.length > 2 ? `${match.substring(0, 3)}` : match;
    const part2 = match.length > 3 ? `-${match.substring(3, 6)}` : '';
    const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : '';
    return `${part1}${part2}${part3}`;
};

export function formatNumber(number: string) {
    if (!number) {
        return '0'
    }
    const _inputNumber = ceilTo2Decimals(parseFloat(number));
    var _converted = _inputNumber.toLocaleString('en');
    return _converted;
}

export function ceilTo2Decimals(number: number): number {
    return Math.ceil(number * 100) / 100;
}

export function formatDisplayNumber(number: string) {
    if (!number) {
        return '0.00'
    }
    const _inputNumber = ceilTo2Decimals(parseFloat(number));
    const _converted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(_inputNumber ?? 0);
    return _converted;
}

export function maskInputString(maskString: string, input: string) {
    let result = '';
    let textIndex = 0;
    for (let i = 0; i < maskString.length; i++) {
        if (maskString[i] === '_') {
            result += (input[textIndex] || maskString[i]);
            textIndex++;
        } else {
            result += maskString[i];
        }
    }
    return result;
}