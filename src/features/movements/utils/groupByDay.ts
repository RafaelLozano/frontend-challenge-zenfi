import type { Movement } from '../types';

export type DayGroup = {
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly sumCents: number;
  readonly movements: readonly Movement[];
};

export const groupByDay = (
  movements: readonly Movement[],
  period?: string,
): readonly DayGroup[] => {
  const groups = new Map<string, { dayLabel: string; movements: Movement[] }>();

  for (const movement of movements) {
    const existing = groups.get(movement.dayKey);

    if (existing) {
      existing.movements.push(movement);
      continue;
    }

    groups.set(movement.dayKey, {
      dayLabel: movement.dayLabel,
      movements: [movement],
    });
  }

  const sortByDayKeyDesc = (
    left: readonly [string, { dayLabel: string; movements: Movement[] }],
    right: readonly [string, { dayLabel: string; movements: Movement[] }],
  ) => right[0].localeCompare(left[0]);

  const entries = [...groups.entries()];

  const sortedEntries =
    period === undefined
      ? entries.sort(sortByDayKeyDesc)
      : [
          ...entries.filter(([dayKey]) => dayKey.slice(0, 7) === period).sort(sortByDayKeyDesc),
          ...entries.filter(([dayKey]) => dayKey.slice(0, 7) !== period).sort(sortByDayKeyDesc),
        ];

  return sortedEntries.map(([dayKey, group]) => {
    let sumCents = 0;

    for (const movement of group.movements) {
      if (movement.countsTowardTotals) {
        sumCents += movement.amountCents;
      }
    }

    const sortedMovements = [...group.movements].sort(
      (left, right) => right.date.getTime() - left.date.getTime(),
    );

    return {
      dayKey,
      dayLabel: group.dayLabel,
      sumCents,
      movements: sortedMovements,
    };
  });
};
