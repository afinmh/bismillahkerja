'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

// ==================== DEV MODE ====================
// Set to true to see position labels and coordinates
const DEV_MODE = false;
// ==================================================

interface Photo {
    id: number;
    src: string;
    caption: string;
    rotation: number;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    desktopOnly?: boolean;
}

interface Position {
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
}

// Desktop positions (8 photos) - Bigger sizes
const desktopPositions: Record<number, Position> = {
    1: { x: 9, y: 13, rotation: -8, width: 240, height: 180 },
    2: { x: 35, y: 16, rotation: 5, width: 230, height: 175 },
    3: { x: 62, y: 12, rotation: -3, width: 235, height: 180 },
    4: { x: 88, y: 13, rotation: 7, width: 225, height: 170 },
    8: { x: 11, y: 87, rotation: 6, width: 235, height: 180 },
    9: { x: 36, y: 86, rotation: -5, width: 230, height: 175 },
    10: { x: 65, y: 85, rotation: 4, width: 250, height: 185 },
    11: { x: 92, y: 79, rotation: -6, width: 225, height: 175 },
};

// Mobile positions (6 photos: 2, 3, 4, 9, 10, 11)
const mobilePositions: Record<number, Position> = {
    2: { x: 79, y: 104, rotation: 5, width: 140, height: 110 },
    3: { x: 23, y: 20, rotation: -3, width: 140, height: 110 },
    4: { x: 74, y: 6, rotation: 7, width: 140, height: 110 },
    9: { x: 26, y: 117, rotation: -5, width: 140, height: 110 },
    10: { x: 24, y: 69, rotation: 4, width: 140, height: 110 },
    11: { x: 82, y: 50, rotation: -6, width: 140, height: 110 },
};

// All photo data with real activity captions
const allPhotoData = [
    { id: 1, src: 'showcase/activity/1.webp', caption: 'Study Visit from IPWIJA University Jakarta', desktopOnly: true },
    { id: 2, src: 'showcase/activity/2.webp', caption: 'Campus Introduction Expo' },
    { id: 3, src: 'showcase/activity/3.webp', caption: 'Basic Programming Lab Assistant 2024' },
    { id: 4, src: 'showcase/activity/4.webp', caption: 'LLDIKTI Region XVI Accreditation Visit' },
    { id: 8, src: 'showcase/activity/8.webp', caption: 'ITENAS Badminton Student Unit', desktopOnly: true },
    { id: 9, src: 'showcase/activity/9.webp', caption: 'Cheator Team – Prokimnas' },
    { id: 10, src: 'showcase/activity/10.webp', caption: 'Itenas Award 2025 - ICT Lab' },
    { id: 11, src: 'showcase/activity/11.webp', caption: 'Industrial Visit to Huawei' },
];

// Individual draggable photo card component
function PhotoCard({
    photo,
    index,
    hasAnimated,
    onBringToFront,
    onSelect,
    onPositionChange,
    containerRef,
    isMobile
}: {
    photo: Photo;
    index: number;
    hasAnimated: boolean;
    onBringToFront: (id: number) => void;
    onSelect: (photo: Photo) => void;
    onPositionChange: (id: number, x: number, y: number) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isMobile: boolean;
}) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentPos, setCurrentPos] = useState({ x: photo.x, y: photo.y });

    // Update position when isMobile changes
    useEffect(() => {
        setCurrentPos({ x: photo.x, y: photo.y });
    }, [photo.x, photo.y, isMobile]);

    const handleDragEnd = () => {
        setIsDragging(false);
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const deltaX = (x.get() / rect.width) * 100;
        const deltaY = (y.get() / rect.height) * 100;

        const newX = Math.round(photo.x + deltaX);
        const newY = Math.round(photo.y + deltaY);

        setCurrentPos({ x: newX, y: newY });
        onPositionChange(photo.id, newX, newY);
    };

    return (
        <motion.div
            className={`photo-card ${photo.desktopOnly ? 'desktop-only' : ''}`}
            style={{
                width: photo.width,
                height: photo.height + 40,
                zIndex: photo.zIndex,
                position: 'absolute',
                x,
                y,
            }}
            initial={{
                left: '50%',
                top: '50%',
                rotate: 0,  // No rotation when stacked
                scale: 0.5,
                opacity: 0,
                marginLeft: -photo.width / 2,
                marginTop: -(photo.height + 40) / 2,
            }}
            animate={hasAnimated ? {
                left: `${photo.x}%`,
                top: `${photo.y}%`,
                rotate: photo.rotation,  // Rotate only when spreading
                scale: 1,
                opacity: 1,
                marginLeft: -photo.width / 2,
                marginTop: -(photo.height + 40) / 2,
            } : {
                left: '50%',
                top: '50%',
                rotate: 0,  // No rotation when stacked
                scale: 0.8,
                opacity: 1,
                marginLeft: -photo.width / 2,
                marginTop: -(photo.height + 40) / 2,
            }}
            transition={{
                delay: hasAnimated ? 0.3 + index * 0.15 : 0,
                duration: 1,
                type: "spring",
                damping: 15,
                stiffness: 50
            }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {
                setIsDragging(true);
                onBringToFront(photo.id);
            }}
            onDragEnd={handleDragEnd}
            whileDrag={{
                scale: 1.15,
                zIndex: 1000,
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                cursor: 'grabbing'
            }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
                if (!isDragging) {
                    onSelect(photo);
                }
            }}
        >
            {/* Dev Mode Label */}
            {DEV_MODE && (
                <div style={{
                    position: 'absolute',
                    top: -30,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.8)',
                    color: '#0f0',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    zIndex: 9999,
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                }}>
                    #{photo.id} | x:{currentPos.x} y:{currentPos.y} r:{photo.rotation}°
                </div>
            )}

            {/* Pin */}
            <div className="pin" />
            <img
                src={photo.src}
                alt={photo.caption}
                style={{
                    width: photo.width - 20,
                    height: photo.height - 20,
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
                draggable={false}
            />
            <span className="photo-caption">{photo.caption}</span>
        </motion.div>
    );
}

