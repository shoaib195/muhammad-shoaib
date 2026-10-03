"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/landing", label: "Landing" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  children,
  email,
  title,
  subtitle,
  welcome,
  metrics,
}: {
  children: React.ReactNode;
  email?: string;
  title: string;
  subtitle?: string;
  welcome?: boolean;
  metrics?: { label: string; value: string | number }[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const initial = (email || "A").slice(0, 1).toUpperCase();

  return (
    <div className={styles.shell}>
      <div className={styles.layout}>
        <header className={styles.topNav}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandMark}>MS</span>
            Portfolio
          </Link>

          <nav className={styles.pillNav} aria-label="Admin">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.navLink} ${isActive(l.href, l.exact) ? styles.navActive : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={styles.topActions}>
            <Link href="/" className={styles.btn} target="_blank" rel="noreferrer">
              View site
            </Link>
            <button type="button" className={`${styles.btn} ${styles.btnDark}`} onClick={logout}>
              Log out
            </button>
            <span className={styles.avatar} title={email}>
              {initial}
            </span>
          </div>
        </header>

        {welcome ? (
          <section className={styles.welcome}>
            <div>
              <h1 className={styles.welcomeTitle}>Welcome in, {email?.split("@")[0] || "Admin"}.</h1>
              <p className={styles.welcomeSub}>
                Edit the full landing page, projects and messages. Saves push to Neon and refresh the live site.
              </p>
            </div>
            {metrics?.length ? (
              <div className={styles.metricRow}>
                {metrics.map((m) => (
                  <div key={m.label} className={styles.metric}>
                    <p className={styles.metricLabel}>{m.label}</p>
                    <p className={styles.metricValue}>{m.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : (
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.title}>{title}</h1>
              {subtitle ? <p className={styles.muted}>{subtitle}</p> : null}
            </div>
          </div>
        )}

        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
