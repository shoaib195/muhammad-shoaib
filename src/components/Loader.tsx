"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Loader.module.css";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const done = window.setTimeout(() => setVisible(false), 1750);
    return () => window.clearTimeout(done);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className={styles.loader}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden="true"
        >
          <div className={styles.glow} />
          <div className={styles.grain} />
          <div className={styles.inner}>
            <motion.span
              className={styles.mark}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              VERONICA PW
            </motion.span>
            <motion.div
              className={styles.bar}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