export default function ActivitySection() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [highestZ, setHighestZ] = useState(12);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Generate positions based on screen size
    useEffect(() => {
        const positions = isMobile ? mobilePositions : desktopPositions;
        const photoData = isMobile
            ? allPhotoData.filter(p => !p.desktopOnly)
            : allPhotoData;

        const generatedPhotos = photoData.map((photo, index) => {
            const pos = positions[photo.id];
            return {
                ...photo,
                rotation: pos.rotation,
                x: pos.x,
                y: pos.y,
                width: pos.width,
                height: pos.height,
                zIndex: index + 1
            };
        });

        setPhotos(generatedPhotos);
    }, [isMobile]);

    // Intersection Observer to trigger animation when section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setTimeout(() => {
                            setHasAnimated(true);
                        }, 300);
                    }
                });
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const bringToFront = (id: number) => {
        const newZ = highestZ + 1;
        setHighestZ(newZ);
        setPhotos(prev => prev.map(photo =>
            photo.id === id ? { ...photo, zIndex: newZ } : photo
        ));
    };

    const handlePositionChange = (id: number, newX: number, newY: number) => {
        if (DEV_MODE) {
            console.log(`Photo #${id} new position: x: ${newX}, y: ${newY}`);
        }
    };

    return (
        <section className="activity-section" ref={sectionRef}>
            {/* Dev Mode Console */}
            {DEV_MODE && (
                <div style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    background: 'rgba(0,0,0,0.9)',
                    color: '#0f0',
                    padding: '15px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    zIndex: 9999,
                    maxWidth: '300px'
                }}>
                    <div style={{ marginBottom: '5px', color: '#ff0' }}>🛠 DEV MODE ON</div>
                    <div>Mode: {isMobile ? 'MOBILE' : 'DESKTOP'}</div>
                    <div>Photos: {photos.length}</div>
                    <div style={{ marginTop: '5px' }}>Drag photos to reposition</div>
                    <div>Check console for coordinates</div>
                </div>
            )}

            {/* Section Header */}
            <div className="project-header activity-header">
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
                    className="section-title activity-title"
                >
                    {Array.from("ACTIVITIES").map((char, index) => (
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
                <motion.span
                    className="activity-subtitle"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    Drag photos around • Click to expand
                </motion.span>
            </div>

            {/* Scattered Photo Gallery */}
            <div className="gallery-wrapper" ref={containerRef}>
                <div className="gallery-container">
                    {photos.map((photo, index) => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            index={index}
                            hasAnimated={hasAnimated}
                            onBringToFront={bringToFront}
                            onSelect={setSelectedPhoto}
                            onPositionChange={handlePositionChange}
                            containerRef={containerRef}
                            isMobile={isMobile}
                        />
                    ))}
                </div>

                {/* Decorative tape pieces */}
                <motion.div
                    className="tape tape-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={hasAnimated ? { opacity: 0.8, scale: 1 } : {}}
                    transition={{ delay: 2, duration: 0.5 }}
                />
                <motion.div
                    className="tape tape-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={hasAnimated ? { opacity: 0.8, scale: 1 } : {}}
                    transition={{ delay: 2.2, duration: 0.5 }}
                />
                <motion.div
                    className="tape tape-3"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={hasAnimated ? { opacity: 0.8, scale: 1 } : {}}
                    transition={{ delay: 2.4, duration: 0.5 }}
                />
            </div>

            {/* Expanded Photo Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className="photo-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            className="expanded-photo"
                            initial={{ scale: 0.5, rotate: selectedPhoto.rotation }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.5, rotate: selectedPhoto.rotation }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedPhoto.src} alt={selectedPhoto.caption} />
                            <div className="expanded-caption">{selectedPhoto.caption}</div>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                ×
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
