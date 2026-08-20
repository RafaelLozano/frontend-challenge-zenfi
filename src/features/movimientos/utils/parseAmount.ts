export type ParsedAmount = {
  readonly amountCents: number;
  readonly signInferred: boolean;
};

export const parseAmount = (value: number | string): ParsedAmount => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`Monto inválido: ${String(value)}`);
    }

    return {
      amountCents: Math.round(value * 100),
      signInferred: false,
    };
  }

  const trimmed = value.trim();
  const hasExplicitPlus = trimmed.startsWith('+');
  const normalized = Number.parseFloat(trimmed);

  if (!Number.isFinite(normalized)) {
    throw new Error(`Monto inválido: ${value}`);
  }

  let amountCents = Math.round(normalized * 100);

  if (amountCents > 0 && !hasExplicitPlus) {
    amountCents = -amountCents;
    return { amountCents, signInferred: true };
  }

  return { amountCents, signInferred: false };
};

/** @deprecated Use parseAmount instead */
export const parseAmountToCents = (value: number | string): number => parseAmount(value).amountCents;
