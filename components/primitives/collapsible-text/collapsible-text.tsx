'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './collapsible-text.module.scss';

type PropsType = {
  text: string;
  lines?: number;
  className?: string;
};

export function CollapsibleText({ text, lines = 3, className }: PropsType) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const textRef = useRef<HTMLParagraphElement>(null);
  const textId = useId();

  useEffect(() => {
    const node = textRef.current;
    // Expanded text never overflows its own box, so only measure while it is clamped.
    if (!node || isExpanded) return;

    const measure = () => setIsOverflowing(node.scrollHeight > node.clientHeight + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [isExpanded]);

  return (
    <div className={className}>
      <p
        ref={textRef}
        id={textId}
        className={`${styles.text} ${isExpanded ? '' : styles.clamped}`.trim()}
        style={isExpanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>

      {isOverflowing && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-controls={textId}
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <svg
            className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconUp : ''}`.trim()}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
}
