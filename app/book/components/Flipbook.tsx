'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

interface PageProps {
    number: number;
    children?: React.ReactNode;
    className?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ number, children, className }, ref) => (
    <div className={`page ${className || ''}`} ref={ref}>
        {children}
    </div>
));
Page.displayName = 'Page';

interface FlipbookProps {
    onReady?: () => void;
    showNavigation?: boolean;
}

export default function Flipbook({ onReady, showNavigation = true }: FlipbookProps) {
    const flipbookRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 765, height: 540 });
    const [isReady, setIsReady] = useState(false);

    // Build pages structure
    // Desktop: includes blank pages | Mobile: no blank pages
    const buildPages = useCallback((mobile: boolean) => {
        if (mobile) {
            // Mobile: no blank pages, just images 1-15
            return Array.from({ length: 15 }, (_, i) => ({
                type: 'image' as const,
                src: `/booklet/images/${i + 1}.png`,
                isHard: i === 0 || i === 14, // first and last are hard covers
            }));
        } else {
            // Desktop: match original HTML structure with blank pages
            // Structure from index.html: cover(hard), blank(hard), blank, img2, img3, blank, img4-14, blank, blank(hard), back(hard)
            return [
                { type: 'image' as const, src: '/booklet/images/1.png', isHard: true },  // Cover
                { type: 'blank' as const, isHard: true },  // Blank hard
                { type: 'blank' as const, isHard: false }, // Blank
                { type: 'image' as const, src: '/booklet/images/2.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/3.png', isHard: false },
                { type: 'blank' as const, isHard: false }, // Blank
                { type: 'image' as const, src: '/booklet/images/4.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/5.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/6.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/7.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/8.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/9.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/10.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/11.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/12.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/13.png', isHard: false },
                { type: 'image' as const, src: '/booklet/images/14.png', isHard: false },
                { type: 'blank' as const, isHard: false }, // Blank
                { type: 'blank' as const, isHard: true },  // Blank hard
                { type: 'image' as const, src: '/booklet/images/15.png', isHard: true }, // Back cover
            ];
        }
    }, []);

    const [pages, setPages] = useState(() => buildPages(false));

    useEffect(() => {
        audioRef.current = new Audio('/booklet/audio/page-flip.wav');
    }, []);

    const calculateDimensions = useCallback(() => {
        const isMobileView = window.innerWidth < 768;
        setIsMobile(isMobileView);
        setPages(buildPages(isMobileView));

        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        if (isMobileView) {
            // Single page mode
            const bookRatio = (765 / 2) / 540;
            let newWidth = containerWidth * 0.9; // kept mobile at 0.9 as it was
            let newHeight = newWidth / bookRatio;

            if (newHeight > containerHeight * 0.9) {
                newHeight = containerHeight * 0.9;
                newWidth = newHeight * bookRatio;
            }

            setDimensions({ width: newWidth, height: newHeight });
        } else {
            // Double page mode
            const bookRatio = 765 / 540;

            // Allow taking up to 90% of screen width (slightly smaller than 95%)
            let newWidth = containerWidth * 0.90;

            // Calculate height based on ratio
            let newHeight = newWidth / bookRatio;

            // If height is too tall for screen, scale down
            if (newHeight > containerHeight * 0.90) {
                newHeight = containerHeight * 0.90;
                newWidth = newHeight * bookRatio;
            }

            // Ensure even number for width
            newWidth = Math.floor(newWidth);
            if (newWidth % 2 !== 0) newWidth -= 1;

            setDimensions({ width: newWidth, height: newHeight });
        }
    }, [buildPages]);

    useEffect(() => {
        calculateDimensions();
        window.addEventListener('resize', calculateDimensions);
        return () => window.removeEventListener('resize', calculateDimensions);
    }, [calculateDimensions]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const active = document.activeElement;
            const tag = active?.tagName.toLowerCase();
            if (active && ((active as HTMLElement).isContentEditable || tag === 'input' || tag === 'textarea')) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                flipbookRef.current?.pageFlip()?.flipPrev();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                flipbookRef.current?.pageFlip()?.flipNext();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const playFlipSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    const goToFirst = () => flipbookRef.current?.pageFlip()?.flip(0);
    const goToPrev = () => flipbookRef.current?.pageFlip()?.flipPrev();
    const goToNext = () => flipbookRef.current?.pageFlip()?.flipNext();
    const goToLast = () => {
        const totalPages = flipbookRef.current?.pageFlip()?.getPageCount() || 0;
        flipbookRef.current?.pageFlip()?.flip(totalPages - 1);
    };

    const handleFlipbookInit = () => {
        setIsReady(true);
        onReady?.();
    };

    return (
        <div className="flipbook-wrapper">
            <div className="flipbook-container">
                <HTMLFlipBook
                    ref={flipbookRef}
                    width={isMobile ? dimensions.width : Math.floor(dimensions.width / 2)}
                    height={dimensions.height}
                    size="fixed"
                    minWidth={300}
                    maxWidth={4000}
                    minHeight={400}
                    maxHeight={4000}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={playFlipSound}
                    onInit={handleFlipbookInit}
                    className="flipbook"
                    style={{ margin: '0 auto' }}
                    startPage={0}
                    drawShadow={false}
                    flippingTime={800}
                    usePortrait={isMobile}
                    startZIndex={0}
                    autoSize={false}
                    maxShadowOpacity={0}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    swipeDistance={30}
                    clickEventForward={true}
                    useMouseEvents={true}
                >
                    {pages.map((page, index) => {
                        // Even index (0, 2, 4...) -> Right Page -> Spine on Left
                        // Odd index (1, 3, 5...) -> Left Page -> Spine on Right
                        const isEven = index % 2 === 0;
                        const blankClass = isEven ? 'blank-page-even' : 'blank-page-odd';

                        return (
                            <Page key={index} number={index + 1} className={page.isHard ? 'hard' : ''}>
                                {page.type === 'image' && page.src ? (
                                    <img src={page.src} alt={`Page ${index + 1}`} />
                                ) : (
                                    <div className={`blank-page ${blankClass}`} />
                                )}
                            </Page>
                        );
                    })}
                </HTMLFlipBook>
            </div>

            {/* Desktop Navigation - Only show when splash screen is complete */}
            {showNavigation && (
                <nav className="nav-vertical" aria-label="Book navigation">
                    <div className="nav-buttons">
                        <button className="nav-btn" onClick={goToFirst} aria-label="First Page" title="First">
                            <span>&lt;|</span>
                        </button>
                        <button className="nav-btn" onClick={goToPrev} aria-label="Previous Page" title="Prev">
                            <span>&lt;</span>
                        </button>
                        <a
                            className="nav-btn nav-site"
                            href="/showcase"
                            aria-label="Visit website"
                            title="Visit website"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path fill="#111" d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.93 7h-2.07a15.9 15.9 0 00-1.2-3.12A8.01 8.01 0 0117.93 9zM12 4.06c.9 1.06 1.66 2.5 2.22 4.06H9.78C10.34 6.56 11.1 5.12 12 4.06zM4.07 11a6.98 6.98 0 010-2h2.07c.06.67.17 1.33.33 2H4.07zM12 19.94c-.9-1.06-1.66-2.5-2.22-4.06h4.44c-.56 1.56-1.32 3-2.22 4.06z" />
                            </svg>
                        </a>
                        <button className="nav-btn" onClick={goToNext} aria-label="Next Page" title="Next">
                            <span>&gt;</span>
                        </button>
                        <button className="nav-btn" onClick={goToLast} aria-label="Last Page" title="Last">
                            <span>|&gt;</span>
                        </button>
                    </div>
                </nav>
            )}

            {/* Mobile Navigation - Only show when splash screen is complete */}
            {showNavigation && (
                <nav className="mobile-nav" aria-label="Book navigation mobile">
                    <div className="mobile-nav-buttons">
                        <button className="nav-btn" onClick={goToFirst} aria-label="First Page">
                            <span>&lt;|</span>
                        </button>
                        <button className="nav-btn" onClick={goToPrev} aria-label="Previous Page">
                            <span>&lt;</span>
                        </button>
                        <a
                            className="nav-btn nav-site"
                            href="/showcase"
                            aria-label="Visit website"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path fill="#111" d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.93 7h-2.07a15.9 15.9 0 00-1.2-3.12A8.01 8.01 0 0117.93 9zM12 4.06c.9 1.06 1.66 2.5 2.22 4.06H9.78C10.34 6.56 11.1 5.12 12 4.06zM4.07 11a6.98 6.98 0 010-2h2.07c.06.67.17 1.33.33 2H4.07zM12 19.94c-.9-1.06-1.66-2.5-2.22-4.06h4.44c-.56 1.56-1.32 3-2.22 4.06z" />
                            </svg>
                        </a>
                        <button className="nav-btn" onClick={goToNext} aria-label="Next Page">
                            <span>&gt;</span>
                        </button>
                        <button className="nav-btn" onClick={goToLast} aria-label="Last Page">
                            <span>|&gt;</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}
