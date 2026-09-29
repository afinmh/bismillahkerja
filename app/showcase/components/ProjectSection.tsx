'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projects = [
    {
        id: 'ispeak-2',
        title: 'ISPEAK2',
        category: 'Language Assessment Platform',
        description: 'Automated English proficiency assessment platform using speech recordings to classify CEFR levels from A2 to C2.',
        image: '/showcase/project/ispeak2.webp',
        link: 'https://ispeak.my.id'
    },
    {
        id: 'nadella',
        title: 'Nadella-Tech',
        category: 'Professional Work',
        description: 'Official company profile website developed for Nadella-Tech during a professional internship.',
        image: '/showcase/project/nadella-tech.webp',
        link: 'https://nadella-tech.vercel.app'
    },
    {
        id: 'Sumber Herbal',
        title: 'Sumber Herbal',
        category: 'Research Project',
        description: 'RAG-powered chatbot providing information sourced from a knowledge base of herbal plant journals.',
        image: '/showcase/project/sumberherbal.webp',
        link: 'https://sumberherbal.vercel.app'
    },
    {
        id: 'NihonGo!',
        title: 'NihonGo!',
        category: 'Academic Project',
        description: 'Is a game-style Japanese learning platform with fun chapters full of vocabulary and interactive exercises, with virtual waifu',
        image: '/showcase/project/nihongoo.webp',
        link: 'https://nihongoo.vercel.app'
    }
];

export default function ProjectSection() {
    const [activeId, setActiveId] = useState<string | null>('ispeak-2');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveId(current => {
                const currentIndex = projects.findIndex(p => p.id === current);
                const nextIndex = (currentIndex + 1) % projects.length;
                return projects[nextIndex].id;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <section className="project-section">
            <div
                className="project-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="project-header">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 1 },
                            visible: {
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="section-title"
                    >
                        {Array.from("FEATURED PROJECTS").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h2>
                    <a href="/project" className="view-all-link">
                        View All Projects <span className="arrow">→</span>
                    </a>
                </div>

                <div className="project-gallery">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className={`project-card ${activeId === project.id ? 'active' : ''}`}
                            onClick={() => setActiveId(project.id)}
                            onMouseEnter={() => setActiveId(project.id)}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <motion.div
                                className="project-bg"
                                animate={{
                                    scale: activeId === project.id ? 1.05 : 1,
                                    filter: activeId === project.id ? 'grayscale(0%)' : 'grayscale(100%)'
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <img src={project.image} alt={project.title} />
                                <div className="overlay" />
                            </motion.div>

                            <div className="project-info">
                                <div className="project-top-row">
                                    <div className="project-title-wrapper">
                                        <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                                        <h3 className="project-title horizontal">{project.title}</h3>
                                        <h3 className="project-title vertical">{project.title}</h3>
                                    </div>
                                    <a href={project.link} className="project-link desktop-only" target="_blank" rel="noopener noreferrer">
                                        Visit Site
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </a>
                                </div>
                                <div className="project-details">
                                    <p className="project-desc">{project.description}</p>
                                    <a href={project.link} className="project-link mobile-only" target="_blank" rel="noopener noreferrer">
                                        Visit Site
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    );
}
