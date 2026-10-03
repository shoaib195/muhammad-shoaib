"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useLanding } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";
import styles from "./Stakes.module.css";
import s from "../Site.module.css";

export function Stakes() {
  const { stakes } = useLanding();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 70%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section className={s.section} id="stakes">
      <div className={s.sectionGlow} aria-hidden="true" />
      <div className={`${s.container} ${styles.inner}`}>
        <div className={s.taglineRow}>
          <p className={s.tagline}>{stakes.tagline}</p>
          <span className={s.taglineLine} aria-hidden="true" />
        </div>

        <div className={styles.grid}>
          <Reveal className={styles.sticky}>
            <h2 className={`${s.h2} ${styles.h2}`}>
              <span className={s.dim}>{stakes.dim}</span>
              <span className={s.bright}>
                {stakes.bright} <span className={s.textGradient}>{stakes.brightAccent}</span>
              </span>
            </h2>
            <p className={`${s.bodyMuted} ${styles.lead}`}>{stakes.lead}</p>
            <ol className={styles.sequence} aria-label="What gets checked before shipping">
              {stakes.sequence.map((step, i) => (
                <motion.li
                  key={step}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.12 * i, duration: 0.45 }}
                >
                  <span className={styles.seqDot} aria-hidden="true" />
                  {step}
                </motion.li>
              ))}
            </ol>
            <p className={`${s.bodyMuted} ${styles.leadSmall}`}>{stakes.leadSmall}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <ol className={styles.timeline} ref={listRef}>
              <span className={styles.rail} aria-hidden="true" />
              <motion.span
                className={`${styles.rail} ${styles.railActive}`}
                aria-hidden="true"
                style={reduced ? undefined : { scaleY: grow }}
              />

              <li className={styles.row}>
                <span className={styles.time}>4:47 PM</span>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.cell}>
                  <span className={styles.channel}>#deploys</span>
                  <p className={styles.text}>
                    You merge the new checkout flow. AI wrote most of it. Tests are green, review took
                    four minutes. <span className={styles.white}>Ship it.</span>
                  </p>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>11:02 PM</span>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.cell}>
                  <p className={styles.text}>
                    The midnight sale goes live. Traffic climbs to 9× normal. Nothing looks wrong yet.
                  </p>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>2:14 AM</span>
                <span className={`${styles.dot} ${styles.dotRed}`} aria-hidden="true" />
                <div className={styles.cell}>
                  <div className={styles.alert}>
                    <p className={styles.alertLabel}>
                      <span className={styles.pulse} />
                      SEV-1 · Paging on-call
                    </p>
                    <p className={`${styles.text} ${styles.white}`}>
                      checkout page LCP <span className={s.mono}>12.4s</span> on mobile. Carts are
                      abandoning.
                    </p>
                  </div>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>2:16 AM</span>
                <span className={`${styles.dot} ${styles.dotRed}`} aria-hidden="true" />
                <div className={styles.cell}>
                  <pre className={styles.log}>
                    <span className={styles.err}>ERROR</span> Hydration failed: text content mismatch{"\n"}
                    <span className={styles.err}>ERROR</span> Maximum update depth exceeded{"\n"}
                    <span className={styles.dimText}>… ×4,182 in the last 60s</span>
                  </pre>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>2:21 AM</span>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.cell}>
                  <span className={styles.channel}>#incident-checkout</span>
                  <div className={styles.msg}>
                    <span className={styles.avatar}>EL</span>
                    <div>
                      <p className={styles.name}>Eng Lead</p>
                      <p className={styles.msgText}>
                        You wrote the cart sync effect, right? Walk me through what it does when the
                        price API times out.
                      </p>
                    </div>
                  </div>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>2:22 AM</span>
                <span className={`${styles.dot} ${styles.dotWhite}`} aria-hidden="true" />
                <div className={styles.cell}>
                  <div className={styles.msg}>
                    <span className={`${styles.avatar} ${styles.avatarYou}`}>You</span>
                    <div>
                      <p className={styles.name}>You</p>
                      <p className={styles.typing}>
                        <span />
                        <span />
                        <span />
                      </p>
                    </div>
                  </div>
                  <p className={styles.handNote}>↑← you. still typing. for 11 minutes.</p>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>3:38 AM</span>
                <span className={`${styles.dot} ${styles.dotYellow}`} aria-hidden="true" />
                <div className={styles.cell}>
                  <div className={styles.msg}>
                    <span className={`${styles.avatar} ${styles.avatarSenior}`}>SE</span>
                    <div>
                      <p className={styles.name}>Senior Engineer</p>
                      <p className={styles.msgText}>
                        Found it. Effect refetches on every render with no dependency guard and no
                        abort. Each timeout kicked off three more requests, and the main thread
                        drowned. <span className={styles.white}>Fix is 4 lines, deploying now.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>

              <li className={styles.row}>
                <span className={styles.time}>9:00 AM</span>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.cell}>
                  <p className={styles.text}>
                    Postmortem. <span className={styles.white}>Your name is on the PR.</span> Theirs is
                    on the fix.
                  </p>
                </div>
              </li>
            </ol>

            <p className={styles.closing}>
              <span className={s.dim}>{stakes.closingDim}</span>
              <span className={s.bright}>
                {stakes.closingBrightBefore}{" "}
                <span className={s.textGradient}>{stakes.closingBrightAccent}</span>
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
