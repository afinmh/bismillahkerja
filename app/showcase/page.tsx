'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import HeroSection from './components/HeroSection';
import ProjectSection from './components/ProjectSection';
import ActivitySection from './components/ActivitySection';
import AboutSection from './components/AboutSection';
import './showcase.css';

export default function ShowcasePage() {
    const [splashComplete, setSplashComplete] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleSplashComplete = () => {
        setSplashComplete(true);
    };

    return (
        <main className="showcase-page">
            {/* Scroll Progress Bar at Bottom */}
            {splashComplete && (
                <motion.div
                    className="scroll-progress-bar"
                    style={{ scaleX }}
                />
            )}

            {/* Hero section - always mounted for smooth transition */}
            <HeroSection isVisible={splashComplete} />

            {/* Project section - visible after splash */}
            {splashComplete && <ProjectSection />}

            {/* Activity section - visible after splash */}
            {splashComplete && <ActivitySection />}

            {/* About/Contact section - visible after splash */}
            {splashComplete && <AboutSection />}

            {/* Splash screen overlays everything */}
            <AnimatePresence>
                {!splashComplete && (
                    <SplashScreen onComplete={handleSplashComplete} />
                )}
            </AnimatePresence>
        </main>
    );
}

