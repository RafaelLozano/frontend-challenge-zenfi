import type { CategoryId } from '../types';
import { resolveCategoryId } from '../catalog/categories';

export const normalizeCategory = (
  categoria: string | null,
): { categoryId: CategoryId; needsCategoryReview: boolean } => resolveCategoryId(categoria);
