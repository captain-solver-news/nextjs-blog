import XIcon from './x.svg?react';

type XProps = {
  className?: string;
};

export default async function X({ className }: XProps) {
  return <XIcon className={className} />;
}
