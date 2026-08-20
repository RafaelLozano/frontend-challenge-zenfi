import type { MovimientoEstado } from '../types';

export type EstadoConfig = {
  readonly id: MovimientoEstado;
  readonly label: string;
  readonly background: string;
  readonly text: string;
  readonly dot: string;
  readonly explanation: string;
  readonly precedence: number;
};

export const ESTADOS: readonly EstadoConfig[] = [
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

const ESTADO_BY_ID = new Map<MovimientoEstado, EstadoConfig>(
  ESTADOS.map((estado) => [estado.id, estado]),
);

export const getEstadoConfig = (status: MovimientoEstado): EstadoConfig =>
  ESTADO_BY_ID.get(status) ?? ESTADO_BY_ID.get('confirmada')!;

export const getEstadoPrecedence = (status: MovimientoEstado): number =>
  getEstadoConfig(status).precedence;

export const countsTowardTotalsByStatus = (status: MovimientoEstado): boolean =>
  status === 'confirmada' || status === 'pendiente' || status === 'en_disputa';
