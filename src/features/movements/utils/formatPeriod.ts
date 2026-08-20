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

const MONTH_NAMES_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

export const formatPeriodLabel = (period: string): string => {
  const [year, month] = period.split('-');
  const monthIndex = Number.parseInt(month ?? '', 10) - 1;
  const monthName = MONTH_NAMES[monthIndex];

  if (!year || !monthName) {
    return period;
  }

  const capitalizedMonth = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`;
  return `${capitalizedMonth} ${year}`;
};

export const formatPeriodShortLabel = (period: string): string => {
  const [year, month] = period.split('-');
  const monthIndex = Number.parseInt(month ?? '', 10) - 1;
  const monthName = MONTH_NAMES_SHORT[monthIndex];

  if (!year || !monthName) {
    return period;
  }

  return `${monthName} ${year}`;
};

export const formatPeriodMonthName = (period: string): string => {
  const [, month] = period.split('-');
  const monthIndex = Number.parseInt(month ?? '', 10) - 1;
  const monthName = MONTH_NAMES[monthIndex];

  if (!monthName) {
    return period;
  }

  return monthName;
};

export const isDateInPeriod = (date: Date, period: string): boolean => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}` === period;
};

export const formatMovementDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(date);
