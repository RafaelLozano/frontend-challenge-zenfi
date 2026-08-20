import { getEstadoPrecedence } from '../catalog/estados';
import type { DataQualityFlag, Movimiento, MovimientoRaw } from '../types';

type DuplicateContext = {
  readonly raw: MovimientoRaw;
  readonly movimiento: Movimiento;
};

const buildExactDuplicateKey = (raw: MovimientoRaw): string =>
  [raw.fecha, raw.descripcion, String(raw.monto), raw.cuenta ?? '', raw.estado].join('|');

const buildStateGroupKey = (raw: MovimientoRaw): string =>
  [raw.fecha, raw.descripcion, String(raw.monto), raw.cuenta ?? ''].join('|');

const addFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => (flags.includes(flag) ? flags : [...flags, flag]);

const applyFlags = (
  movimiento: Movimiento,
  flags: readonly DataQualityFlag[],
): Movimiento => ({
  ...movimiento,
  flags,
});

export const applyDuplicateDetection = (
  items: readonly DuplicateContext[],
): Movimiento[] => {
  const result = new Map<string, Movimiento>(
    items.map((item) => [item.movimiento.id, item.movimiento]),
  );

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
      const current = result.get(duplicate.movimiento.id);

      if (!current) {
        continue;
      }

      result.set(
        duplicate.movimiento.id,
        applyFlags(current, addFlag(current.flags, 'duplicate')),
      );
    }

    void winner;
  }

  const stateGroups = new Map<string, DuplicateContext[]>();

  for (const item of items) {
    const current = result.get(item.movimiento.id);

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
      const leftPrecedence = getEstadoPrecedence(left.movimiento.status);
      const rightPrecedence = getEstadoPrecedence(right.movimiento.status);

      if (leftPrecedence !== rightPrecedence) {
        return rightPrecedence - leftPrecedence;
      }

      return left.movimiento.id.localeCompare(right.movimiento.id);
    });

    const [, ...superseded] = sorted;

    for (const item of superseded) {
      const current = result.get(item.movimiento.id);

      if (!current) {
        continue;
      }

      result.set(
        item.movimiento.id,
        applyFlags(current, addFlag(current.flags, 'superseded-by-state')),
      );
    }
  }

  return items.map((item) => result.get(item.movimiento.id) ?? item.movimiento);
};
