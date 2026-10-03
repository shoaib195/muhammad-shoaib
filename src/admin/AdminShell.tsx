"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminButton } from "./AdminButton";
import styles from "./admin.module.css";

const links = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/analytics", label: "Analytics", icon: "M4 19V5M4 19h16M8 16V9M12 16V7M16 16v-4" },
  { href: "/admin/landing", label: "Landing", icon: "M4 6h16M4 12h10M4 18h14" },
  { href: "/admin/projects", label: "Projects", icon: "M4 7h16v12H4zM8 7V5h8v2" },
  { href: "/admin/experience", label: "Experience", icon: "M8 7V5h8v2M4 7h16v12H4z" },
  { href: "/admin/messages", label: "Messages", icon: "M4 6h16v12H4zM4 8l8 5 8-5" },
  { href: "/admin/settings", label: "Settings", icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2M18 12h2M12 4v2M12 18v2" },
];

export function AdminShell({
  children,
  email,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  email?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={styles.shell}>
      <div className={styles.layout}>
        {open ? <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

        <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandMark}>MS</span>
            Admin
          </Link>

          <nav aria-label="Admin">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.navLink} ${isActive(l.href, l.exact) ? styles.navActive : ""}`}
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d={l.icon} />
                </svg>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFoot}>
            <p className={styles.sidebarEmail}>{email}</p>
            <Link href="/" className={styles.navLink} target="_blank" rel="noreferrer">
              View site
            </Link>
            <AdminButton variant="dark" loading={loggingOut} onClick={logout}>
              Log out
            </AdminButton>
          </div>
        </aside>

        <div className={styles.mainWrap}>
          <header className={styles.topbar}>
            <button type="button" className={styles.menuBtn} aria-label="Open menu" onClick={() => setOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div style={{ flex: 1 }}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle ? <p className={styles.muted}>{subtitle}</p> : null}
            </div>
            {actions}
          </header>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
