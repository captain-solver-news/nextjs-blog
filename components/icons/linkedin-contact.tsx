import LinkedInContactIcon from './linkedin-contact.svg?react';

type LinkedInContactProps = {
  className?: string;
};

export default async function LinkedInContact({ className }: LinkedInContactProps) {
  return <LinkedInContactIcon className={className} />;
}
