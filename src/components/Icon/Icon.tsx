import styles from './Icon.module.css';

export type IconProps = {
  readonly name: string;
  readonly size?: number;
  readonly className?: string;
};

export const Icon = ({ name, size = 24, className }: IconProps) => (
  <span
    className={`ms ${styles.icon}${className ? ` ${className}` : ''}`}
    aria-hidden="true"
    style={{ fontSize: size }}
  >
    {name}
  </span>
);
