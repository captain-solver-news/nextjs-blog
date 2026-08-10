import XContactIcon from './x-contact.svg?react';

type XContactProps = {
  className?: string;
};

export default async function XContact({ className }: XContactProps) {
  return <XContactIcon className={className} />;
}
