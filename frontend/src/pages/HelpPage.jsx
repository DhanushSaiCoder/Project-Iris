import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import styles from "./HelpPage.module.css";
import { useNavigate } from "react-router-dom";

const faqData = [
    {
        id: 1,
        title: "How to calibrate device?",
        content: [
            "Align your phone in pocket or strap",
            "Record distance using your hand",
            "Verify alerts by walking to your hand",
        ],
    },
    {
        id: 2,
        title: "Starting & Stopping Detection",
        content: [
            "Press ‘Start’ to begin detection",
            "Move naturally to simulate real use",
            "Press ‘Stop’ when finished recording",
        ],
    },
    {
        id: 3,
        title: "Interpreting Alerts",
        content: [
            "Red flash means possible fall detected",
            "Yellow flash = low battery warning",
            "Green flash = all systems normal",
        ],
    },
    {
        id: 4,
        title: "How to re-calibrate device?",
        content: [
            "Open settings > Calibration",
            "Follow on‑screen guide step by step",
            "Tap ‘Save’ when calibration is done",
        ],
    },
];

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
                <div className={styles.accordionContent}>
                    <ul className={styles.bulletList}>
                        {content.map((text, i) => (
                            <li key={i} className={styles.bulletItem}>
                                <span className={styles.bullet} />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
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

    return (
        <div className={styles.helpScreen}>
            <header className={styles.helpHeader}>
                <button
                    onClick={handleBack}
                    className={styles.backButton}
                    aria-label="Go back"
                >
                    <ChevronLeft className={styles.icon} />
                    <span className={styles.backText}>Back</span>
                </button>
                <h1 className={styles.helpTitle}>HELP</h1>
                <div className={styles.spacer} />
            </header>

            <main className={styles.helpMain}>
                <div className={styles.accordionContainer}>
                    {faqData.map((item) => (
                        <AccordionItem
                            key={item.id}
                            number={item.id}
                            title={item.title}
                            content={item.content}
                            isOpen={openItems.has(item.id)}
                            onToggle={() => toggleItem(item.id)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}