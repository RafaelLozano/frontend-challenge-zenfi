import type { DataQualityFlag, Movimiento, MovimientoRaw } from '../types';
import { buildNota } from './buildNota';
import { deriveMerchant } from './deriveMerchant';
import { applyDuplicateDetection } from './detectDuplicates';
import { normalizeCategory } from './normalizeCategory';
import { parseAmount } from './parseAmount';
import { isDayKeyInPeriod, parseFechaISO } from './parseFechaISO';
import { parseMovimientoEstado } from './parseMovimientoEstado';
import { computeCountsTowardTotals } from './computeCountsTowardTotals';

const isMovimientoRaw = (value: unknown): value is MovimientoRaw => {
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
  periodo,
}: {
  signInferred: boolean;
  needsCategoryReview: boolean;
  account: string | null;
  currency: string;
  dayKey: string;
  periodo: string;
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

  if (!isDayKeyInPeriod(dayKey, periodo)) {
    flags = addFlag(flags, 'out-of-period');
  }

  return flags;
};

const finalizeMovimiento = (movimiento: Movimiento): Movimiento => {
  const note = buildNota(movimiento);

  return {
    ...movimiento,
    note,
    countsTowardTotals: computeCountsTowardTotals(movimiento),
  };
};

export const parseMovimiento = (raw: MovimientoRaw, periodo: string): Movimiento => {
  const fecha = parseFechaISO(raw.fecha);

  if (Number.isNaN(fecha.sortDate.getTime())) {
    throw new Error(`Fecha inválida en movimiento ${raw.id}`);
  }

  const { amountCents, signInferred } = parseAmount(raw.monto);
  const category = normalizeCategory(raw.categoria);
  const currency = raw.moneda.trim().toUpperCase();
  const account = raw.cuenta?.trim() ?? null;
  const status = parseMovimientoEstado(raw.estado);
  const description = raw.descripcion.trim();
  const flags = buildInitialFlags({
    signInferred,
    needsCategoryReview: category.needsCategoryReview,
    account,
    currency,
    dayKey: fecha.dayKey,
    periodo,
  });

  const baseMovimiento: Movimiento = {
    id: raw.id,
    date: fecha.sortDate,
    dayKey: fecha.dayKey,
    dayLabel: fecha.dayLabel,
    dateLongLabel: fecha.dateLongLabel,
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

  return finalizeMovimiento(baseMovimiento);
};

export const parseMovimientos = (rawList: unknown[], periodo: string): Movimiento[] => {
  const parsedItems = rawList.map((raw, index) => {
    if (!isMovimientoRaw(raw)) {
      throw new Error(`Movimiento inválido en índice ${index}`);
    }

    return {
      raw,
      movimiento: parseMovimiento(raw, periodo),
    };
  });

  const withDuplicateFlags = applyDuplicateDetection(parsedItems);

  return withDuplicateFlags.map((movimiento) => finalizeMovimiento(movimiento));
};
