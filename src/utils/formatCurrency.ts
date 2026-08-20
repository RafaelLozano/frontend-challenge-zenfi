const currencyFormatters = new Map<string, Intl.NumberFormat>();

const getFormatter = (currency: string): Intl.NumberFormat => {
  const existing = currencyFormatters.get(currency);

  if (existing) {
    return existing;
  }

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  currencyFormatters.set(currency, formatter);
  return formatter;
};

export const formatCurrency = (amountCents: number, currency = 'MXN'): string =>
  getFormatter(currency).format(amountCents / 100);
