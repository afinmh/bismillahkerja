'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    images: string[];
    onComplete: () => void;
}

const Counter = ({ value }: { value: any }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        return value.on("change", (latest: number) => setDisplayValue(Math.round(latest)));
    }, [value]);
    return <span id="loading-percent">{displayValue}%</span>;
};

export default function SplashScreen({ images, onComplete }: SplashScreenProps) {
    const [loadedCount, setLoadedCount] = useState(0);

    const total = images.length;

    // Use a spring for smooth progress animation
    const progressSpring = useSpring(0, {
        stiffness: 50,
        damping: 15,
        mass: 1,
        restDelta: 0.001
    });

    const progressPercent = useTransform(progressSpring, value => Math.round(value));

    // Preload images
    useEffect(() => {
        if (total === 0) {
            progressSpring.set(100);
            return;
        }

        // Add audio file to preload list manually for completeness
        const allAssets = [...images, '/booklet/audio/page-flip.wav'];
        let activeLoads = 0;

        allAssets.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = () => {
                activeLoads++;
                // Target progress based on real items loaded
                const target = (activeLoads / allAssets.length) * 100;
                progressSpring.set(target);
            };
            img.src = src;
        });
    }, [images, total, progressSpring]);

    // Monitor progress to trigger completion
    useEffect(() => {
        const unsubscribe = progressSpring.on("change", (latest) => {
            if (latest >= 99.5) {
                // Ensure it shows 100% for a moment before finishing
                setTimeout(() => {
                    onComplete();
                }, 800);
            }
        });
        return () => unsubscribe();
    }, [progressSpring, onComplete]);

    return (
        <motion.div
            id="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center fixed inset-0 bg-white z-[200]"
        >
            <div className="splash-content">
                <p className="splash-title">
                    <span className="splash-label">Loading..</span>
                    <Counter value={progressSpring} />
                </p>
                <div className="loading-bar" aria-hidden="true">
                    <motion.div
                        className="loading-bar-fill"
                        style={{ width: useTransform(progressSpring, v => `${v}%`) }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
