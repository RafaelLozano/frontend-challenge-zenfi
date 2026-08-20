import type { DataQualityFlag } from '../types';

const DETAIL_QUALITY_FLAGS: readonly DataQualityFlag[] = [
  'amount-sign-inferred',
  'duplicate',
  'superseded-by-state',
  'out-of-period',
  'foreign-currency',
  'missing-account',
];

const buildWarningMessage = (flag: DataQualityFlag, periodLabel: string): string | null => {
  switch (flag) {
    case 'amount-sign-inferred':
      return 'El banco mandó este monto sin signo. Lo interpretamos como salida.';
    case 'duplicate':
      return 'Idéntico a otro movimiento del mismo día. No lo contamos dos veces en tu resumen.';
    case 'superseded-by-state':
      return 'Este cargo ya aparece confirmado más adelante. Solo contamos la versión confirmada.';
    case 'out-of-period':
      return `Este movimiento no cae en ${periodLabel}, así que no entra en el resumen del mes.`;
    case 'foreign-currency':
      return 'Está en USD. No lo convertimos a pesos ni lo sumamos a tus totales.';
    case 'missing-account':
      return 'El banco no mandó la cuenta de origen.';
    default:
      return null;
  }
};

export const buildQualityWarnings = (
  flags: readonly DataQualityFlag[],
  periodLabel: string,
): readonly string[] =>
  DETAIL_QUALITY_FLAGS
    .filter((flag) => flags.includes(flag))
    .map((flag) => buildWarningMessage(flag, periodLabel))
    .filter((message): message is string => message !== null);
