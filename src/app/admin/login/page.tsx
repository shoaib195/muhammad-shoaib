import { Suspense } from "react";
import { LoginForm } from "@/admin/LoginForm";
import styles from "@/admin/LoginForm.module.css";

export const metadata = {
  title: "Admin Login — Muhammad Shoaib",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className={styles.page}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
