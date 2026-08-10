import GitHubIcon from './github.svg?react';

type GitHubProps = {
  className?: string;
};

export default async function GitHub({ className }: GitHubProps) {
  return <GitHubIcon className={className} />;
}
