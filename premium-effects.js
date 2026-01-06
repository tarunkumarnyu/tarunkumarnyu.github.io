/* ============================================
   ULTRA-PREMIUM PORTFOLIO EFFECTS
   Award-winning interactions & animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMagneticElements();
    initGlitchText();
    init3DTilt();
    initParallaxLayers();
    initTextReveal();
    initGlowingBorders();
    initCursorTrail();
    initSmoothMomentum();
    initHoverExplosion();
});

/* ============================================
   MAGNETIC CURSOR EFFECT
   Elements subtly attract toward cursor
   ============================================ */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.hero-cta, .resume-button, .project-card, .stat-card, .tech-badge, .contact-button');

    magneticElements.forEach(el => {
        el.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;

            el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

/* ============================================
   GLITCH TEXT EFFECT
   Cyberpunk-style name glitch
   ============================================ */
function initGlitchText() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const text = heroName.textContent;
    heroName.setAttribute('data-text', text);
    heroName.classList.add('glitch-text');

    // Add glitch layers
    const glitchStyles = document.createElement('style');
    glitchStyles.textContent = `
        .glitch-text {
            position: relative;
            animation: glitch-skew 3s infinite linear alternate-reverse;
        }
        
        .glitch-text::before,
        .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
        }
        
        .glitch-text::before {
            animation: glitch-effect 2s infinite;
            color: #00ffff;
            z-index: -1;
            clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }
        
        .glitch-text::after {
            animation: glitch-effect 2s infinite reverse;
            color: #ff00ff;
            z-index: -2;
            clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        }
        
        @keyframes glitch-effect {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-3px); }
            40% { transform: translateX(3px); }
            60% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
        }
        
        @keyframes glitch-skew {
            0%, 100% { transform: skewX(0deg); }
            50% { transform: skewX(0.5deg); }
        }
    `;
    document.head.appendChild(glitchStyles);
}

/* ============================================
   3D TILT EFFECT
   Cards tilt based on mouse position
   ============================================ */
function init3DTilt() {
    const tiltElements = document.querySelectorAll('.project-card, .cert-card, .stat-card, .featured-project');

    tiltElements.forEach(el => {
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = 'transform 0.15s ease-out';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* ============================================
   PARALLAX SCROLL LAYERS - OPTIMIZED
   Throttled for better performance
   ============================================ */
function initParallaxLayers() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Hero parallax only (removed section transforms for performance)
                const hero = document.querySelector('#header');
                if (hero && scrollY < window.innerHeight) {
                    hero.style.transform = `translateY(${scrollY * 0.2}px)`;
                    hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.4;
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   TEXT REVEAL ANIMATION
   Words fade in one by one
   ============================================ */
function initTextReveal() {
    const heroTagline = document.querySelector('.hero-tagline');
    if (!heroTagline) return;

    const text = heroTagline.textContent;
    heroTagline.innerHTML = '';

    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(30px) rotateX(90deg);
            animation: revealChar 0.5s ease forwards;
            animation-delay: ${1.5 + i * 0.03}s;
        `;
        heroTagline.appendChild(span);
    });

    const revealStyles = document.createElement('style');
    revealStyles.textContent = `
        @keyframes revealChar {
            to {
                opacity: 1;
                transform: translateY(0) rotateX(0);
            }
        }
    `;
    document.head.appendChild(revealStyles);
}

/* ============================================
   GLOWING ANIMATED BORDERS
   Flowing gradient borders
   ============================================ */
function initGlowingBorders() {
    const cards = document.querySelectorAll('.project-card, .stat-card');

    cards.forEach(card => {
        card.style.position = 'relative';
        card.style.overflow = 'hidden';

        const gradient = document.createElement('div');
        gradient.className = 'glow-border';
        gradient.style.cssText = `
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, 
                transparent, 
                #64ffda33, 
                transparent, 
                #64ffda66, 
                transparent);
            background-size: 400% 400%;
            animation: borderFlow 4s ease infinite;
            border-radius: inherit;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        card.appendChild(gradient);

        card.addEventListener('mouseenter', () => {
            gradient.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            gradient.style.opacity = '0';
        });
    });

    const borderStyles = document.createElement('style');
    borderStyles.textContent = `
        @keyframes borderFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(borderStyles);
}

/* ============================================
   CURSOR TRAIL EFFECT - OPTIMIZED
   Lightweight cursor glow
   ============================================ */
function initCursorTrail() {
    // Simplified to just a glow effect instead of particle trail
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(100, 255, 218, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}

/* ============================================
   SMOOTH MOMENTUM SCROLL
   Butter-smooth scrolling experience
   ============================================ */
function initSmoothMomentum() {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
        if (!isScrolling) {
            isScrolling = true;
            smoothScroll();
        }
    }, { passive: true });

    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * 0.1;

        if (Math.abs(targetScroll - currentScroll) > 0.5) {
            requestAnimationFrame(smoothScroll);
        } else {
            isScrolling = false;
        }
    }
}

/* ============================================
   HOVER PARTICLE EXPLOSION - OPTIMIZED
   Reduced particles for better performance
   ============================================ */
function initHoverExplosion() {
    const elements = document.querySelectorAll('.hero-cta, .contact-button, .resume-button');

    elements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            createExplosion(e.clientX, e.clientY);
        });
    });

    function createExplosion(x, y) {
        const colors = ['#64ffda', '#4facfe'];
        const particleCount = 6; // Reduced from 12

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 40;
            const color = colors[i % colors.length];

            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 5px;
                height: 5px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
            `;

            document.body.appendChild(particle);

            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            let px = 0, py = 0, opacity = 1;

            function animateParticle() {
                px += vx * 0.06;
                py += vy * 0.06 + 0.8;
                opacity -= 0.04; // Faster fade

                particle.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }

            requestAnimationFrame(animateParticle);
        }
    }
}

