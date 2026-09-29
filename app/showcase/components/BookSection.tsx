'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BookSection() {
    return (
        <section className="book-section" id="booklet">
            <div className="book-container">
                {/* Section Header */}
                <div className="project-header book-header">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 1 },
                            visible: {
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                        className="section-title"
                    >
                        {Array.from("PORTFOLIO BOOKLET").map((char, index) => (
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

                    <Link href="/booklet" className="view-all-link">
                        Open Flipbook <span className="arrow">→</span>
                    </Link>
                </div>

                {/* Main Showcase Card */}
                <motion.div
                    className="book-showcase-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Left Info Column */}
                    <motion.div
                        className="book-info"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                            }
                        }}
                    >
                        <motion.div
                            className="book-overline"
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            <span>PRINT &amp; DIGITAL ARCHIVE</span>
                            <span className="book-overline-sep">/</span>
                            <span>15 SPREADS</span>
                        </motion.div>

                        <motion.h3
                            className="book-headline"
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Turn the Pages of My Journey &amp; Works
                        </motion.h3>

                        <motion.p
                            className="book-description"
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            A curated physical-to-digital publication documenting design systems, software engineering, and academic leadership — bound in a realistic 3D format with authentic page-flip acoustics.
                        </motion.p>

                        {/* Editorial Chapters / Table of Contents */}
                        <motion.div
                            className="book-contents-table"
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            <div className="book-toc-header">
                                <span>CHAPTERS &amp; SPREADS</span>
                                <span>INDEX</span>
                            </div>
                            <div className="book-toc-list">
                                <motion.div className="book-toc-item" variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}>
                                    <span className="toc-number">01</span>
                                    <div className="toc-text">
                                        <div className="toc-title">Introduction &amp; Philosophy</div>
                                        <div className="toc-sub">Design methodology &amp; background</div>
                                    </div>
                                    <span className="toc-pages">P. 01–03</span>
                                </motion.div>

                                <motion.div className="book-toc-item" variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}>
                                    <span className="toc-number">02</span>
                                    <div className="toc-text">
                                        <div className="toc-title">Selected Works &amp; Case Studies</div>
                                        <div className="toc-sub">Web apps, AI tools &amp; engineering</div>
                                    </div>
                                    <span className="toc-pages">P. 04–10</span>
                                </motion.div>

                                <motion.div className="book-toc-item" variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}>
                                    <span className="toc-number">03</span>
                                    <div className="toc-text">
                                        <div className="toc-title">Leadership, Labs &amp; Milestones</div>
                                        <div className="toc-sub">Academic journey &amp; certifications</div>
                                    </div>
                                    <span className="toc-pages">P. 11–15</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            className="book-actions"
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            <Link href="/booklet" className="book-primary-btn">
                                <span>Read Interactive Book</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </Link>

                            <div className="book-audio-note">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                </svg>
                                <span>Includes page-turn audio</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual 3D Preview Column (Hover only, no link) */}
                    <div className="book-visual-link">
                        <motion.div
                            className="book-mockup-wrapper"
                            whileHover="hover"
                            initial="initial"
                        >
                            {/* Ambient lighting behind book */}
                            <div className="book-ambient-glow" />

                            {/* Stacked Preview Page 3 */}
                            <motion.div
                                className="book-page-layer book-layer-3"
                                variants={{
                                    initial: { rotate: 8, x: 22, y: 10, scale: 0.94 },
                                    hover: { rotate: 14, x: 45, y: 15, scale: 0.96 }
                                }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Image
                                    src="/booklet/images/3.png"
                                    alt="Booklet spread 3"
                                    fill
                                    sizes="(max-width: 768px) 260px, 340px"
                                    className="book-image"
                                />
                            </motion.div>

                            {/* Stacked Preview Page 2 */}
                            <motion.div
                                className="book-page-layer book-layer-2"
                                variants={{
                                    initial: { rotate: 4, x: 10, y: 5, scale: 0.97 },
                                    hover: { rotate: 7, x: 22, y: 8, scale: 0.99 }
                                }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Image
                                    src="/booklet/images/2.png"
                                    alt="Booklet spread 2"
                                    fill
                                    sizes="(max-width: 768px) 260px, 340px"
                                    className="book-image"
                                />
                            </motion.div>

                            {/* Main Cover */}
                            <motion.div
                                className="book-page-layer book-layer-cover"
                                variants={{
                                    initial: { rotate: 0, x: 0, y: 0, scale: 1 },
                                    hover: { rotate: -2, x: -6, y: -8, scale: 1.03 }
                                }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Image
                                    src="/booklet/images/1.png"
                                    alt="Booklet Cover"
                                    fill
                                    sizes="(max-width: 768px) 280px, 380px"
                                    className="book-image"
                                    priority
                                />
                                <div className="book-cover-spine"></div>
                                <div className="book-cover-sheen"></div>
                                <div className="book-edge-pages"></div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
