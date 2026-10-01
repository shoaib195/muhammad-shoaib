"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./MagneticButton.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.35 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.35 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set(dx * 0.28);
    my.set(dy * 0.28);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className={styles.label}>{children}</span>
      <span className={styles.shine} aria-hidden="true" />
    </motion.a>
  );
}
