import type { Category, CategoryFamily, CategoryId } from '../types';

export const CATEGORY_FAMILY_COLORS: Record<
  CategoryFamily,
  { readonly background: string; readonly text: string }
> = {
  violeta: { background: '#EFE7FF', text: '#5200E8' },
  cyan: { background: '#E1F3FF', text: '#0A7FC2' },
  verde: { background: '#E2F6EE', text: '#0B8F5D' },
  coral: { background: '#FFE8EE', text: '#D81E56' },
};

export const CATEGORIES: readonly Category[] = [
  { id: 'comisiones', label: 'Comisiones', icon: 'percent', family: 'violeta' },
  { id: 'comida', label: 'Comida', icon: 'restaurant', family: 'coral' },
  { id: 'compras', label: 'Compras', icon: 'shopping_bag', family: 'coral' },
  { id: 'efectivo', label: 'Efectivo', icon: 'local_atm', family: 'cyan' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: 'confirmation_number', family: 'coral' },
  { id: 'ingresos', label: 'Ingresos', icon: 'trending_up', family: 'verde' },
  { id: 'pagos', label: 'Pagos', icon: 'credit_card', family: 'violeta' },
  { id: 'salud', label: 'Salud', icon: 'medical_services', family: 'verde' },
  { id: 'seguros', label: 'Seguros', icon: 'shield', family: 'violeta' },
  { id: 'servicios', label: 'Servicios', icon: 'bolt', family: 'cyan' },
  { id: 'supermercado', label: 'Supermercado', icon: 'shopping_cart', family: 'verde' },
  { id: 'suscripciones', label: 'Suscripciones', icon: 'autorenew', family: 'violeta' },
  { id: 'transporte', label: 'Transporte', icon: 'directions_car', family: 'cyan' },
  { id: 'transferencias', label: 'Transferencias', icon: 'swap_horiz', family: 'violeta' },
  { id: 'viajes', label: 'Viajes', icon: 'flight', family: 'cyan' },
  { id: 'vivienda', label: 'Vivienda', icon: 'home', family: 'coral' },
  { id: 'sin-categoria', label: 'Sin categoría', icon: 'help', family: 'violeta' },
] as const;

const CATEGORY_BY_ID = new Map<CategoryId, Category>(
  CATEGORIES.map((category) => [category.id, category]),
);

const normalizeCategoryKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const CATEGORY_ID_BY_NORMALIZED_LABEL = new Map<string, CategoryId>(
  CATEGORIES.filter((category) => category.id !== 'sin-categoria').map((category) => [
    normalizeCategoryKey(category.label),
    category.id,
  ]),
);

export const getCategory = (id: CategoryId): Category => {
  const category = CATEGORY_BY_ID.get(id);

  if (!category) {
    return CATEGORY_BY_ID.get('sin-categoria')!;
  }

  return category;
};

export const getCategoryLabel = (id: CategoryId): string => getCategory(id).label;

export const resolveCategoryId = (
  categoria: string | null,
): { categoryId: CategoryId; needsCategoryReview: boolean } => {
  const trimmed = categoria?.trim() ?? '';

  if (trimmed.length === 0) {
    return { categoryId: 'sin-categoria', needsCategoryReview: true };
  }

  const resolved = CATEGORY_ID_BY_NORMALIZED_LABEL.get(normalizeCategoryKey(trimmed));

  if (!resolved) {
    return { categoryId: 'sin-categoria', needsCategoryReview: true };
  }

  return { categoryId: resolved, needsCategoryReview: false };
};

export type CategoryOption = {
  readonly id: CategoryId;
  readonly label: string;
};

export const getSelectableCategoryOptions = (): readonly CategoryOption[] =>
  CATEGORIES.filter((category) => category.id !== 'sin-categoria').map((category) => ({
    id: category.id,
    label: category.label,
  }));
