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
                gmail: "ravikumar@gmail.com",
                linkedin: "https://linkedin.com/in/ravikumar"
            }
        },
        {
            profileImg: profile,
            name: "SUBHASH RELANGI",
            role: "UI/UX Designer",
            socialMedia: {
                github: "https://github.com/SubhashRelangi",
                instagram: "https://instagram.com/_subhash_16",
                gmail: "subhashrelangi16@gmail.com",
                linkedin: "https://linkedin.com/in/priyasharma"
            }
        },
        {
            profileImg: profile,
            name: "NIKHIL KILARAPU",
            role: "Backend Developer",
            socialMedia: {
                github: "https://github.com/NIKHILKILARAPU",
                instagram: "https://instagram.com/k.nikhil_79",
                gmail: "nikhilkilarapu79@gmail.com",
                linkedin: "https://linkedin.com/in/amanverma"
            }
        },
        {
            profileImg: profile,
            name: "SANDEEP LANDA",
            role: "Data Analyst",
            socialMedia: {
                github: "https://github.com/sandeeplanda50",
                instagram: "https://instagram.com/sandeep_landa_18",
                gmail: "sandeeplanda50@gmail.com",
                linkedin: "https://linkedin.com/in/snehareddy"
            }
        },
        {
            profileImg: profile,
            name: "VPD VENKATA SAGAR",
            role: "Cloud Engineer",
            socialMedia: {
                github: "https://github.com/DivyaPrakeshVenkataSagar",
                instagram: "https://instagram.com/venkatasagar_09",
                gmail: "venkatasagar35@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "POOJITH GUDAVALLI",
            role: "DevOps Engineer",
            socialMedia: {
                github: "https://github.com/Rocky0794",
                instagram: "https://instagram.com/demon_king_07",
                gmail: "gudavallipujith@gmail.com",
                linkedin: "https://linkedin.com/in/vikramsingh"
            }
        },
        {
            profileImg: profile,
            name: "CH INDUMATHI",
            role: "Full Stack Developer",
            socialMedia: {
                instagram: "https://instagram.com/indusri48",
                gmail: "indumathichinnala@gmail.com",
                linkedin: "https://linkedin.com/in/meerajoshi"
            }
        },
        {
            profileImg: profile,
            name: "P JYOTHI",
            role: "AI Engineer",
            socialMedia: {
                instagram: "https://instagram.com/jyo__potti_99",
                gmail: "pathivadajyothi2008@gmail.com",
                linkedin: "https://linkedin.com/in/arjundas"
            }
        },
        {
            profileImg: profile,
            name: "SYAM SUNDAR RAO CHIPPADA",
            role: "Machine Learning Intern",
            socialMedia: {
                instagram: "https://instagram.com/prince_syam_1330",
                gmail: "syamsundarrao1330@gmail.com",
                linkedin: "https://linkedin.com/in/kavyaiyer"
            }
        },
        {
            profileImg: profile,
            name: "TEJASWARA RAO BAIRI",
            role: "Cybersecurity Analyst",
            socialMedia: {
                instagram: "https://instagram.com/urs_teja._.007",
                gmail: "bairiteja@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "M AKHILA",
            role: "Cloud Engineer",
            socialMedia: {
                github: "https://github.com/akhila10249",
                gmail: "mattaakhila99@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "N YAMINI SATYA",
            role: "Cloud Engineer",
            socialMedia: {
                gmail: "yaminisatya122007@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "P BHUVANESWARI",
            role: "Cloud Engineer",
            socialMedia: {
                gmail: "devibhuvaneswari@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "SEKHAR MUGADA",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sekhar.mugada_",
                gmail: "sekharpspk04@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "JAYA SIMHA SUNKARA",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sunkarajayasimha",
                gmail: "sunkarajayasimha@gmail.com",
            }
        },
        {
            profileImg: profile,
            name: "SASI KUMAR GRANDHI",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/sasikumar_2309",
                gmail: "g.aditya4123@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "NAVEEN PALUKURI",
            role: "Cloud Engineer",
            socialMedia: {
                instagram:"https://instagram.com/naveen__palukuri__",
                gmail: "palukurinaveen73@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "HARI KRISHNA MANGALARAPU",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/x_tox_i_hari_.100",
                gmail: "h.mangalarapu@gmail.com",
            
            }
        },
        {
            profileImg: profile,
            name: "JASWANTH POGIRI",
            role: "Cloud Engineer",
            socialMedia: {
                instagram:"https://instagram.com/mr_killer__111_",
                gmail: "pogirijaswanth@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "MOHAMMAD YONUS",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/_user_deleted_0025_",
                gmail: "mohammad.yonus.1910@gmail.com",
                linkedin: "https://linkedin.com/in/ananyarao"
            }
        },
        {
            profileImg: profile,
            name: "KISHAN",
            role: "Cloud Engineer",
            socialMedia: {
                instagram: "https://instagram.com/itz._wicky.__",
                gmail: "kishantejam@gmail.com",
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