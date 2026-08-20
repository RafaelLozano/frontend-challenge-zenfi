import styles from './MonthHeadline.module.css';

export type MonthHeadlineProps = {
  readonly text: string;
};

export const MonthHeadline = ({ text }: MonthHeadlineProps) => {
  if (text.length === 0) {
    return null;
  }

  return <p className={styles.monthHeadline}>{text}</p>;
};
