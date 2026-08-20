import { Icon } from '../../../../components/Icon/Icon';
import type { DataQualityNoticeContent } from '../../types';
import styles from './DataQualityNotice.module.css';

export type DataQualityNoticeProps = {
  readonly content: DataQualityNoticeContent;
};

export const DataQualityNotice = ({ content }: DataQualityNoticeProps) => (
  <aside className={styles.dataQualityNotice} aria-label="Transparencia de datos">
    <Icon name="info" size={18} className={styles.dataQualityNoticeIcon} />
    <div className={styles.dataQualityNoticeBody}>
      <p className={styles.dataQualityNoticeParagraph}>{content.intro}</p>

      {content.exclusionHeading && (
        <>
          <p className={styles.dataQualityNoticeParagraph}>{content.exclusionHeading}</p>
          {content.exclusionLines.map((line) => (
            <p key={line} className={styles.dataQualityNoticeParagraph}>
              {line}
            </p>
          ))}
        </>
      )}

      {content.inferredSignLine && (
        <p className={styles.dataQualityNoticeParagraph}>{content.inferredSignLine}</p>
      )}
    </div>
  </aside>
);
