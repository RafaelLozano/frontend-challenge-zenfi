import { getCategoryLabel } from '../catalog/categories';
import { getStatusConfig } from '../catalog/states';
import type { DataQualityFlag, Movement } from '../types';
import { formatCurrency } from '../../../utils/formatCurrency';

const FLAG_WARNINGS: Record<DataQualityFlag, string> = {
  'amount-sign-inferred':
    'El monto llegó sin signo desde el banco; lo tratamos como gasto.',
  'missing-category': 'Falta categoría asignada.',
  'missing-account': 'No hay cuenta asignada para este movimiento.',
  'foreign-currency': 'Está en otra moneda y no entra en los totales en pesos.',
  'out-of-period': 'Queda fuera del periodo del resumen.',
  duplicate: 'Parece un duplicado de otro movimiento.',
  'superseded-by-state': 'Hay otra versión del mismo cargo con un estado más avanzado.',
};

const getDirectionLabel = (amountCents: number): string => {
  if (amountCents > 0) {
    return 'Entrada';
  }

  if (amountCents < 0) {
    return 'Salida';
  }

  return 'Movimiento';
};

const getAccountLabel = (account: string | null): string => account ?? 'sin cuenta asignada';

export const buildNote = (
  movement: Pick<
    Movement,
    'amountCents' | 'currency' | 'account' | 'categoryId' | 'status' | 'flags'
  >,
): string => {
  const direction = getDirectionLabel(movement.amountCents);
  const amount = formatCurrency(Math.abs(movement.amountCents), movement.currency);
  const account = getAccountLabel(movement.account);
  const category = getCategoryLabel(movement.categoryId);
  const statusExplanation = getStatusConfig(movement.status).explanation;

  const lines = [
    `${direction} de ${amount} desde ${account}, clasificada como ${category}.`,
    statusExplanation,
  ];

  const warnings = movement.flags
    .map((flag) => FLAG_WARNINGS[flag])
    .filter((warning): warning is string => Boolean(warning));

  if (warnings.length > 0) {
    lines.push(...warnings);
  }

  return lines.join(' ');
};
