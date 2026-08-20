const DAY_NAMES_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'] as const;

const MONTH_NAMES_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

const MONTH_NAMES_LONG = [
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

export type ParsedFechaISO = {
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly dateLongLabel: string;
  readonly sortDate: Date;
};

const parseTimeFromISO = (fecha: string): { hours: number; minutes: number } => {
  const timeMatch = fecha.match(/T(\d{2}):(\d{2})/);

  if (!timeMatch) {
    return { hours: 0, minutes: 0 };
  }

  return {
    hours: Number.parseInt(timeMatch[1] ?? '0', 10),
    minutes: Number.parseInt(timeMatch[2] ?? '0', 10),
  };
};

const formatTimeLabel = (hours: number, minutes: number): string => {
  const period = hours < 12 ? 'a.m.' : 'p.m.';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes).padStart(2, '0');

  return `${hour12}:${paddedMinutes} ${period}`;
};

export const parseFechaISO = (fecha: string): ParsedFechaISO => {
  const dayKey = fecha.slice(0, 10);
  const [yearStr, monthStr, dayStr] = dayKey.split('-');
  const year = Number.parseInt(yearStr ?? '', 10);
  const month = Number.parseInt(monthStr ?? '', 10);
  const day = Number.parseInt(dayStr ?? '', 10);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error(`Fecha ISO inválida: ${fecha}`);
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = utcDate.getUTCDay();
  const dayName = DAY_NAMES_SHORT[dayOfWeek] ?? '???';
  const monthShort = MONTH_NAMES_SHORT[month - 1] ?? '???';
  const monthLong = MONTH_NAMES_LONG[month - 1] ?? '???';
  const { hours, minutes } = parseTimeFromISO(fecha);
  const timeLabel = formatTimeLabel(hours, minutes);

  return {
    dayKey,
    dayLabel: `${dayName} ${day} ${monthShort}`,
    dateLongLabel: `${dayName} ${day} de ${monthLong}, ${year} · ${timeLabel}`,
    sortDate: new Date(fecha),
  };
};

export const isDayKeyInPeriod = (dayKey: string, periodo: string): boolean =>
  dayKey.slice(0, 7) === periodo;
