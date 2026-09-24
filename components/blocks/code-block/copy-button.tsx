'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './code-block.module.scss';

type PropsType = {
  code: string;
};

const RESET_MS = 2000;

export function CopyButton({ code }: PropsType) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => setIsCopied(false), RESET_MS);

    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button type="button" className={styles.copy} onClick={copy} aria-label={isCopied ? 'Code copied' : 'Copy code'}>
      {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </button>
  );
}
