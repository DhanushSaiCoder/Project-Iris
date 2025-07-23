import React from 'react';
import {
    ChevronLeft,
    Github,
    Instagram,
    Mail,
    Linkedin
} from 'lucide-react';
import styles from './DevelopersPage.module.css';
import profile from '../Images/profile.png';

const DevelopersPage = () => {

    const DevelopersDetails = [
        {
            profileImg: profile,
            name: "Ravi Kumar",
            role: "Frontend Developer",
            socialMedia: {
                github: "https://github.com/ravikumar",
                instagram: "https://instagram.com/ravi.codes",
                gmail: "ravikumar@gmail.com",
                linkedin: "https://linkedin.com/in/ravikumar"
            }
        },
        {
            profileImg: profile,
            name: "Priya Sharma",
            role: "UI/UX Designer",
            socialMedia: {
                github: "https://github.com/priyadesigns",
                instagram: "https://instagram.com/priya.ui",
                gmail: "priyasharma@gmail.com",
                linkedin: "https://linkedin.com/in/priyasharma"
            }
        },
        {
            profileImg: profile,
            name: "Aman Verma",
            role: "Backend Developer",
            socialMedia: {
                github: "https://github.com/amanverma",
                instagram: "https://instagram.com/aman.codes",
                gmail: "amanverma@gmail.com",
                linkedin: "https://linkedin.com/in/amanverma"
            }
        },
        {
            profileImg: profile,
            name: "Sneha Reddy",
            role: "Data Analyst",
            socialMedia: {
                github: "https://github.com/snehareddy",
                instagram: "https://instagram.com/sneha.analytics",
                gmail: "snehareddy@gmail.com",
                linkedin: "https://linkedin.com/in/snehareddy"
            }
        },
        {
            profileImg: profile,
            name: "Vikram Singh",
            role: "DevOps Engineer",
            socialMedia: {
                github: "https://github.com/vikramsingh",
                instagram: "https://instagram.com/vikram.devops",
                gmail: "vikramsingh@gmail.com",
                linkedin: "https://linkedin.com/in/vikramsingh"
            }
        },
        {
            profileImg: profile,
            name: "Meera Joshi",
            role: "Full Stack Developer",
            socialMedia: {
                github: "https://github.com/meerajoshi",
                instagram: "https://instagram.com/meera.codes",
                gmail: "meerajoshi@gmail.com",
                linkedin: "https://linkedin.com/in/meerajoshi"
            }
        },
        {
            profileImg: profile,
            name: "Arjun Das",
            role: "AI Engineer",
            socialMedia: {
                github: "https://github.com/arjundas",
                instagram: "https://instagram.com/arjun.ai",
                gmail: "arjundas@gmail.com",
                linkedin: "https://linkedin.com/in/arjundas"
            }
        },
        {
            profileImg: profile,
            name: "Kavya Iyer",
            role: "Machine Learning Intern",
            socialMedia: {
                github: "https://github.com/kavyaai",
                instagram: "https://instagram.com/kavya.ml",
                gmail: "kavyaiyer@gmail.com",
                linkedin: "https://linkedin.com/in/kavyaiyer"
            }
        },
        {
            profileImg: profile,
            name: "Rahul Mehta",
            role: "Cybersecurity Analyst",
            socialMedia: {
                github: "https://github.com/rahulmehta",
                instagram: "https://instagram.com/rahul.cyber",
                gmail: "rahulmehta@gmail.com",
                linkedin: "https://linkedin.com/in/rahulmehta"
            }
        },
        {
            profileImg: profile,
            name: "Ananya Rao",
            role: "Cloud Engineer",
            socialMedia: {
                github: "https://github.com/ananyarao",
                instagram: "https://instagram.com/ananya.cloud",
                gmail: "ananyarao@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        }
    ];

    function handleBack() {
        window.history.back();
    }

    return (
        <div className={styles.DeveloperScreen}>
            <header className={styles.DevelopersHeader}>
                <button
                    onClick={handleBack}
                    className={styles.backButton}
                    aria-label="Go back"
                >
                    <ChevronLeft className={styles.icon} />
                    <span className={styles.backText}>Back</span>
                </button>
                <h1 className={styles.privacyTitle}>DEVELOPERS</h1>
                <div className={styles.spacer} />
            </header>

            <main className={styles.privacyMain}>
                <div className={styles.developersGrid}>
                    {DevelopersDetails.map((developer, index) => (
                        <div key={index} className={styles.developerCard}>
                            <div className={styles.ImgDiv}>
                                <img
                                    src={developer.profileImg}
                                    alt={developer.name}
                                    className={styles.profileImage}
                                />
                            </div>
                            <div className={styles.DetailsDiv}>
                                <h2 className={styles.developerName}>{developer.name}</h2>
                                <p className={styles.developerRole}>{developer.role}</p>
                                <div className={styles.socialLinks}>
                                    <a href={developer.socialMedia.github} target="_blank" rel="noopener noreferrer" className={styles.IconsDiv}>
                                        <Github size={18} className={styles.SocialIcons} />
                                    </a>
                                    <a href={developer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className={styles.IconsDiv}>
                                        <Instagram size={18} className={styles.SocialIcons} />
                                    </a>
                                    <a href={`mailto:${developer.socialMedia.gmail}`} className={styles.IconsDiv}>
                                        <Mail size={18} className={styles.SocialIcons} />
                                    </a>
                                    <a href={developer.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className={styles.IconsDiv}>
                                        <Linkedin size={18} className={styles.SocialIcons} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DevelopersPage;
