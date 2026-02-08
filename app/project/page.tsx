'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ScrollToTop from '../showcase/components/ScrollToTop';
import './project.css';

const projectCategories = [
    {
        title: "Professional Work",
        projects: [
            {
                id: "project-1",
                title: "Nadella-Tech",
                category: "Company Profile",
                description: "Official company profile website developed during a professional internship.",
                tech: ["UI/UX", "HTML", "CSS", "JavaScript"],
                image: "/showcase/project/nadella-tech.webp",
                link: "https://nadella-tech.vercel.app"
            },
            {
                id: "project-2",
                title: "Si-Mbah",
                category: "AI & Chatbot",
                description: "RAG-powered chatbot providing information sourced from a curated knowledge base of Indonesian herbal plant journals.",
                tech: ["Mistral", "Next.js", "Supabase"],
                image: "/showcase/project/si-mbah.webp",
                link: "https://si-mbah.vercel.app"
            },
            {
                id: "project-3",
                title: "ICT Lab Community",
                category: "Community Platform",
                description: "Community-based website for an academic laboratory, showcasing member profiles, achievements, and organizational activities.",
                tech: ["UI/UX", "HTML", "CSS", "JavaScript"],
                image: "/showcase/project/ict.webp",
                link: "https://ictlab-itenas.github.io/"
            },
            {
                id: "project-4",
                title: "GEOS",
                category: "Government Website",
                description: "Geospatial web platform for Indonesian regional data visualization, developed for a government institution.",
                tech: ["PHP", "Amazon S3", "Security"],
                image: "/showcase/project/placeholder.png",
                link: "#"
            }
        ]
    },
    {
        title: "Research Projects",
        projects: [
            {
                id: "sumber-herbal",
                title: "Sumber Herbal",
                category: "Thesis Research",
                description: "Undergraduate thesis project applying Graph-based Retrieval-Augmented Generation to improve herbal information retrieval from academic journals.",
                tech: ["Mistral", "RAG", "Vector DB"],
                image: "/showcase/project/sumberherbal.webp",
                link: "https://sumberherbal.vercel.app"
            },
            {
                id: "cheator",
                title: "Cheator",
                category: "National Research Program",
                description: "AI-based cheating detection system designed to identify academic dishonesty in both online and offline examinations using computer vision techniques.",
                tech: ["AI", "Machine Learning", "MediaPipe"],
                image: "/showcase/project/cheator.webp",
                link: "https://cheator.seya.zip/"
            },
            {
                id: "filter-judol",
                title: "Filter Judol",
                category: "Security Research",
                description: "Cybersecurity research project utilizing machine learning to detect and filter online gambling content.",
                tech: ["Cybersecurity", "Machine Learning"],
                image: "/showcase/project/filterjudol.webp",
                link: "https://filterjudol.netlify.app/"
            },
            {
                id: "handspeak",
                title: "HandSpeak",
                category: "AI Research",
                description: "Sign language recognition system based on computer vision and hand landmark detection to support accessibility.",
                tech: ["Machine Learning", "Python", "MediaPipe"],
                image: "/showcase/project/handspeak.webp",
                link: "#"
            },
            {
                id: "i-speaks",
                title: "i-Speaks",
                category: "Language Assessment Research",
                description: "Research project on automated English proficiency assessment using speech recordings to classify CEFR levels from A2 to C2.",
                tech: ["Machine Learning", "Whisper", "Speech Recognition"],
                image: "/showcase/project/i-speaks.webp",
                link: "https://i-speaks.vercel.app/"
            },
            {
                id: "biospire",
                title: "Biospire",
                category: "Hackathon Project",
                description: "Knowledge retrieval system developed for a NASA hackathon, aggregating dispersed NASA research publications into a unified knowledge base enhanced with Retrieval-Augmented Generation.",
                tech: ["RAG", "Knowledge Base", "Next.js", "Supabase"],
                image: "/showcase/project/biospire.webp",
                link: "https://biospire.vercel.app/"
            }
        ]
    },
    {
        title: "Academic Projects",
        projects: [
            {
                id: "nihongo",
                title: "NihonGo!",
                category: "Language Learning",
                description: "Japanese language learning platform combining interactive characters, voice synthesis, and natural language processing to create an immersive learning experience.",
                tech: ["JavaScript", "Live2D", "VoiceVox", "TTS", "NLP"],
                image: "/showcase/project/nihongoo.webp",
                link: "https://nihongoo.vercel.app"
            },
            {
                id: "handventure",
                title: "Handventure",
                category: "Computer Vision",
                description: "Sign language recognition system developed from an earlier hand gesture detection project, expanded with multiple machine learning and deep learning based mini-games.",
                tech: ["Comvis", "DL", "Machine Learning"],
                image: "/showcase/project/handventure.webp",
                link: "https://handventure.vercel.app/"
            },
            {
                id: "tajweedo",
                title: "Tajweedo",
                category: "Education App",
                description: "Gamified Tajweed learning platform inspired by Duolingo, featuring structured lessons, daily challenges, ranking systems, and interactive feedback to enhance engagement.",
                tech: ["Next.js", "Supabase", "Gamification"],
                image: "/showcase/project/tajweedo.webp",
                link: "http://tajweedo.vercel.app/"
            },
            {
                id: "energy-ai",
                title: "Energy AI",
                category: "Analysis Tool",
                description: "AI-based system for monitoring and analyzing energy consumption patterns, aimed at supporting optimization and efficiency in energy usage.",
                tech: ["Data Analysis", "Machine Learning", "IoT"],
                image: "/showcase/project/energy-ai.webp",
                link: "https://energyaipro.netlify.app/"
            },
            {
                id: "ifrit",
                title: "IFRIT",
                category: "Detection System",
                description: "High-performance detection system designed for real-time anomaly identification in secure environments.",
                tech: ["Real-time Systems", "System Security"],
                image: "/showcase/project/ifrit.webp",
                link: "#"
            },
            {
                id: "hurufia",
                title: "Hurufia",
                category: "Learning App",
                description: "Early-stage Tajweed learning platform integrating a chatbot to assist Quranic pronunciation and reading comprehension.",
                tech: ["Mistral", "HTML", "CSS", "JavaScript"],
                image: "/showcase/project/hurufia.webp",
                link: "https://hurufia.netlify.app/"
            },
            {
                id: "tulips",
                title: "Tulips",
                category: "Creative AI",
                description: "Face-based skin tone detection system that recommends personalized lipstick colors using real-time camera input and augmented reality filters.",
                tech: ["Machine Learning", "Augmented Reality", "Computer Vision"],
                image: "/showcase/project/tulips.webp",
                link: "https://tu-lips.vercel.app/"
            }
        ]
    }
];

