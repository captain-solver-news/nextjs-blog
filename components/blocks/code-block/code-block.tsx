import styles from './code-block.module.scss';
import { CopyButton } from './copy-button';
import { highlight } from '@/lib/utils/highlight';

type PropsType = {
  filename?: string | null;
  note?: string | null;
  syntax?: string | null;
  code: string;
};

export async function CodeBlock({ filename, note, syntax, code }: PropsType) {
  const hasHeader = Boolean(filename || note);
  const html = await highlight(code, syntax);

  return (
    <figure className={styles.block}>
      {hasHeader && (
        <figcaption className={styles.header}>
          <span className={styles.filename}>{filename}</span>
          <span className={styles.meta}>
            {note && <span className={styles.note}>{note}</span>}
            <CopyButton code={code} />
          </span>
        </figcaption>
      )}

      <div className={styles.pre} dangerouslySetInnerHTML={{ __html: html }} />

      {!hasHeader && (
        <span className={styles.floatingCopy}>
          <CopyButton code={code} />
        </span>
      )}
    </figure>
  );
}
