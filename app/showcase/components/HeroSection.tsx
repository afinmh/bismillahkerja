'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
    isVisible: boolean;
}

// Animation variants for staggered text reveal with enhanced effects
const wordVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
        scale: 0.9
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        transition: {
            delay: i * 0.06,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as const
        }
    })
};

const textRevealVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut" as const
        }
    }
};

// Enhanced education text animations
const educationTitleVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        filter: "blur(10px)",
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as const
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
        scale: 1.05,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 1, 1] as const
        }
    }
};

const educationSubtitleVariants = {
    hidden: {
        opacity: 0,
        y: -15,
        filter: "blur(8px)"
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.7,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1] as const
        }
    },
    exit: {
        opacity: 0,
        y: 15,
        filter: "blur(6px)",
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 1, 1] as const
        }
    }
};

type Face = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

interface FaceContent {
    title: string;
    subtitle: string;
    description: string;
}

const faceContentMap: Record<Face, FaceContent> = {
    front: {
        title: "Informatics Student",
        subtitle: "at Institut Teknologi Nasional Bandung",
        description: "I am an Informatics student with a strong interest in Machine Learning, Artificial Intelligence, Data Science, and Web Development."
    },
    back: {
        title: "Manchester United",
        subtitle: "Part of the 3/4 Man in the World",
        description: "Glory, Glory Man United! Glory, Glory Man United! Glory, Glory Man United! As the Reds go marching on, on, on!"
    },
    right: {
        title: "Reading Comics",
        subtitle: "In My Free Time",
        description: "I enjoy reading comics, particularly Murim and mythology themed stories. Among the many comics I have read, Legend of the Northern Blade stands out as one of my favorites"
    },
    left: {
        title: "Artificial Intelligence",
        subtitle: "Personal Interest",
        description: "Artificial Intelligence is the field I am most passionate about, including ML, DL, and LLM.I aim not only to use AI, but also to build it for real-world impact."
    },
    top: {
        title: "ICT Laboratory",
        subtitle: "Research Experience",
        description: "I contribute as a researcher in the ICT Laboratory, focusing on artificial intelligence, computer vision, and data-driven solutions for real problems."
    },
    bottom: {
        title: "Graduate Studies Abroad",
        subtitle: "Next Chapter",
        description: "I plan to continue my studies abroad, especially in Europe, to pursue a master's degree and deepen my expertise in computer science and artificial intelligence."
    }
};


const faceToRotation = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
    right: { x: 0, y: -90 },
    left: { x: 0, y: 90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 },
};

export default function HeroSection({ isVisible }: HeroSectionProps) {
    const cubeRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(15);
    const [rotateY, setRotateY] = useState(25);
    const [isDragging, setIsDragging] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const prevPos = useRef({ x: 0, y: 0 });

    const [currentFace, setCurrentFace] = useState<Face>('front');
    // Content state
    const [displayedContent, setDisplayedContent] = useState<FaceContent>(faceContentMap.front);
    const [isContentChanging, setIsContentChanging] = useState(false);

    const description = displayedContent.description;
    const words = description.split(' ');

    // Smooth rotation with requestAnimationFrame
    const requestRef = useRef<number>(0);

    const animateRotation = () => {
        if (autoRotate && !isDragging) {
            setRotateY(prev => prev + 0.2);
            setRotateX(prev => prev + 0.1);
        }
        requestRef.current = requestAnimationFrame(animateRotation);
    };

    useEffect(() => {
        if (!isVisible) return;
        requestRef.current = requestAnimationFrame(animateRotation);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [autoRotate, isDragging, isVisible]);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true);
            setAutoRotate(false);
            prevPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setAutoRotate(true);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - prevPos.current.x;
            const deltaY = e.clientY - prevPos.current.y;

            setRotateY(prev => prev + deltaX * 0.5);
            setRotateX(prev => prev - deltaY * 0.5);

            prevPos.current = { x: e.clientX, y: e.clientY };
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, isVisible, autoRotate]);

    // Shortest rotation logic
    const getShortestRotation = (current: number, target: number) => {
        let diff = target - current;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return current + diff;
    };

    const handleFaceClick = (face: Face) => {
        setAutoRotate(false);

        const targetRot = faceToRotation[face];
        const nextX = getShortestRotation(rotateX, targetRot.x);
        const nextY = getShortestRotation(rotateY, targetRot.y);

        setRotateX(nextX);
        setRotateY(nextY);

        setCurrentFace(face);

        setIsContentChanging(true);
        setTimeout(() => {
            setDisplayedContent(faceContentMap[face]);
            setIsContentChanging(false);
        }, 300);

        setTimeout(() => {
            setAutoRotate(true);
        }, 1000);
    };

    if (!isVisible) return null;

    return (
        <section className="hero-section" style={{ userSelect: 'none' }}>
            {/* Floating Particles for Background */}
            <div className="floating-particle" />
            <div className="floating-particle" />
            <div className="floating-particle" />

            <motion.div
                className="hero-author"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0 }}
                style={{ userSelect: 'none' }}
            >
                <span className="author-full">AFIN MAULANA</span>
                <span className="author-short" style={{ display: 'none' }}>AFIN MH</span>
            </motion.div>

            {/* Content Area - Changing based on face */}
            <AnimatePresence mode="wait">
                {!isContentChanging && (
                    <motion.div
                        key={currentFace}
                        className="hero-education"
                    >
                        <motion.div
                            className="education-title"
                            variants={educationTitleVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {displayedContent.title}
                        </motion.div>
                        <motion.div
                            className="education-subtitle"
                            variants={educationSubtitleVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {displayedContent.subtitle}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Cube Container - Spin Entrance (Z-axis / Rotate) */}
            <motion.div
                className="cube-container"
                initial={{ opacity: 0, scale: 0, rotate: -360 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                    duration: 1.5,
                    ease: "backOut",
                    scale: { type: "spring", stiffness: 100, damping: 15 }
                }}
            >
                <div className="scene">
                    <div
                        ref={cubeRef}
                        className="cube"
                        style={{
                            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
                        }}
                    >
                        <div className="cube-face front" onClick={(e) => { e.stopPropagation(); handleFaceClick('front'); }} />
                        <div className="cube-face back" onClick={(e) => { e.stopPropagation(); handleFaceClick('back'); }} />
                        <div className="cube-face right" onClick={(e) => { e.stopPropagation(); handleFaceClick('right'); }} />
                        <div className="cube-face left" onClick={(e) => { e.stopPropagation(); handleFaceClick('left'); }} />
                        <div className="cube-face top" onClick={(e) => { e.stopPropagation(); handleFaceClick('top'); }} />
                        <div className="cube-face bottom" onClick={(e) => { e.stopPropagation(); handleFaceClick('bottom'); }} />
                    </div>
                </div>
            </motion.div>

            {/* Description Text */}
            <AnimatePresence mode="wait">
                {!isContentChanging && (
                    <motion.div
                        key={currentFace + "-desc"}
                        className="hero-description"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={textRevealVariants}
                    >
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={wordVariants}
                                style={{ display: 'inline-block', marginRight: '0.3em' }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <motion.div
                className="cube-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
            >
                *Click on any side to see description
            </motion.div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 16.5l-6-6 1.41-1.41L12 13.67l4.59-4.58L18 10.5z" />
                </svg>
                <span>Scroll Down</span>
            </motion.div>
        </section>
    );
}