/* ============================================
   ENHANCED SPOTLIGHT WITH GLOW
   ============================================ */
(function enhanceSpotlight() {
    const spotlight = document.querySelector('.spotlight');
    if (spotlight) {
        spotlight.style.background = `
            radial-gradient(800px at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(100, 255, 218, 0.1),
                rgba(100, 255, 218, 0.05) 40%,
                transparent 70%)
        `;
    }
})();

/* ============================================
   FLOATING AVATAR ENHANCED
   ============================================ */
(function enhanceAvatar() {
    const avatar = document.querySelector('.image.avatar img');
    if (avatar) {
        avatar.style.animation = 'avatarFloat 6s ease-in-out infinite, avatarGlow 3s ease-in-out infinite alternate';

        const avatarStyles = document.createElement('style');
        avatarStyles.textContent = `
            @keyframes avatarFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(1deg); }
                50% { transform: translateY(-5px) rotate(0deg); }
                75% { transform: translateY(-15px) rotate(-1deg); }
            }
            
            @keyframes avatarGlow {
                from { box-shadow: 0 0 30px rgba(100, 255, 218, 0.4), 0 0 60px rgba(100, 255, 218, 0.2); }
                to { box-shadow: 0 0 50px rgba(100, 255, 218, 0.6), 0 0 100px rgba(100, 255, 218, 0.3); }
            }
        `;
        document.head.appendChild(avatarStyles);
    }
})();

/* ============================================
   TECH BADGE FLOAT EFFECT
   ============================================ */
(function enhanceTechBadges() {
    const badges = document.querySelectorAll('.tech-badge');
    badges.forEach((badge, i) => {
        badge.style.animation = `badgeFloat ${2 + i * 0.2}s ease-in-out infinite`;
        badge.style.animationDelay = `${i * 0.15}s`;
    });

    const badgeStyles = document.createElement('style');
    badgeStyles.textContent = `
        @keyframes badgeFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .tech-badge {
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
            cursor: default;
        }
        
        .tech-badge:hover {
            background: rgba(100, 255, 218, 0.2) !important;
            box-shadow: 0 0 20px rgba(100, 255, 218, 0.3);
            transform: translateY(-3px) scale(1.1) !important;
        }
    `;
    document.head.appendChild(badgeStyles);
})();

console.log('✨ Ultra-premium effects loaded! Your portfolio is now LEGENDARY!');
