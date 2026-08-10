export { contactMetadata as metadata } from '@/lib/seo/static';
import { JsonLd } from '@/components/seo/json-ld';
import { contactSchema } from '@/lib/seo/static';
import getStaticContent from '@/lib/db/actions/get-static-content';
import getDbConfigs from '@/lib/db/actions/get-db-configs';
import LinkedInContact from '@/components/icons/linkedin-contact';
import XContact from '@/components/icons/x-contact';
import styles from './page.module.scss';
import { mdToHtml } from '@/lib/content/md-to-html';

export default async function ContactPage() {
  const content = await getStaticContent('contact');
  const configs = await getDbConfigs(['contact_email', 'social_link_linkedin', 'social_link_x']);
  const email = configs.find((c) => c.id === 'contact_email')?.value ?? 'hello@dev-signal.com';
  const linkedinUrl = configs.find((c) => c.id === 'social_link_linkedin')?.value ?? '#';
  const xUrl = configs.find((c) => c.id === 'social_link_x')?.value ?? '#';

  return (
    <>
      <article className={styles.page}>
        <header className="border-b border-[var(--border)] pb-6 mb-12">
          <h1 className="text-headline-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {content.title}
          </h1>
        </header>
        <div
          className={`prose text-xl text-[var(--text-secondary)]`}
          dangerouslySetInnerHTML={{ __html: await mdToHtml(content.body) }}
          style={{ fontFamily: 'var(--font-ui)' }}
        />
        <div className={styles.grid}>
          <a href={`mailto:${email}`} className={styles.socialCard}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconBox} ${styles.iconBoxBorder}`}>
                <svg
                  className={styles.icon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className={styles.cardText}>
                <p className={styles.cardLabel}>Direct Inquiries</p>
                <p className={styles.cardTitle}>{email}</p>
              </div>
            </div>
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconBox} ${styles.iconBoxBorder}`}>
                <LinkedInContact className={styles.icon} aria-hidden="true" />
              </div>
              <div className={styles.cardText}>
                <p className={styles.cardLabel}>Official Page</p>
                <p className={styles.cardTitle}>LinkedIn</p>
              </div>
            </div>
          </a>
          <a href={xUrl} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconBox} ${styles.iconBoxBorder}`}>
                <XContact className={styles.icon} aria-hidden="true" />
              </div>
              <div className={styles.cardText}>
                <p className={styles.cardLabel}>Latest Updates</p>
                <p className={styles.cardTitle}>Twitter / X</p>
              </div>
            </div>
          </a>
        </div>

        <div className={styles.imageWrapper}>
          <picture>
            <img
              className={styles.image}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaFwgrs6l9kGCdGQTObx6PtuJXcmNyM_1qdPiToAlxRskIQj0elEFS5Y5xF_YI2LCY8eDv8tBSzSqht_1UfvyL1V7InFdX7gY3ohzPqb9UkyyYFM3Jpftt6-JSGggE2i2-cD5yx5_J1g_bvsTl4XysJQGZ2cpuYdknckBO8jVUkcY7euIUKToZC_mE3pdVFL59Q3-VnBKfAIEY4d3reLYKehFurQSv4QXV6nkkGLS2oc6siGjoFVvFF_cShjtAnzdS1vqD1De1pJE"
              alt="A macro shot of a mechanical keyboard on a dark desk, illuminated by the green glow of an ultra-wide monitor in a dimly lit studio"
            />
          </picture>
          <div className={styles.imageOverlay} />
        </div>
      </article>
      <JsonLd schema={contactSchema} />
    </>
  );
}
