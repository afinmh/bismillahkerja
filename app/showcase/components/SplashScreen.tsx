'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [counter, setCounter] = useState(0);

    // Progress Control
    const timeProgress = useMotionValue(0);
    const assetProgress = useMotionValue(0);
    // Visual progress is the minimum of Time vs Assets to ensure we respect BOTH min-duration AND loading
    const progress = useTransform([timeProgress, assetProgress], ([t, a]) => Math.min(t, a));

    const exitProgress = useMotionValue(0);

    useEffect(() => {
        const unsubscribe = progress.on("change", (v) => {
            setCounter(Math.round(v));
            if (v >= 99.5) {
                // Check if already finished to avoid multiple triggers
                if (!isExitingRef.current) {
                    isExitingRef.current = true;
                    // Debounce slightly to ensure 100 is rendered
                    setTimeout(() => {
                        runExitSequence();
                    }, 200);
                }
            }
        });

        // Ref to track exit status to avoid duplicate calls
        const isExitingRef = { current: false };

        const assetsToLoad = [
            '/showcase/project/nadella-tech.png',
            '/showcase/project/si-mbah.png',
            '/showcase/project/handventure.png',
            '/404.png'
        ];

        let loadedCount = 0;
        const total = assetsToLoad.length;

        const runExitSequence = async () => {
            // Step 2: Brief pause
            await new Promise(resolve => setTimeout(resolve, 300));

            // Step 3: Animate Final White Slide Entry (Left -> Right)
            await animate(exitProgress, 100, {
                duration: 2.5,
                ease: [0.22, 1, 0.36, 1]
            });

            // Step 4: Brief pause before unmounting
            await new Promise(resolve => setTimeout(resolve, 100));
            onComplete();
        };

        const updateAssetProgress = () => {
            loadedCount++;
            const targetPercent = (loadedCount / total) * 100;
            animate(assetProgress, targetPercent, { duration: 0.5, ease: "easeOut" });
        };

        // Start Time Animation (Min Duration 2.5s)
        animate(timeProgress, 100, { duration: 2.5, ease: [0.22, 1, 0.36, 1] });

        // Start Asset Loading
        if (total === 0) {
            assetProgress.set(100);
        } else {
            assetsToLoad.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = updateAssetProgress;
                img.onerror = updateAssetProgress;
            });
        }

        // Safety fallback (10s)
        const fallback = setTimeout(() => {
            if (loadedCount < total) {
                assetProgress.set(100);
            }
        }, 10000);

        return () => {
            unsubscribe();
            clearTimeout(fallback);
        };
    }, [progress, exitProgress, onComplete, timeProgress, assetProgress]);

    // Transforms for Layer 2 (Black Slide)
    const blackSlideX = useTransform(progress, [0, 100], ['-100%', '0%']);
    const textInBlackX = useTransform(progress, [0, 100], ['100vw', '0vw']);
    const counterInBlackX = useTransform(progress, [0, 100], ['100vw', '0vw']);

    // Transforms for Layer 3 (Final White Slide Exit)
    const whiteExitX = useTransform(exitProgress, [0, 100], ['-100%', '0%']);
    const textInWhiteX = useTransform(exitProgress, [0, 100], ['100vw', '0vw']);
    // Counter-transform for the background to make it appear static while parent slides
    const backgroundInWhiteX = useTransform(exitProgress, [0, 100], ['100%', '0%']);

    // Common Text Styles
    // We recreate the sticky positioning manually to ensure overlaps work with the transforms
    const commonTextStyle: React.CSSProperties = {
        position: 'fixed',
        top: 'clamp(30px, 5vh, 60px)',
        left: 'clamp(20px, 4vw, 100px)',
        width: 'auto',
        zIndex: 1,
    };

    // Shared content for all layers
    const renderContent = (
        <>
            <span className="author-full">AFIN MAULANA</span>
            <span className="author-short">AFIN MH</span>
        </>
    );

    return (
        <div className="showcase-splash">
            {/* Layer 1: Base Gray (Initial) */}
            <div style={{ position: 'absolute', inset: 0, background: '#888888', zIndex: 0 }}>
                {/* Gray text on gray background */}
                <div className="splash-author" style={{ color: '#888888' }}>
                    {renderContent}
                </div>
            </div>

            {/* Layer 2: Black Slide (Wipe) */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    x: blackSlideX,
                    background: '#000',
                    zIndex: 10,
                    overflow: 'hidden',
                }}
            >
                {/* Text inside Black Slide (Gray #888) */}
                <motion.div
                    className="splash-author"
                    style={{
                        ...commonTextStyle,
                        color: '#888888', // Gray text on Black slide
                        x: textInBlackX,
                        width: '100vw',
                        left: 0,
                    }}
                >
                    <span style={{ paddingLeft: 'clamp(20px, 4vw, 100px)' }}>{renderContent}</span>
                </motion.div>

                {/* Counter inside Black Slide - Stationary relative to screen (Parallaxed inside slide) */}
                <motion.div
                    className="splash-counter"
                    style={{
                        position: 'fixed',
                        bottom: 'clamp(30px, 5vh, 60px)', // Aligned to bottom
                        left: '0',
                        width: '100vw',
                        color: '#fff', // White counter on black bg
                        x: counterInBlackX, // Parallax to stay stationary
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        pointerEvents: 'none', // Prevent interaction
                    }}
                >
                    <span style={{ paddingLeft: 'clamp(20px, 4vw, 100px)' }}>
                        {String(counter).padStart(2, '0')}
                    </span>
                </motion.div>
            </motion.div>

            {/* Layer 3: Final White Slide (Exit Wipe) - Matches Hero Section */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    x: whiteExitX,
                    background: 'transparent', // Container is transparent, background div handles visual
                    zIndex: 20,
                    overflow: 'hidden',
                }}
            >
                {/* Static Background Container (Counter-Sliding) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100vw',
                        height: '100%',
                        x: backgroundInWhiteX, // Counter-move to appear static
                        background: '#ffffff', // Base color
                    }}
                >
                    {/* Gradient Mesh (Hero Section Style) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `
                            radial-gradient(circle at 20% 30%, rgba(136, 136, 136, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(136, 136, 136, 0.12) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(136, 136, 136, 0.08) 0%, transparent 70%)
                        `,
                        zIndex: 1
                    }} />

                    {/* Grid Pattern (Hero Section Style - Static) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                            linear-gradient(rgba(136, 136, 136, 0.12) 1.5px, transparent 1.5px),
                            linear-gradient(90deg, rgba(136, 136, 136, 0.12) 1.5px, transparent 1.5px)
                        `,
                        backgroundSize: '60px 60px',
                        opacity: 1,
                        zIndex: 1
                    }} />
                </motion.div>

                {/* Text inside Final White Slide (Black #000) */}
                <motion.div
                    className="splash-author"
                    style={{
                        ...commonTextStyle,
                        color: '#000', // Final Black text
                        x: textInWhiteX,
                        width: '100vw',
                        left: 0,
                    }}
                >
                    <span style={{ paddingLeft: 'clamp(20px, 4vw, 100px)' }}>{renderContent}</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
