import type { DataQualityFlag, Movement, MovementRaw } from '../types';
import { buildNote } from './buildNote';
import { deriveMerchant } from './deriveMerchant';
import { applyDuplicateDetection } from './detectDuplicates';
import { normalizeCategory } from './normalizeCategory';
import { parseAmount } from './parseAmount';
import { isDayKeyInPeriod, parseIsoDate } from './parseIsoDate';
import { parseMovementStatus } from './parseMovementStatus';
import { computeCountsTowardTotals } from './computeCountsTowardTotals';

const isMovementRaw = (value: unknown): value is MovementRaw => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.fecha === 'string';
};

const addFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => (flags.includes(flag) ? flags : [...flags, flag]);

const buildInitialFlags = ({
  signInferred,
  needsCategoryReview,
  account,
  currency,
  dayKey,
  period,
}: {
  signInferred: boolean;
  needsCategoryReview: boolean;
  account: string | null;
  currency: string;
  dayKey: string;
  period: string;
}): readonly DataQualityFlag[] => {
  let flags: readonly DataQualityFlag[] = [];

  if (signInferred) {
    flags = addFlag(flags, 'amount-sign-inferred');
  }

  if (needsCategoryReview) {
    flags = addFlag(flags, 'missing-category');
  }

  if (account === null) {
    flags = addFlag(flags, 'missing-account');
  }

  if (currency !== 'MXN') {
    flags = addFlag(flags, 'foreign-currency');
  }

  if (!isDayKeyInPeriod(dayKey, period)) {
    flags = addFlag(flags, 'out-of-period');
  }

  return flags;
};

const finalizeMovement = (movement: Movement): Movement => {
  const note = buildNote(movement);

  return {
    ...movement,
    note,
    countsTowardTotals: computeCountsTowardTotals(movement),
  };
};

export const parseMovement = (raw: MovementRaw, period: string): Movement => {
  const parsedDate = parseIsoDate(raw.fecha);

  if (Number.isNaN(parsedDate.sortDate.getTime())) {
    throw new Error(`Fecha inválida en movimiento ${raw.id}`);
  }

  const { amountCents, signInferred } = parseAmount(raw.monto);
  const category = normalizeCategory(raw.categoria);
  const currency = raw.moneda.trim().toUpperCase();
  const account = raw.cuenta?.trim() ?? null;
  const status = parseMovementStatus(raw.estado);
  const description = raw.descripcion.trim();
  const flags = buildInitialFlags({
    signInferred,
    needsCategoryReview: category.needsCategoryReview,
    account,
    currency,
    dayKey: parsedDate.dayKey,
    period,
  });

  const baseMovement: Movement = {
    id: raw.id,
    date: parsedDate.sortDate,
    dayKey: parsedDate.dayKey,
    dayLabel: parsedDate.dayLabel,
    dateLongLabel: parsedDate.dateLongLabel,
    amountCents,
    currency,
    categoryId: category.categoryId,
    merchant: deriveMerchant(description),
    description,
    note: '',
    account,
    status,
    countsTowardTotals: false,
    flags,
  };

  return finalizeMovement(baseMovement);
};

export const parseMovements = (rawList: unknown[], period: string): Movement[] => {
  const parsedItems = rawList.map((raw, index) => {
    if (!isMovementRaw(raw)) {
      throw new Error(`Movimiento inválido en índice ${index}`);
    }

    return {
      raw,
      movement: parseMovement(raw, period),
    };
  });

  const withDuplicateFlags = applyDuplicateDetection(parsedItems);

  return withDuplicateFlags.map((movement) => finalizeMovement(movement));
};
