export { homeMetadata as metadata } from '@/lib/seo/static';
import { homeSchema } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import styles from './page.module.scss';
import Image from 'next/image';
import getFeaturedPosts from '@/lib/db/actions/get-featured-posts';
import Link from 'next/link';

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.gridBg} aria-hidden="true" />
        <div className={styles.content}>
          <span className={styles.badge}>Version 0.0.1</span>
          <h1 className={styles.title}>
            Modern engineering insights for the <span className={styles.accent}>AI paradigm shift.</span>
          </h1>
          <p className={styles.description}>
            We parse the noise of rapid technical evolution to deliver deep-dive architecture reviews and engineering
            patterns that actually scale.
          </p>
          <div className={styles.actions}>
            <a href="#" className={styles.btnPrimary}>
              Read Latest Articles
            </a>
            <a href="#" className={styles.btnSecondary}>
              Explore Codebases
            </a>
          </div>
        </div>
        <div className={styles.codeBlock} aria-hidden="true">
          <div className={styles.codeHeader}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.codeFilename}>transformer.ts</span>
          </div>
          <pre className={styles.code}>
            <code>{`async function optimizeSignal() {
  const kernel = await loadModel();
  return kernel.process(input);
}`}</code>
          </pre>
        </div>
      </section>

      <section className={styles.metrics}>
        <div className={styles.metricsInner}>
          <div className={styles.metricsHeader}>
            <h2 className={styles.sectionTitle}>Evaluation Metrics</h2>
            <p className={styles.sectionSubtitle}>How we measure the technical part of each post</p>
          </div>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Image src="/icons/Homepage-1.svg" alt="" width="18" height="18" />
              </div>
              <h3 className={styles.metricTitle}>Expertise Beyond LLMs</h3>
              <p className={styles.metricDesc}>
                The post&apos;s expertise is higher than what a standard LLM can provide, offering deep technical
                nuance.
              </p>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Image src="/icons/Homepage-2.svg" alt="" width="20" height="20" />
              </div>
              <h3 className={styles.metricTitle}>Real-World Foundation</h3>
              <p className={styles.metricDesc}>
                Content is built on real-life examples and production-grade scenarios, not theoretical abstractions.
              </p>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Image src="/icons/Homepage-3.svg" alt="" width="16" height="20" />
              </div>
              <h3 className={styles.metricTitle}>Subject Matter Authority</h3>
              <p className={styles.metricDesc}>
                The author has extensive, hands-on experience in the subject matter they are writing about.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.authors}>
        <div className={styles.authorsInner}>
          <h2 className={styles.sectionTitle}>The authors are active engineers and programmers</h2>
          <p className={styles.sectionBody}>
            We don&apos;t employ &quot;content creators.&quot; Our contributors are active software architects, DevOps
            practitioners, and systems researchers who build the very tech they write about.
          </p>
          <a href="#" className={styles.learnMore}>
            Learn more about our team
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <div className={styles.checkList}>
            <div className={styles.checkItem}>
              <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <p className={styles.checkTitle}>Zero AI-Generated Fluff</p>
                <p className={styles.checkDesc}>Every word is original human expertise, verified for accuracy.</p>
              </div>
            </div>
            <div className={styles.checkItem}>
              <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <p className={styles.checkTitle}>Production-Grade Examples</p>
                <p className={styles.checkDesc}>
                  No &quot;Hello World.&quot; We focus on complex systems and trade-offs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredInner}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>Featured Posts</h2>
            <a href="#" className={styles.viewAll}>
              View All Posts
            </a>
          </div>
          <div className={styles.featuredList}>
            {featuredPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const authorsNames = post.authors?.length ? post.authors.map((a) => a.name).join(', ') : 'Anonymous';

              return (
                <Link key={post.id} href={`/blog/${post.path}`} className={styles.postCardLink}>
                  <article key={post.id} className={styles.postCard}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postExcerpt}>{post.teaser}</p>

                    <div className={styles.postMeta}>
                      <span className={styles.postAuthor}>{authorsNames}</span>
                      <span className={styles.postDot}>•</span>
                      <span className={styles.postDate}>{formattedDate}</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <JsonLd schema={homeSchema} />
    </>
  );
}
