import LinkedInIcon from './linkedin.svg?react';

type LinkedInProps = {
  className?: string;
};

export default async function LinkedIn({ className }: LinkedInProps) {
  return <LinkedInIcon className={className} />;
}
