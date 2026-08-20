export type CategoryId =
  | 'comisiones'
  | 'comida'
  | 'compras'
  | 'efectivo'
  | 'entretenimiento'
  | 'ingresos'
  | 'pagos'
  | 'salud'
  | 'seguros'
  | 'servicios'
  | 'supermercado'
  | 'suscripciones'
  | 'transporte'
  | 'transferencias'
  | 'viajes'
  | 'vivienda'
  | 'sin-categoria';

export type CategoryFamily = 'violeta' | 'cyan' | 'verde' | 'coral';

export type Category = {
  readonly id: CategoryId;
  readonly label: string;
  readonly icon: string;
  readonly family: CategoryFamily;
};

export type MovementStatus = 'confirmada' | 'pendiente' | 'programada' | 'en_disputa';

export type DataQualityFlag =
  | 'amount-sign-inferred'
  | 'missing-category'
  | 'missing-account'
  | 'foreign-currency'
  | 'out-of-period'
  | 'duplicate'
  | 'superseded-by-state';

export type MovementRaw = {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number | string;
  moneda: string;
  categoria: string | null;
  cuenta: string | null;
  estado: string;
};

export type MovementsFileRaw = {
  periodo: string;
  generado_en: string;
  movimientos: MovementRaw[];
};

export type Movement = {
  readonly id: string;
  readonly date: Date;
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly dateLongLabel: string;
  readonly amountCents: number;
  readonly currency: string;
  readonly categoryId: CategoryId;
  readonly merchant: string;
  readonly description: string;
  readonly note: string;
  readonly account: string | null;
  readonly status: MovementStatus;
  readonly countsTowardTotals: boolean;
  readonly flags: readonly DataQualityFlag[];
};

export type DataQualityReport = {
  readonly totalReceived: number;
  readonly countedInTotals: number;
  readonly duplicates: number;
  readonly supersededByStatus: number;
  readonly outOfPeriod: number;
  readonly foreignCurrency: number;
  readonly missingCategory: number;
  readonly inferredSign: number;
};

export type MovementsDataset = {
  readonly period: string;
  readonly periodLabel: string;
  readonly movements: readonly Movement[];
  readonly quality: DataQualityReport;
};

export type CategorySummary = {
  readonly categoryId: CategoryId;
  readonly label: string;
  readonly totalCents: number;
  readonly percentage: number;
  readonly movementCount: number;
};

export type MonthlySummary = {
  readonly period: string;
  readonly periodLabel: string;
  readonly incomeCents: number;
  readonly expensesCents: number;
  readonly balanceCents: number;
  readonly expensesByCategory: readonly CategorySummary[];
  readonly uncategorizedCount: number;
  readonly movementsInPeriod: number;
  readonly excludedFromTotalsCount: number;
};
