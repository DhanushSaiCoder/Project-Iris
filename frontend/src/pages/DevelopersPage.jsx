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
import DhanushProfile from "../Images/DhanushProfile.jpg"

const DevelopersPage = () => {

    const DevelopersDetails = [
        {
            profileImg: DhanushProfile,
            name: "Dhanush Sai Nayak.V",
            role: "Lead Developer",
            socialMedia: {
                github: "https://github.com/DhanushSaiCoder",
                instagram: "https://www.instagram.com/dhanush.saii/",
                gmail: "dhanushsai.work@gmail.com",
                linkedin: "https:https://www.linkedin.com/in/dhanush-sai-1517a8273/"
            }
        },
        {
            profileImg: profile,
            name: "Subhash Relangi",
            role: "UI/UX Designer",
            socialMedia: {
                github: "https://github.com/SubhashRelangi",
                instagram: "https://instagram.com/_subhash_16",
                gmail: "subhashrelangi16@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Nikhil Kilarapu",
            role: "Backend Developer",
            socialMedia: {
                github: "https://github.com/NIKHILKILARAPU",
                instagram: "https://instagram.com/k.nikhil_79",
                gmail: "nikhilkilarapu79@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Sandeep Landa",
            role: "Data Analyst",
            socialMedia: {
                github: "https://github.com/sandeeplanda50",
                instagram: "https://instagram.com/sandeep_landa_18",
                gmail: "sandeeplanda50@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Vpd Venkata Sagar",
            role: "Cloud Engineer",
            socialMedia: {
                github: "https://github.com/DivyaPrakeshVenkataSagar",
                instagram: "https://instagram.com/venkatasagar_09",
                gmail: "venkatasagar35@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Poojith Gudavalli",
            role: "DevOps Engineer",
            socialMedia: {
                github: "https://github.com/Rocky0794",
                instagram: "https://instagram.com/demon_king_07",
                gmail: "gudavallipujith@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Ch Indumathi",
            role: "Full Stack Developer",
            socialMedia: {
                instagram: "https://instagram.com/indusri48",
                gmail: "indumathichinnala@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "P Jyothi",
            role: "AI Engineer",
            socialMedia: {
                instagram: "https://instagram.com/jyo__potti_99",
                gmail: "pathivadajyothi2008@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Syam Sundar Rao Chippada",
            role: "Machine Learning Intern",
            socialMedia: {
                instagram: "https://instagram.com/prince_syam_1330",
                gmail: "syamsundarrao1330@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Tejaswara Rao Bairi",
            role: "Cybersecurity Analyst",
            socialMedia: {
                instagram: "https://instagram.com/urs_teja._.007",
                gmail: "bairiteja@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "M Akhila",
            role: "Cloud Engineer",
            socialMedia: {
                github: "https://github.com/akhila10249",
                gmail: "mattaakhila99@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "N Yamini Satya",
            role: "Cloud Engineer",
            socialMedia: {
                gmail: "yaminisatya122007@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "P Bhuvaneswari",
            role: "Cloud Engineer",
            socialMedia: {
                gmail: "devibhuvaneswari@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Sekhar Mugada",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sekhar.mugada_",
                gmail: "sekharpspk04@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Jaya Simha Sunkara",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sunkarajayasimha",
                gmail: "sunkarajayasimha@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Sasi Kumar Grandhi",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sasikumar_2309",
                gmail: "g.aditya4123@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Naveen Palukuri",
            role: "Cloud Engineer",
            socialMedia: {
                instagram:"https://instagram.com/naveen__palukuri__",
                gmail: "palukurinaveen73@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Hari Krishna Mangalarapu",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/x_tox_i_hari_.100",
                gmail: "h.mangalarapu@gmail.com",
            
            }
        },
        {
            profileImg: profile,
            name: "Jaswanth Pogiri",
            role: "Cloud Engineer",
            socialMedia: {
                instagram:"https://instagram.com/mr_killer__111_",
                gmail: "pogirijaswanth@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Mohammad Yonus",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/_user_deleted_0025_",
                gmail: "mohammad.yonus.1910@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "Kishan",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/itz._wicky.__",
                gmail: "kishantejam@gmail.com",
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
                                    alt={`${developer.name}'s profile`}
                                    className={styles.profileImage}
                                />
                            </div>
                            <div className={styles.DetailsDiv}>
                                <h2 className={styles.developerName}>{developer.name}</h2>
                                <p className={styles.developerRole}>{developer.role}</p>
                                <div className={styles.socialLinks}>
                                    {developer.socialMedia.github && (
                                        <a href={developer.socialMedia.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                            <Github size={20} className={styles.SocialIcons} />
                                        </a>
                                    )}
                                    {developer.socialMedia.instagram && (
                                        <a href={developer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                            <Instagram size={20} className={styles.SocialIcons} />
                                        </a>
                                    )}
                                    {developer.socialMedia.gmail && (
                                        <a href={`mailto:${developer.socialMedia.gmail}`} aria-label="Gmail">
                                            <Mail size={20} className={styles.SocialIcons} />
                                        </a>
                                    )}
                                    {developer.socialMedia.linkedin && (
                                        <a href={developer.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <Linkedin size={20} className={styles.SocialIcons} />
                                        </a>
                                    )}
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