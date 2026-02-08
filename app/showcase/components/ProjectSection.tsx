'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projects = [
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
        category: 'AI & Chatbot',
        description: 'RAG-powered chatbot providing information sourced from a knowledge base of herbal plant journals.',
        image: '/showcase/project/sumberherbal.webp',
        link: 'https://sumberherbal.vercel.app'
    },
    {
        id: 'NihonGo!',
        title: 'NihonGo!',
        category: 'Text-to-Speech',
        description: 'Is a game-style Japanese learning platform with fun chapters full of vocabulary and interactive exercises. Guided by an interactive waifu',
        image: '/showcase/project/nihongoo.webp',
        link: 'https://nihongoo.vercel.app'
    }
];

export default function ProjectSection() {
    const [activeId, setActiveId] = useState<string | null>('nadella');
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
                        {Array.from("SELECTED WORKS").map((char, index) => (
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
                    <a href="/projek" className="view-all-link">
                        View All Projects <span className="arrow">→</span>
                    </a>
                </div>

                <div className="project-gallery">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            className={`project-card ${activeId === project.id ? 'active' : ''}`}
                            onClick={() => setActiveId(project.id)}
                            onHoverStart={() => setActiveId(project.id)}
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
                                        <span className="project-number">{project.id === 'nadella' ? '01' : project.id === 'si-mbah' ? '02' : '03'}</span>
                                        <h3 className="project-title">{project.title}</h3>
                                        {activeId === project.id && <span className="project-category badge">{project.category}</span>}
                                    </div>
                                    <a href={project.link} className="project-link desktop-only" target="_blank" rel="noopener noreferrer">
                                        Visit Site
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </a>
                                </div>
                                <AnimatePresence>
                                    {activeId === project.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="project-details"
                                        >
                                            <p className="project-desc">{project.description}</p>
                                            <a href={project.link} className="project-link mobile-only" target="_blank" rel="noopener noreferrer">
                                                Visit Site
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                                    <polyline points="7 7 17 7 17 17"></polyline>
                                                </svg>
                                            </a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    );
}
