import { navLinks, site } from "@/lib/data";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="socials" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.mark}>{site.name}</span>
          <p className={styles.tagline}>
            Creative visual designer
            <br />
            {site.availability}
          </p>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <p className={styles.label}>Navigate</p>
          <ul>
            <li>
              <a href="#work" data-cursor="hover">
                Playbook
              </a>
            </li>
            {navLinks
              .filter((l) => l.href !== "#work")
              .map((link) => (
                <li key={link.href}>
                  <a href={link.href} data-cursor="hover">
                    {link.label}
                  </a>
                </li>
              ))}
            <li>
              <a href="#about" data-cursor="hover">
                About
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.social}>
          <p className={styles.label}>Socials</p>
          <ul>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} data-cursor="hover">
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.meta}>
          <p className={styles.label}>Location</p>
          <p>{site.location}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {year} {site.fullName}
        </p>
        <a href="#top" className={styles.top} data-cursor="hover">
          Back to top
        </a>
      </div>
    </footer>
  );
}
