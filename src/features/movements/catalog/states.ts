import type { MovementStatus } from '../types';

export type StatusConfig = {
  readonly id: MovementStatus;
  readonly label: string;
  readonly background: string;
  readonly text: string;
  readonly dot: string;
  readonly explanation: string;
  readonly precedence: number;
};

export const STATUSES: readonly StatusConfig[] = [
  {
    id: 'confirmada',
    label: 'Confirmada',
    background: '#EFEDF6',
    text: '#5B5570',
    dot: '#5B5570',
    explanation: 'Cargo confirmado: ya se aplicó de forma definitiva a tu cuenta.',
    precedence: 4,
  },
  {
    id: 'en_disputa',
    label: 'En disputa',
    background: '#FFE8EE',
    text: '#D81E56',
    dot: '#D81E56',
    explanation:
      'En disputa: estás aclarando este cargo con tu banco. Puedes seguir corrigiendo su categoría.',
    precedence: 3,
  },
  {
    id: 'pendiente',
    label: 'Pendiente',
    background: '#FFF3DE',
    text: '#A8690A',
    dot: '#E0A008',
    explanation:
      'Pendiente: el comercio autorizó el cargo pero el monto final aún puede cambiar.',
    precedence: 2,
  },
  {
    id: 'programada',
    label: 'Programada',
    background: '#E1F3FF',
    text: '#0A7FC2',
    dot: '#0A7FC2',
    explanation: 'Programada: es una operación agendada, se ejecuta en la fecha indicada.',
    precedence: 1,
  },
] as const;

const STATUS_BY_ID = new Map<MovementStatus, StatusConfig>(
  STATUSES.map((status) => [status.id, status]),
);

export const getStatusConfig = (status: MovementStatus): StatusConfig =>
  STATUS_BY_ID.get(status) ?? STATUS_BY_ID.get('confirmada')!;

export const getStatusPrecedence = (status: MovementStatus): number =>
  getStatusConfig(status).precedence;

export const countsTowardTotalsByStatus = (status: MovementStatus): boolean =>
  status === 'confirmada' || status === 'pendiente' || status === 'en_disputa';
