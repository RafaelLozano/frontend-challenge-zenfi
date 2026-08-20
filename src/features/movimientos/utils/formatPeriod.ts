const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export const formatPeriodLabel = (periodo: string): string => {
  const [year, month] = periodo.split('-');
  const monthIndex = Number.parseInt(month ?? '', 10) - 1;
  const monthName = MONTH_NAMES[monthIndex];

  if (!year || !monthName) {
    return periodo;
  }

  const capitalizedMonth = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`;
  return `${capitalizedMonth} ${year}`;
};

export const isDateInPeriod = (date: Date, periodo: string): boolean => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}` === periodo;
};

export const formatMovimientoDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(date);
