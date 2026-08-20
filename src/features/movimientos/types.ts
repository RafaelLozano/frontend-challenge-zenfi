export type CategoriaId =
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

export type CategoriaFamilia = 'violeta' | 'cyan' | 'verde' | 'coral';

export type Categoria = {
  readonly id: CategoriaId;
  readonly label: string;
  readonly icon: string;
  readonly familia: CategoriaFamilia;
};

export type MovimientoEstado = 'confirmada' | 'pendiente' | 'programada' | 'en_disputa';

export type DataQualityFlag =
  | 'amount-sign-inferred'
  | 'missing-category'
  | 'missing-account'
  | 'foreign-currency'
  | 'out-of-period'
  | 'duplicate'
  | 'superseded-by-state';

export type MovimientoRaw = {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number | string;
  moneda: string;
  categoria: string | null;
  cuenta: string | null;
  estado: string;
};

export type MovimientosFileRaw = {
  periodo: string;
  generado_en: string;
  movimientos: MovimientoRaw[];
};

export type Movimiento = {
  readonly id: string;
  readonly date: Date;
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly dateLongLabel: string;
  readonly amountCents: number;
  readonly currency: string;
  readonly categoryId: CategoriaId;
  readonly merchant: string;
  readonly description: string;
  readonly note: string;
  readonly account: string | null;
  readonly status: MovimientoEstado;
  readonly countsTowardTotals: boolean;
  readonly flags: readonly DataQualityFlag[];
};

export type DataQualityReport = {
  readonly totalRecibidos: number;
  readonly contadosEnTotales: number;
  readonly duplicados: number;
  readonly supersededPorEstado: number;
  readonly fueraDePeriodo: number;
  readonly otraMoneda: number;
  readonly sinCategoria: number;
  readonly signoInferido: number;
};

export type MovimientosDataset = {
  readonly periodo: string;
  readonly periodoLabel: string;
  readonly movimientos: readonly Movimiento[];
  readonly quality: DataQualityReport;
};

export type CategoriaResumen = {
  readonly categoryId: CategoriaId;
  readonly label: string;
  readonly totalCents: number;
  readonly percentage: number;
  readonly movementCount: number;
};

export type ResumenMensual = {
  readonly periodo: string;
  readonly periodoLabel: string;
  readonly ingresosCents: number;
  readonly gastosCents: number;
  readonly balanceCents: number;
  readonly gastosPorCategoria: readonly CategoriaResumen[];
  readonly sinCategorizarCount: number;
  readonly movimientosEnPeriodo: number;
  readonly excludedFromTotalsCount: number;
};
