"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./admin.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "default" | "primary" | "dark" | "danger" | "ghost";
  children: ReactNode;
};

export function AdminButton({
  loading,
  variant = "default",
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: Props) {
  const variantClass =
    variant === "primary"
      ? styles.btnPrimary
      : variant === "dark"
        ? styles.btnDark
        : variant === "danger"
          ? styles.btnDanger
          : variant === "ghost"
            ? styles.btnGhost
            : "";

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${loading ? styles.btnLoading : ""} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span className={styles.btnLabel}>{loading ? "Working…" : children}</span>
    </button>
  );
}
