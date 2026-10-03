import { Suspense } from "react";
import { LoginForm } from "@/admin/LoginForm";
import styles from "@/admin/admin.module.css";

export const metadata = {
  title: "Admin Login — Muhammad Shoaib",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className={styles.shell}>
      <Suspense fallback={<div className={styles.loginWrap}>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
