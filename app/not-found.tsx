import Link from 'next/link';
import Image from 'next/image';
import './not-found.css'; // Import the custom styles

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="ghost-image-wrapper">
                <Image
                    src="/404.png"
                    alt="Ghost Illustration - 404"
                    width={400}
                    height={400}
                    className="ghost-image"
                    priority
                />
            </div>

            <h1 className="not-found-title">This Page is a Ghost</h1>

            <p className="not-found-text">
                Once alive and now dead, this ghost appears to have some unfinished business. Could it be with you? Or the treasure hidden under the floorboards of the old mansion in the hills that may never reach its rightful owner, a compassionate school teacher in Brooklyn.
            </p>

            <Link href="/showcase" className="back-home-btn">
                <span>Go to Showcase</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost">
                    <path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
                </svg>
            </Link>
        </div>
    );
}
