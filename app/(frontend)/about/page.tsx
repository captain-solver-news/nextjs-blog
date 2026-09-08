export { aboutMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { aboutSchema } from '@/lib/seo/static';
import Link from 'next/link';
import { AUTHOR_PREFIX } from '@/config';
import getStaticContent from '@/lib/actions/get-static-content';
import getAuthors from '@/lib/actions/get-authors';
import { mdToHtml } from '@/lib/utils/md-to-html';
import GitHub from '@/components/icons/github';
import LinkedIn from '@/components/icons/linkedin';
import styles from './page.module.scss';
import { Container } from '@/components/primitives/container/container';
import { CollapsibleText } from '@/components/primitives/collapsible-text/collapsible-text';

export default async function AboutPage() {
  const [content, authors] = await Promise.all([getStaticContent('about'), getAuthors()]);

  return (
    <>
      <Container as="article" className={styles.page}>
        <header className={styles.hero}>
          <span className={styles.tagline}>Deep-Dive Technical Investigations</span>
          <h1 className={styles.title}>{content.title}</h1>
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: await mdToHtml(content.body) }} />
        </header>

        <section className={styles.authorsSection}>
          {authors.map((author) => (
            <article key={author.id} className={styles.authorCard}>
              <div className={styles.cardContent}>
                <div className={styles.avatarWrapper}>
                  <picture>
                    <img
                      className={styles.avatar}
                      src={author.avatarDarkUrl || '/authors/fallback.jpg'}
                      alt={author.name}
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarDarkHover}`}
                      src={author.avatarDarkHoveredUrl || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarLight}`}
                      src={author.avatarLightUrl || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarLightHover}`}
                      src={author.avatarLightHoveredUrl || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                  </picture>
                </div>
                <div className={styles.authorInfo}>
                  <h2 className={styles.authorName}>
                    <Link href={`/${AUTHOR_PREFIX}/${author.slug}`} className={styles.authorNameLink}>
                      {author.name}
                    </Link>
                  </h2>
                  <p className={styles.authorRole}>{author.jobTitle}</p>
                  {author.bio && <CollapsibleText text={author.bio} className={styles.bio} />}
                  <div className={styles.socialLinks}>
                    {author.githubUrl && (
                      <a className={styles.socialLink} href={author.githubUrl} aria-label="GitHub">
                        <GitHub className={styles.socialIcon} />
                      </a>
                    )}
                    {author.linkedinUrl && (
                      <a className={styles.socialLink} href={author.linkedinUrl} aria-label="LinkedIn">
                        <LinkedIn className={styles.socialIcon} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </Container>
      <JsonLd schema={aboutSchema} />
    </>
  );
}
