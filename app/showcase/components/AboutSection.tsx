'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useAnimationFrame, useInView } from 'framer-motion';

import Lanyard from './ReactBitsLanyard';

// ==================== REACT CHAT COMPONENT ====================
interface Comment {
    id: string;
    id_user: string;
    nama: string;
    message: string;
    avatar: string;
    created_at: string;
}

const ChatComponent = () => {
    const maleAvatars = [
        '/profile/1-king.png',
        '/profile/1-retro.png',
        '/profile/1-robot.png',
        '/profile/1-superhero.png',
        '/profile/1-cowboy.png'
    ];
    const femaleAvatars = [
        '/profile/2-elf.png',
        '/profile/2-kitty.png',
        '/profile/2-princess.png',
        '/profile/2-queen.png',
        '/profile/2-viking.png'
    ];

    const [comments, setComments] = useState<Comment[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('/profile/1-robot.png');
    const [idUser, setIdUser] = useState('');
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const badWords = [
        // Bahasa Indonesia
        'anjing', 'goblok', 'bangsat', 'babi', 'kunyuk', 'asu', 'bajingan', 'tolol',
        'idiot', 'kontol', 'memek', 'ngentot', 'brengsek', 'kampret', 'keparat',
        'setan', 'iblis', 'sialan', 'pecundang', 'tai', 'bacot', 'lonte', 'pelacur', 'bego', 'gila', 'bangke',
        // Bahasa Inggris
        'fuck', 'shit', 'bitch', 'ass', 'dick', 'bastard', 'crap', 'jerk',
        'idiot', 'moron', 'stupid', 'dumb', 'slut', 'whore', 'damn',
        'asshole', 'fucker', 'bullshit', 'loser', 'screw', 'nuts', 'prick'
    ];

    // Initialize Identity
    useEffect(() => {
        const storedId = localStorage.getItem('comment_user_id') || Math.random().toString(36).substring(2, 11);
        if (!localStorage.getItem('comment_user_id')) {
            localStorage.setItem('comment_user_id', storedId);
        }
        setIdUser(storedId);

        const storedName = localStorage.getItem('comment_user_name') || 'Visitor';
        setUserName(storedName);

        const storedAvatar = localStorage.getItem('comment_user_avatar') || '/profile/1-robot.png';
        setUserAvatar(storedAvatar);

        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const resp = await fetch('/api/comments');
            const data = await resp.json();
            if (Array.isArray(data)) setComments(data);
        } catch (e) {
            console.error('Failed to fetch comments', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Check for bad words
        const lowerMsg = inputValue.toLowerCase();
        const hasBadWord = badWords.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(lowerMsg);
        });

        if (hasBadWord) {
            setErrorMsg('Whoa, watch your language, everyone!');
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }

        setErrorMsg('');

        // Persist local identity changes if any
        localStorage.setItem('comment_user_name', userName);
        localStorage.setItem('comment_user_avatar', userAvatar);

        const newPayload = {
            id_user: idUser,
            nama: userName || 'Anonymous',
            avatar: userAvatar,
            message: inputValue,
        };

        try {
            const resp = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayload),
            });
            const savedComment = await resp.json();
            if (savedComment.id) {
                setComments(prev => [...prev, savedComment]);
                setInputValue('');
            }
        } catch (e) {
            console.error('Failed to post comment', e);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <div className="chat-status-dot" />
                <span>Drop a message!</span>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginLeft: 'auto', fontSize: '11px', color: '#ff4444', fontWeight: 'bold' }}
                    >
                        {errorMsg}
                    </motion.div>
                )}
            </div>
            <div className="chat-messages" ref={scrollRef}>
                {isLoading ? (
                    <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>Loading comments...</div>
                ) : comments.map(msg => {
                    const isMe = msg.id_user === idUser;
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`chat-message ${isMe ? 'owner' : 'visitor'}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                <div className="message-avatar">
                                    <img src={msg.avatar} alt="avatar" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                    <span className="message-header">{msg.nama} {isMe && "(You)"}</span>
                                    <div className="message-bubble">
                                        {msg.message}
                                    </div>
                                    <span className="message-time">{formatDate(msg.created_at)}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <div className="chat-input-group">
                    <div style={{ position: 'relative' }}>
                        <button
                            type="button"
                            className="avatar-picker-btn"
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        >
                            <img src={userAvatar} alt="current avatar" />
                        </button>

                        {showAvatarPicker && (
                            <div className="avatar-picker-popover">
                                <div className="avatar-picker-row">
                                    {maleAvatars.map(path => (
                                        <button
                                            key={path}
                                            type="button"
                                            className={`avatar-option ${userAvatar === path ? 'active' : ''}`}
                                            onClick={() => {
                                                setUserAvatar(path);
                                                setShowAvatarPicker(false);
                                            }}
                                        >
                                            <img src={path} alt="male avatar" />
                                        </button>
                                    ))}
                                </div>
                                <div className="avatar-picker-row">
                                    {femaleAvatars.map(path => (
                                        <button
                                            key={path}
                                            type="button"
                                            className={`avatar-option ${userAvatar === path ? 'active' : ''}`}
                                            onClick={() => {
                                                setUserAvatar(path);
                                                setShowAvatarPicker(false);
                                            }}
                                        >
                                            <img src={path} alt="female avatar" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="input-vertical-group">
                        <input
                            type="text"
                            className="name-input"
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="text"
                            className="msg-input"
                            placeholder="Leave a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit" className="chat-send-btn">
                    Send
                </button>
            </form>
        </div>
    );
};

// ==================== ABOUT SECTION ====================
export default function AboutSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

    return (
        <section ref={sectionRef} className="about-section" style={{ position: 'relative' }}>
            {/* Lanyard Overlay - Now only rendered when in view for performance */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            >
                {/* Enable pointer events on the Lanyard container/canvas itself */}
                <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                    {isInView && <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />}
                </div>
            </motion.div>

            <div className="about-header" style={{ position: 'relative', zIndex: 2 }}>
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 1 },
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="section-title"
                >
                    {Array.from("REACT & CONNECT").map((char, index) => (
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
            </div>

            <div className="about-content" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
                {/* Left Side: Chat */}
                <div className="about-left" style={{ pointerEvents: 'auto' }}>
                    <ChatComponent />
                </div>

                {/* Right Side: Spacer to keep layout balanced/push chat left */}
                <div className="about-right-spacer" style={{ flex: 1 }} />
            </div>

            {/* Social Media Footer */}
            <div className="social-footer" style={{ position: 'relative', zIndex: 2 }}>
                <a href="https://www.instagram.com/afiinm_" className="contact-social-btn" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><path fill="currentColor" d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.75 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/afin-maulana" className="contact-social-btn" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z" /></svg>
                </a>
                <a href="https://github.com/afinmh" className="contact-social-btn" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" /></svg>
                </a>
                <a href="mailto:mafinhida@gmail.com" className="contact-social-btn" target="_blank" rel="noopener noreferrer" title="Gmail">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-9.99l7.99 7.99c.39.39 1.02.39 1.41 0L20 10.01V20H4z" /></svg>
                </a>
            </div>
        </section>
    );
}
