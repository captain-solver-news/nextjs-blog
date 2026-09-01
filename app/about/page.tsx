export { aboutMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { aboutSchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import getAuthors from '@/lib/db/actions/get-authors';
import { mdToHtml } from '@/lib/content/md-to-html';
import GitHub from '@/components/icons/github';
import LinkedIn from '@/components/icons/linkedin';
import styles from './page.module.scss';
import { Container } from '@/components/primitives/container/container';

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
                      className={`${styles.avatar} ${styles.avatarDark}`}
                      src={author.avatar_dark_url || '/authors/fallback.jpg'}
                      alt={author.name}
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarDarkHover}`}
                      src={author.avatar_dark_hovered_url || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarLight}`}
                      src={author.avatar_light_url || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                    <img
                      className={`${styles.avatar} ${styles.avatarLightHover}`}
                      src={author.avatar_light_hovered_url || '/authors/fallback.jpg'}
                      alt=""
                      aria-hidden
                    />
                  </picture>
                </div>
                <div className={styles.authorInfo}>
                  <h2 className={styles.authorName}>{author.name}</h2>
                  <p className={styles.authorRole}>{author.job_title}</p>
                  <div className={styles.bio}>
                    <p>{author.bio}</p>
                  </div>
                  <div className={styles.socialLinks}>
                    {author.github_url && (
                      <a className={styles.socialLink} href={author.github_url} aria-label="GitHub">
                        <GitHub className={styles.socialIcon} />
                      </a>
                    )}
                    {author.linkedin_url && (
                      <a className={styles.socialLink} href={author.linkedin_url} aria-label="LinkedIn">
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
