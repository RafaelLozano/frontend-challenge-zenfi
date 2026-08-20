import type { Categoria, CategoriaFamilia, CategoriaId } from '../types';

export const CATEGORIA_FAMILIA_COLORS: Record<
  CategoriaFamilia,
  { readonly background: string; readonly text: string }
> = {
  violeta: { background: '#EFE7FF', text: '#5200E8' },
  cyan: { background: '#E1F3FF', text: '#0A7FC2' },
  verde: { background: '#E2F6EE', text: '#0B8F5D' },
  coral: { background: '#FFE8EE', text: '#D81E56' },
};

export const CATEGORIAS: readonly Categoria[] = [
  { id: 'comisiones', label: 'Comisiones', icon: 'percent', familia: 'violeta' },
  { id: 'comida', label: 'Comida', icon: 'restaurant', familia: 'coral' },
  { id: 'compras', label: 'Compras', icon: 'shopping_bag', familia: 'coral' },
  { id: 'efectivo', label: 'Efectivo', icon: 'local_atm', familia: 'cyan' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: 'confirmation_number', familia: 'coral' },
  { id: 'ingresos', label: 'Ingresos', icon: 'trending_up', familia: 'verde' },
  { id: 'pagos', label: 'Pagos', icon: 'credit_card', familia: 'violeta' },
  { id: 'salud', label: 'Salud', icon: 'medical_services', familia: 'verde' },
  { id: 'seguros', label: 'Seguros', icon: 'shield', familia: 'violeta' },
  { id: 'servicios', label: 'Servicios', icon: 'bolt', familia: 'cyan' },
  { id: 'supermercado', label: 'Supermercado', icon: 'shopping_cart', familia: 'verde' },
  { id: 'suscripciones', label: 'Suscripciones', icon: 'autorenew', familia: 'violeta' },
  { id: 'transporte', label: 'Transporte', icon: 'directions_car', familia: 'cyan' },
  { id: 'transferencias', label: 'Transferencias', icon: 'swap_horiz', familia: 'violeta' },
  { id: 'viajes', label: 'Viajes', icon: 'flight', familia: 'cyan' },
  { id: 'vivienda', label: 'Vivienda', icon: 'home', familia: 'coral' },
  { id: 'sin-categoria', label: 'Sin categoría', icon: 'help', familia: 'violeta' },
] as const;

const CATEGORIA_BY_ID = new Map<CategoriaId, Categoria>(
  CATEGORIAS.map((categoria) => [categoria.id, categoria]),
);

const normalizeCategoriaKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const CATEGORIA_ID_BY_NORMALIZED_LABEL = new Map<string, CategoriaId>(
  CATEGORIAS.filter((categoria) => categoria.id !== 'sin-categoria').map((categoria) => [
    normalizeCategoriaKey(categoria.label),
    categoria.id,
  ]),
);

export const getCategoria = (id: CategoriaId): Categoria => {
  const categoria = CATEGORIA_BY_ID.get(id);

  if (!categoria) {
    return CATEGORIA_BY_ID.get('sin-categoria')!;
  }

  return categoria;
};

export const getCategoriaLabel = (id: CategoriaId): string => getCategoria(id).label;

export const resolveCategoriaId = (
  categoria: string | null,
): { categoryId: CategoriaId; needsCategoryReview: boolean } => {
  const trimmed = categoria?.trim() ?? '';

  if (trimmed.length === 0) {
    return { categoryId: 'sin-categoria', needsCategoryReview: true };
  }

  const resolved = CATEGORIA_ID_BY_NORMALIZED_LABEL.get(normalizeCategoriaKey(trimmed));

  if (!resolved) {
    return { categoryId: 'sin-categoria', needsCategoryReview: true };
  }

  return { categoryId: resolved, needsCategoryReview: false };
};

export type CategoriaOption = {
  readonly id: CategoriaId;
  readonly label: string;
};

export const getSelectableCategoriaOptions = (): readonly CategoriaOption[] =>
  CATEGORIAS.filter((categoria) => categoria.id !== 'sin-categoria').map((categoria) => ({
    id: categoria.id,
    label: categoria.label,
  }));
