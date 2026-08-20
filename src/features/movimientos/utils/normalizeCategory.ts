import type { CategoriaId } from '../types';
import { resolveCategoriaId } from '../catalog/categorias';

export const normalizeCategory = (
  categoria: string | null,
): { categoryId: CategoriaId; needsCategoryReview: boolean } => resolveCategoriaId(categoria);
