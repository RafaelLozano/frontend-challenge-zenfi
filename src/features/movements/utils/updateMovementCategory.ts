import type { CategoryId, DataQualityFlag, Movement } from '../types';
import { buildNote } from './buildNote';
import { computeCountsTowardTotals } from './computeCountsTowardTotals';

export { getCategoryLabel } from '../catalog/categories';

const removeFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => flags.filter((current) => current !== flag);

const addFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => (flags.includes(flag) ? flags : [...flags, flag]);

const finalizeMovement = (movement: Movement): Movement => ({
  ...movement,
  note: buildNote(movement),
  countsTowardTotals: computeCountsTowardTotals(movement),
});

export const updateMovementCategory = (
  movements: readonly Movement[],
  movementId: string,
  categoryId: CategoryId,
): Movement[] =>
  movements.map((movement) => {
    if (movement.id !== movementId) {
      return movement;
    }

    const flags =
      categoryId === 'sin-categoria'
        ? addFlag(removeFlag(movement.flags, 'missing-category'), 'missing-category')
        : removeFlag(movement.flags, 'missing-category');

    return finalizeMovement({
      ...movement,
      categoryId,
      flags,
    });
  });
