'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import SplashScreen from './showcase/components/SplashScreen';
import HeroSection from './showcase/components/HeroSection';
import ProjectSection from './showcase/components/ProjectSection';
import ActivitySection from './showcase/components/ActivitySection';
import BookSection from './showcase/components/BookSection';
import AboutSection from './showcase/components/AboutSection';
import ScrollToTop from './showcase/components/ScrollToTop';
import './showcase/showcase.css';

export default function Home() {
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

            {/* Book section - visible after splash */}
            {splashComplete && <BookSection />}

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
            <ScrollToTop />
        </main>
    );
}
