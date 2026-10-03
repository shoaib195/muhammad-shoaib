"use client";

import styles from "./admin.module.css";

export function Skeleton({
  height = 16,
  width = "100%",
  radius = 12,
  className = "",
}: {
  height?: number | string;
  width?: number | string;
  radius?: number;
  className?: string;
}) {
  return (
    <span
      className={`${styles.skeleton} ${className}`.trim()}
      style={{ height, width, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className={`${styles.card} ${styles.skeletonCard}`}>
      <Skeleton height={14} width="36%" />
      <Skeleton height={28} width="55%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={`${88 - i * 12}%`} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.skeletonTable}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <Skeleton height={18} width="28%" />
            <Skeleton height={18} width="18%" />
            <Skeleton height={18} width="14%" />
            <Skeleton height={34} width={120} radius={999} />
          </div>
        ))}
      </div>
    </div>
  );
}