export default function ProjectPage() {
    const [blockedId, setBlockedId] = useState<string | null>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouseX.set(clientX);
            mouseY.set(clientY);

            document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const titleText = "ALL PROJECTS";

    return (
        <main className="project-page">
            <motion.div
                className="scroll-progress-bar"
                style={{ scaleX }}
            />
            <div className="grain-overlay" />
            <div className="blur-blob blob-1" />
            <div className="blur-blob blob-2" />

            <div className="project-page-header">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link href="/showcase" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Showcase
                    </Link>
                </motion.div>

                <motion.h1
                    className="page-title"
                    initial="hidden"
                    animate="visible"
                >
                    {titleText.split("").map((char, i) => (
                        <motion.span
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: i * 0.05
                                    }
                                }
                            }}
                            style={{ display: 'inline-block' }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h1>
                <motion.p
                    className="page-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    A comprehensive showcase of my professional experience, research initiatives, and academic explorations.
                </motion.p>
            </div>

            {projectCategories.map((cat, catIndex) => (
                <section key={cat.title} className="category-section">
                    <motion.h2
                        className="category-title"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {cat.title}
                    </motion.h2>

                    <div className="projects-grid">
                        {cat.projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="project-item"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.25, 1, 0.5, 1],
                                    delay: Math.min(index * 0.1, 0.3)
                                }}
                            >
                                <span className="project-item-number">{String(index + 1).padStart(2, '0')}</span>

                                <div className="project-item-img-container">
                                    <img src={project.image} alt={project.title} className="project-item-img" />
                                </div>

                                <div className="project-item-info">
                                    <div className="project-info-top">
                                        <span className="project-item-category">{project.category}</span>
                                        <h2 className="project-item-title">{project.title}</h2>
                                        <p className="project-item-desc">{project.description}</p>

                                        <div className="project-tech-stack">
                                            {project.tech?.map(t => (
                                                <span key={t} className="tech-tag">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="project-info-bottom">
                                        <Link
                                            href={project.link}
                                            onClick={(e) => {
                                                if (project.link === '#') {
                                                    e.preventDefault();
                                                    setBlockedId(project.id);
                                                    setTimeout(() => setBlockedId(null), 3000);
                                                }
                                            }}
                                            target={project.link === '#' ? undefined : "_blank"}
                                            rel={project.link === '#' ? undefined : "noopener noreferrer"}
                                            className="visit-btn"
                                        >
                                            View Project
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}

            <AnimatePresence>
                {blockedId && (
                    <motion.div
                        className="project-msg-wrapper"
                        initial={{ opacity: 0, x: -20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="project-msg">
                            {blockedId === 'project-4'
                                ? "Sorry, this website is private"
                                : "Sorry, the website is not available"}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.footer
                className="project-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <p className="footer-cta">Let's build something together.</p>
                <p className="footer-copyright">&copy; {new Date().getFullYear()} — Made with focus and creativity.</p>
            </motion.footer>
            <ScrollToTop />
        </main>
    );
}
