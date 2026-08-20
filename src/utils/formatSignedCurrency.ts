import { formatCurrency } from './formatCurrency';

const MINUS_SIGN = '\u2212';

export const formatSignedCurrency = (amountCents: number, currency = 'MXN'): string => {
  const absoluteFormatted = formatCurrency(Math.abs(amountCents), currency);

  if (amountCents > 0) {
    return `+${absoluteFormatted}`;
  }

  if (amountCents < 0) {
    return `${MINUS_SIGN}${absoluteFormatted}`;
  }

  return absoluteFormatted;
};
