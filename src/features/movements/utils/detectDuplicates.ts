import { getStatusPrecedence } from '../catalog/states';
import type { DataQualityFlag, Movement, MovementRaw } from '../types';

type DuplicateContext = {
  readonly raw: MovementRaw;
  readonly movement: Movement;
};

const buildExactDuplicateKey = (raw: MovementRaw): string =>
  [raw.fecha, raw.descripcion, String(raw.monto), raw.cuenta ?? '', raw.estado].join('|');

const buildStateGroupKey = (raw: MovementRaw): string =>
  [raw.fecha, raw.descripcion, String(raw.monto), raw.cuenta ?? ''].join('|');

const addFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => (flags.includes(flag) ? flags : [...flags, flag]);

const applyFlags = (movement: Movement, flags: readonly DataQualityFlag[]): Movement => ({
  ...movement,
  flags,
});

export const applyDuplicateDetection = (items: readonly DuplicateContext[]): Movement[] => {
  const result = new Map<string, Movement>(items.map((item) => [item.movement.id, item.movement]));

  const exactGroups = new Map<string, DuplicateContext[]>();

  for (const item of items) {
    const key = buildExactDuplicateKey(item.raw);
    const group = exactGroups.get(key) ?? [];
    group.push(item);
    exactGroups.set(key, group);
  }

  for (const group of exactGroups.values()) {
    if (group.length <= 1) {
      continue;
    }

    const [winner, ...duplicates] = group;

    for (const duplicate of duplicates) {
      const current = result.get(duplicate.movement.id);

      if (!current) {
        continue;
      }

      result.set(duplicate.movement.id, applyFlags(current, addFlag(current.flags, 'duplicate')));
    }

    void winner;
  }

  const stateGroups = new Map<string, DuplicateContext[]>();

  for (const item of items) {
    const current = result.get(item.movement.id);

    if (!current || current.flags.includes('duplicate')) {
      continue;
    }

    const key = buildStateGroupKey(item.raw);
    const group = stateGroups.get(key) ?? [];
    group.push(item);
    stateGroups.set(key, group);
  }

  for (const group of stateGroups.values()) {
    if (group.length <= 1) {
      continue;
    }

    const sorted = [...group].sort((left, right) => {
      const leftPrecedence = getStatusPrecedence(left.movement.status);
      const rightPrecedence = getStatusPrecedence(right.movement.status);

      if (leftPrecedence !== rightPrecedence) {
        return rightPrecedence - leftPrecedence;
      }

      return left.movement.id.localeCompare(right.movement.id);
    });

    const [, ...superseded] = sorted;

    for (const item of superseded) {
      const current = result.get(item.movement.id);

      if (!current) {
        continue;
      }

      result.set(
        item.movement.id,
        applyFlags(current, addFlag(current.flags, 'superseded-by-state')),
      );
    }
  }

  return items.map((item) => result.get(item.movement.id) ?? item.movement);
};
