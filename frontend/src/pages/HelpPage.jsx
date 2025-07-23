import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import styles from "./HelpPage.module.css";
import { useNavigate } from "react-router-dom";

function AccordionItem({ number, title, content, isOpen, onToggle }) {
  return (
    <div className={styles.accordionItem}>
      <button
        onClick={onToggle}
        className={styles.accordionHeader}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${number}`}
      >
        <div className={styles.headerLeft}>
          <span className={styles.itemNumber}>{number}</span>
          <span className={styles.itemTitle}>{title}</span>
        </div>
        <div
          className={
            isOpen
              ? `${styles.iconWrapper} ${styles.open}`
              : styles.iconWrapper
          }
        >
          {isOpen ? (
            <ChevronDown className={styles.icon} />
          ) : (
            <ChevronRight className={styles.icon} />
          )}
        </div>
      </button>

      <div
        id={`accordion-content-${number}`}
        className={
          isOpen
            ? `${styles.accordionBody} ${styles.expanded}`
            : styles.accordionBody
        }
      >
        <div className={styles.accordionContent}>{content}</div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState(new Set([1]));

  function toggleItem(itemNo) {
    const next = new Set(openItems);
    next.has(itemNo) ? next.delete(itemNo) : next.add(itemNo);
    setOpenItems(next);
  }

  function handleBack() {
    navigate(-1);
  }

  // --- CONTENT BLOCKS ---
  const calibrationContent = (
    <ul className={styles.bulletList}>
      {[
        "Align your phone in pocket or strap",
        "Record distance using your hand",
        "Verify alerts by walking to your hand",
      ].map((text, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bullet} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  const startingAndStoppingContent = (
    <ul className={styles.bulletList}>
      {[
        "Press ‘Start’ to begin detection",
        "Move naturally to simulate real use",
        "Press ‘Stop’ when finished recording",
      ].map((text, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bullet} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  const interpretingAlertsContent = (
    <ul className={styles.bulletList}>
      {[
        "Red flash means possible fall detected",
        "Yellow flash = low battery warning",
        "Green flash = all systems normal",
      ].map((text, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bullet} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  const howToCalibrateContent = (
    <ul className={styles.bulletList}>
      {[
        "Open settings > Calibration",
        "Follow on‑screen guide step by step",
        "Tap ‘Save’ when calibration is done",
      ].map((text, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bullet} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  // --- RENDER ---
  return (
    <div className={styles.helpScreen}>
      <header className={styles.helpHeader}>
        <button
          onClick={handleBack}
          className={styles.backButton}
          aria-label="Go back"
        >
          <ChevronLeft className={styles.icon} />
        </button>
        <h1 className={styles.helpTitle}>HELP</h1>
        <div className={styles.spacer} />
      </header>

      <main className={styles.helpMain}>
        <div className={styles.accordionContainer}>
          {[1, 2, 3, 4].map((num) => (
            <AccordionItem
              key={num}
              number={num}
              title={
                num === 1
                  ? "How to calibrate device?"
                  : num === 2
                  ? "Starting & Stopping Detection"
                  : num === 3
                  ? "Interpreting Alerts"
                  : "How to calibrate device?"
              }
              content={
                num === 1
                  ? calibrationContent
                  : num === 2
                  ? startingAndStoppingContent
                  : num === 3
                  ? interpretingAlertsContent
                  : howToCalibrateContent
              }
              isOpen={openItems.has(num)}
              onToggle={() => toggleItem(num)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
