'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import SplashScreen from '../book/components/SplashScreen';
import '../book/booklet.css';

const Flipbook = dynamic(() => import('../book/components/Flipbook'), {
    ssr: false,
});

export default function BookletPage() {
    const [splashComplete, setSplashComplete] = useState(false);

    // All page images to preload
    const images = Array.from({ length: 15 }, (_, i) => `/booklet/images/${i + 1}.png`);

    const handleSplashComplete = () => {
        setSplashComplete(true);
    };

    return (
        <main className="booklet-page">
            {/* Flipbook is mounted immediately behind splash screen to ensure it's ready */}
            <Flipbook showNavigation={splashComplete} />

            <AnimatePresence>
                {!splashComplete && (
                    <SplashScreen images={images} onComplete={handleSplashComplete} />
                )}
            </AnimatePresence>
        </main>
    );
}
