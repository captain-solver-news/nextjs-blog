'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import styles from './code-typer.module.scss';
import { sliceTokens, snippets, tokenize } from './snippets';

type PhaseType = 'typing' | 'holding' | 'deleting' | 'blank';

type PropsType = {
  className?: string;
};

const TYPE_MS = 26;
const DELETE_MS = 18;
const DELETE_STEP = 3;
const HOLD_MS = 2400;
const BLANK_MS = 550;

const IMMEDIATE = 0;

export function CodeTyper({ className }: PropsType) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  // The first snippet starts fully typed so that the server-rendered block and the
  // first animated frame match, and the loop simply picks up at its hold.
  const [typed, setTyped] = useState(snippets[0].code.length);
  const [phase, setPhase] = useState<PhaseType>('holding');
  const [isAnimated, setIsAnimated] = useState(false);

  const tokenized = useMemo(() => snippets.map((snippet) => tokenize(snippet.code)), []);
  // The pane reserves room for the tallest and widest snippet, so neither the
  // typing nor a snippet swap can change its size.
  const lines = useMemo(() => Math.max(...snippets.map((snippet) => snippet.code.split('\n').length)), []);
  const columns = useMemo(
    () => Math.max(...snippets.flatMap((snippet) => snippet.code.split('\n').map((line) => line.length))),
    []
  );

  const snippet = snippets[snippetIndex];
  const tokens = tokenized[snippetIndex];

  // The animation only runs once the client has confirmed motion is welcome, so
  // server output and reduced-motion users get the finished snippet instead.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setIsAnimated(!query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isAnimated) return;

    const length = snippet.code.length;

    const schedule: Record<PhaseType, [number, () => void]> = {
      typing: typed < length ? [TYPE_MS, () => setTyped((count) => count + 1)] : [IMMEDIATE, () => setPhase('holding')],
      holding: [HOLD_MS, () => setPhase('deleting')],
      deleting:
        typed > 0
          ? [DELETE_MS, () => setTyped((count) => Math.max(0, count - DELETE_STEP))]
          : [IMMEDIATE, () => setPhase('blank')],
      blank: [
        BLANK_MS,
        () => {
          setSnippetIndex((index) => (index + 1) % snippets.length);
          setPhase('typing');
        },
      ],
    };

    const [delay, advance] = schedule[phase];
    const timer = setTimeout(advance, delay);

    return () => clearTimeout(timer);
  }, [isAnimated, phase, typed, snippet.code.length]);

  const visible = isAnimated ? sliceTokens(tokens, typed) : tokens;

  return (
    <div className={`${styles.codeBlock} ${className ?? ''}`.trim()} aria-hidden="true">
      <div className={styles.codeHeader}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span key={snippet.filename} className={styles.codeFilename}>
          {snippet.filename}
        </span>
      </div>

      <pre className={styles.code} style={{ '--code-lines': lines, '--code-columns': columns } as CSSProperties}>
        <code>
          {visible.map((token, index) => (
            <span key={index} className={styles[token.type]}>
              {token.text}
            </span>
          ))}
          <span className={`${styles.caret} ${phase === 'typing' ? styles.caretSolid : ''}`.trim()} />
        </code>
      </pre>

      <div className={styles.codeFooter}>
        <span>{snippet.language}</span>
        <span className={styles.codeStatus}>Signal over noise</span>
      </div>
    </div>
  );
}
