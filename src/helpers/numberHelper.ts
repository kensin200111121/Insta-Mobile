export function getFormatedNumber(num : number|undefined|null, precision = 2) {
  const result = new Intl.NumberFormat('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision }).format(num ?? 0);
  if(Number(result) == 0 && result.startsWith('-')){
    return result.slice(1);
  }

  return result;
}

export function getPriceNumber(num : number|undefined|null, precision = 2) {
  const result = getFormatedNumber(num, 2);
  return result.startsWith('-') ? `-$${result.slice(1)}` : `$${result}`;
}

