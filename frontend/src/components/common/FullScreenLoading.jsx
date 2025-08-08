import React, { useEffect, useMemo, useState } from 'react';
import styles from './FullScreenLoading.module.css';
import logo from '../../assets/images/logo.png';
import loadingMessages from '../../utils/loadingMessages';
import IrisSpinnerSecondary from './IrisSpinnerSecondary';

const MESSAGE_HEIGHT_PX = 24; // must match --msg-h in CSS
const VISIBLE_COUNT = 4; // current + next 3 shown (matches screenshot feel)
const CHANGE_INTERVAL_MS = 3000;
const TRANSITION_MS = 400; // match CSS transition

function minimalCircularDistance(a, b, length) {
  const diff = Math.abs(a - b);
  return Math.min(diff, length - diff);
}

const FullScreenLoading = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % loadingMessages.length);
    }, CHANGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Tripled array to avoid jump on wrap
  const tripled = useMemo(
    () => [...loadingMessages, ...loadingMessages, ...loadingMessages],
    []
  );

  // offset index sits in the middle block
  const offsetIndex = currentIndex + loadingMessages.length;

  // translate so that offsetIndex is pinned to the top of the viewport
  // When currentIndex === 0 => offsetIndex === len => translateY = 0
  const translateY = -offsetIndex * MESSAGE_HEIGHT_PX + loadingMessages.length * MESSAGE_HEIGHT_PX;

  return (
    <div className={styles.fullScreenContainer} role="status" aria-live="polite">
      {/* Optional logo — it fades in but does not spin */}
      <img src={logo} alt="Project Iris Logo" className={styles.logo} />

      <div className={styles.listRow}>
        {/* Left spinner like in screenshot */}
        <div className={styles.leftSpinner} aria-hidden="true">
          <IrisSpinnerSecondary />
        </div>

        {/* Messages column (viewport) */}
        <div
          className={styles.messagesViewport}
          style={{ height: `${MESSAGE_HEIGHT_PX * VISIBLE_COUNT}px` }}
        >
          <div
            className={styles.messagesInner}
            style={{
              transform: `translateY(${translateY}px)`,
              transition: `transform ${TRANSITION_MS}ms cubic-bezier(.2,.9,.2,1)`,
            }}
          >
            {tripled.map((msg, i) => {
              const originalIndex = i % loadingMessages.length;
              const dist = minimalCircularDistance(originalIndex, currentIndex, loadingMessages.length);

              // Opacity tiers for current and next items
              let opacity = 0;
              if (dist === 0) opacity = 1; // current (top)
              else if (dist === 1) opacity = 0.65;
              else if (dist === 2) opacity = 0.45;
              else if (dist === 3) opacity = 0.28;
              else opacity = 0; // hide further items

              // current item is semibold
              const isCurrent = dist === 0;

              return (
                <div
                  key={`${i}-${originalIndex}`}
                  className={`${styles.messageLine} ${isCurrent ? styles.currentLine : ''}`}
                  style={{
                    height: `${MESSAGE_HEIGHT_PX}px`,
                    lineHeight: `${MESSAGE_HEIGHT_PX}px`,
                    opacity,
                    transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
                  }}
                  aria-hidden={dist !== 0}
                >
                  {msg}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoading;
