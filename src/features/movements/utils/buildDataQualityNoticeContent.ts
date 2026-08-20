import type { DataQualityFlag, DataQualityNoticeContent, DataQualityReport, Movement } from '../types';
import { formatDayOfMonthLong, formatPeriodMonthName } from './formatPeriod';

const findFirstMovementByFlag = (
  movements: readonly Movement[],
  flag: DataQualityFlag,
): Movement | undefined => movements.find((movement) => movement.flags.includes(flag));

const buildFlagExampleSuffix = (movement: Movement | undefined): string => {
  if (!movement) {
    return '';
  }

  return ` (${movement.merchant} del ${formatDayOfMonthLong(movement.date)})`;
};

const buildDuplicateLine = (
  count: number,
  exampleMovement: Movement | undefined,
): string | null => {
  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return `· 1 duplicado exacto${buildFlagExampleSuffix(exampleMovement)}`;
  }

  return `· ${count} duplicados exactos`;
};

const buildSupersededLine = (
  count: number,
  exampleMovement: Movement | undefined,
): string | null => {
  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return `· 1 cargo repetido en dos estados${buildFlagExampleSuffix(exampleMovement)}`;
  }

  return `· ${count} cargos repetidos en dos estados`;
};

const buildOutOfPeriodLine = (count: number, period: string): string | null => {
  if (count === 0) {
    return null;
  }

  const [, year] = period.split('-');
  const periodLabel = `${formatPeriodMonthName(period)} ${year ?? ''}`.trim();

  if (count === 1) {
    return `· 1 movimiento fuera de ${periodLabel}`;
  }

  return `· ${count} movimientos fuera de ${periodLabel}`;
};

const buildForeignCurrencyLine = (count: number): string | null => {
  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return '· 1 cargo en USD, que no convertimos a pesos';
  }

  return `· ${count} cargos en USD, que no convertimos a pesos`;
};

const buildInferredSignLine = (count: number): string | null => {
  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return 'Además, 1 monto llegó sin signo y lo interpretamos como salida.';
  }

  return `Además, ${count} montos llegaron sin signo y los interpretamos como salidas.`;
};

export const buildDataQualityNoticeContent = (
  movements: readonly Movement[],
  quality: DataQualityReport,
  period: string,
  includedInSummaryCount: number,
): DataQualityNoticeContent => {
  const periodMonthName = formatPeriodMonthName(period);
  const intro = `De los ${quality.totalReceived} movimientos que mandó el banco, ${includedInSummaryCount} entran en el resumen de ${periodMonthName}.`;

  const exclusionLines = [
    buildDuplicateLine(quality.duplicates, findFirstMovementByFlag(movements, 'duplicate')),
    buildSupersededLine(
      quality.supersededByStatus,
      findFirstMovementByFlag(movements, 'superseded-by-state'),
    ),
    buildOutOfPeriodLine(quality.outOfPeriod, period),
    buildForeignCurrencyLine(quality.foreignCurrency),
  ].filter((line): line is string => line !== null);

  return {
    intro,
    exclusionHeading: exclusionLines.length > 0 ? 'Quedaron fuera:' : null,
    exclusionLines,
    inferredSignLine: buildInferredSignLine(quality.inferredSign),
  };
};
