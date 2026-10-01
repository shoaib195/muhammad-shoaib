"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "./data";
import { Reveal } from "./Reveal";
import styles from "./FAQ.module.css";

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={styles.item}>
      <h3>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={styles.question}>{question}</span>
          <span className={styles.icon} aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className={styles.panel}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.answer}>{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <Reveal>
          <h2 id="faq-title" className={styles.heading}>
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </Reveal>

        <Reveal className={styles.list} delay={0.1}>
          {faqs.map((item, index) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
