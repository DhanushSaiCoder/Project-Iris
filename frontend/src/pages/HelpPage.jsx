import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import styles from "./HelpPage.module.css";
import { useNavigate } from "react-router-dom";

const faqData = [
    {
        id: 1,
        title: "What is Project Iris?",
        content: [
            "Project Iris is a web-based smart assistant designed for the visually impaired.",
            "It provides real-time environmental awareness through advanced object and depth detection.",
            "It uses audio and haptic feedback to alert users to nearby objects and their distances."
        ],
    },
    {
        id: 2,
        title: "How to calibrate device?",
        content: [
            "Calibration is crucial for accurate depth estimation.",
            "Align your phone securely in a pocket or strap, ensuring the camera has a clear view.",
            "Record a reference distance using your hand or a known object.",
            "Verify the calibration by walking towards your hand/object and observing the alerts."
        ],
    },
    {
        id: 3,
        title: "Starting & Stopping Detection",
        content: [
            "Press ‘Start’ to begin real-time object and depth detection.",
            "Move naturally to simulate real-world use and allow the system to analyze your surroundings.",
            "Press ‘Stop’ when you wish to end the detection session and review your activity."
        ],
    },
    {
        id: 4,
        title: "Interpreting Alerts (Audio & Haptic)",
        content: [
            "Project Iris provides both audio cues and haptic (vibration) feedback.",
            "Audio alerts vary in pitch and frequency based on object proximity and type.",
            "Haptic feedback intensity increases as you approach an object.",
            "A red flash (visual) indicates a possible fall detection.",
            "A yellow flash (visual) signals a low battery warning.",
            "A green flash (visual) confirms all systems are operating normally."
        ],
    },
    {
        id: 5,
        title: "How to re-calibrate device?",
        content: [
            "You may need to re-calibrate if you change your phone's position, or if you notice inaccuracies in distance alerts.",
            "Navigate to Settings > Calibration within the application.",
            "Follow the on-screen guide step-by-step to ensure precise re-calibration.",
            "Tap ‘Save’ once the re-calibration process is complete to apply the new settings."
        ],
    },
    {
        id: 6,
        title: "Customizing Alert Settings",
        content: [
            "Project Iris allows you to personalize your alert experience.",
            "Adjust the alert distance to define how close objects need to be before you receive notifications.",
            "Customize feedback types, choosing between audio, haptic, or a combination of both, based on your preference.",
            "Access these options in the application's Settings menu."
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