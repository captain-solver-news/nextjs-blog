import type { ElementType, ReactNode } from 'react';
import styles from './container.module.scss';

type ContainerSize = 'measure' | 'shell';

interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

export function Container({ as: Tag = 'div', size = 'measure', className, children }: ContainerProps) {
  const classNames = [styles.container, size === 'shell' ? styles.shell : null, className].filter(Boolean).join(' ');

  return <Tag className={classNames}>{children}</Tag>;
}
