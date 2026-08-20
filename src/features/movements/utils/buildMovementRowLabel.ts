import { getStatusConfig } from '../catalog/states';
import { getCategoryLabel } from '../catalog/categories';
import type { DataQualityFlag, Movement } from '../types';

const QUALITY_FLAG_LABELS: Partial<Record<DataQualityFlag, string>> = {
  duplicate: 'Duplicado',
  'out-of-period': 'Fuera de agosto',
  'foreign-currency': 'USD',
  'amount-sign-inferred': 'Signo estimado',
};

const RELEVANT_QUALITY_FLAGS: readonly DataQualityFlag[] = [
  'duplicate',
  'out-of-period',
  'foreign-currency',
  'amount-sign-inferred',
];

export const getQualityFlagLabel = (
  flag: DataQualityFlag,
  periodMonthName: string,
): string | null => {
  if (flag === 'out-of-period') {
    const capitalizedMonth = `${periodMonthName.charAt(0).toUpperCase()}${periodMonthName.slice(1)}`;
    return `Fuera de ${capitalizedMonth}`;
  }

  return QUALITY_FLAG_LABELS[flag] ?? null;
};

export const getRelevantQualityFlags = (
  flags: readonly DataQualityFlag[],
): readonly DataQualityFlag[] => RELEVANT_QUALITY_FLAGS.filter((flag) => flags.includes(flag));

const formatAmountForSpeech = (amountCents: number, currency: string): string => {
  const absolute = Math.abs(amountCents) / 100;
  const formatted = absolute.toFixed(2);

  if (currency === 'USD') {
    return `${formatted} dólares`;
  }

  return `${formatted} pesos`;
};

export const buildMovementRowAriaLabel = (movement: Movement): string => {
  const categoryLabel = getCategoryLabel(movement.categoryId);
  const direction = movement.amountCents >= 0 ? 'entrada' : 'salida';
  const amountSpeech = formatAmountForSpeech(movement.amountCents, movement.currency);
  const accountPart = movement.account ? `, ${movement.account}` : '';
  const datePart = movement.dateLongLabel.split(' · ')[0] ?? movement.dayLabel;

  const parts = [
    movement.merchant,
    categoryLabel,
    accountPart.replace(/^, /, ''),
    `${direction} de ${amountSpeech}`,
    datePart,
  ].filter((part) => part.length > 0);

  return parts.join(', ');
};

export const getStatusLabel = (status: Movement['status']): string =>
  getStatusConfig(status).label;
