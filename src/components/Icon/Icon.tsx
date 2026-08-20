import styles from './Icon.module.css';

export type IconProps = {
  readonly name: string;
  readonly size?: number;
};

export const Icon = ({ name, size = 24 }: IconProps) => (
  <span
    className={`ms ${styles.icon}`}
    aria-hidden="true"
    style={{ fontSize: size }}
  >
    {name}
  </span>
);
