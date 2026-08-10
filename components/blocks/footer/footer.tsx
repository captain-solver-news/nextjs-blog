import Link from 'next/link';
import styles from './footer.module.scss';
import getDbConfigs from '@/lib/db/actions/get-db-configs';
import { FOOTER_LINKS_1, FOOTER_LINKS_2 } from '@/config';
import GitHub from '@/components/icons/github';
import LinkedIn from '@/components/icons/linkedin';
import X from '@/components/icons/x';

export async function Footer() {
  type IconComponent = typeof GitHub | typeof LinkedIn | typeof X;

  const socialLinksMap = new Map<string, IconComponent>([
    ['social_link_github', GitHub],
    ['social_link_linkedin', LinkedIn],
    ['social_link_x', X],
  ]);

  const linkConfigs = await getDbConfigs(Array.from(socialLinksMap.keys()));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            DEV
          </Link>
          <p className={styles.copyright}>&copy; 2026</p>
        </div>

        <nav className={`${styles.nav}`}>
          <span className={styles['nav-title']}>Navigation</span>
          {FOOTER_LINKS_1.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className={`${styles.nav}`}>
          <span className={styles['nav-title']}>Legal</span>
          {FOOTER_LINKS_2.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.social}>
          <span className={styles['nav-title']}>Social</span>
          <div className={styles['social-icons']}>
            {linkConfigs.map((link) => {
              const Icon = socialLinksMap.get(link.id) as IconComponent;

              return (
                <Link key={link.id} href={link.value} className={styles.link} target="_blank" rel="noopener noreferrer">
                  <Icon className={styles['social-icon']} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
