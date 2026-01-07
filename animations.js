/* ============================================
   WORLD-CLASS PORTFOLIO ANIMATIONS
   Professional-grade interactions and effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initLoader();
    initSpotlight();
    initNavbar();
    initSmoothScroll();
    initRevealAnimations();
    initExperienceTabs();
    initProjectCards();
    initTypingEffect();
    initVideoBackground();
});

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');

            // Trigger hero animations after loader
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.classList.add('active');
            }

            // Start reveal animations
            setTimeout(() => {
                document.querySelectorAll('.fade-up').forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, i * 100);
                });
            }, 300);
        }, 800);
    });
}

/* ============================================
   SPOTLIGHT CURSOR EFFECT
   ============================================ */
function initSpotlight() {
    const spotlight = document.querySelector('.spotlight');
    if (!spotlight) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateSpotlight() {
        // Smooth follow
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        // Convert to percentage
        const xPercent = (currentX / window.innerWidth) * 100;
        const yPercent = (currentY / window.innerHeight) * 100;

        spotlight.style.setProperty('--mouse-x', `${xPercent}%`);
        spotlight.style.setProperty('--mouse-y', `${yPercent}%`);

        requestAnimationFrame(updateSpotlight);
    }

    updateSpotlight();
}

/* ============================================
   NAVBAR SCROLL BEHAVIOR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Add/remove scrolled class
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show based on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.navbar-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   EXPERIENCE TABS
   ============================================ */
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.job-panel');
    const highlight = document.querySelector('.tab-highlight');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked
            button.classList.add('active');
            tabPanels[index].classList.add('active');

            // Move highlight
            if (highlight) {
                const isVertical = window.innerWidth > 768;
                if (isVertical) {
                    highlight.style.transform = `translateY(${index * 42}px)`;
                } else {
                    highlight.style.transform = `translateX(${index * 100}%)`;
                }
            }
        });
    });

    // Initialize first panel
    if (tabPanels[0]) {
        tabPanels[0].classList.add('active');
    }
}

/* ============================================
   PROJECT CARD HOVER EFFECTS - ENHANCED
   ============================================ */
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card, .featured-project, .cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Featured project image hover
    const projectImages = document.querySelectorAll('.project-image-wrapper');
    projectImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.02)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });

    // 3D Tilt Effect for Unified Project Cards
    const unifiedCards = document.querySelectorAll('.unified-project-card');

    unifiedCards.forEach((card, index) => {
        // Add stagger delay for animation
        card.style.transitionDelay = `${index * 0.08}s`;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `
                perspective(1000px)
                translateY(-15px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transitionDelay = '';
        });
    });

    // Staggered Fade-in Animation on Scroll
    const projectsSection = document.querySelector('#two');
    if (projectsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.unified-project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('revealed');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(projectsSection);
    }
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    // Optional: Add typing effect to hero tagline
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    const cursor = '<span class="typing-cursor"></span>';

    // Already styled, just ensure cursor is visible
}

/* ============================================
   STATS COUNTER ANIMATION
   ============================================ */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                animateCounter(target, finalValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, stepTime);
}

/* ============================================
   LINK HOVER EFFECTS
   ============================================ */
function initLinkEffects() {
    const links = document.querySelectorAll('.link-fancy');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.color = 'var(--cyan)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.color = '';
        });
    });
}

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   IMAGE LAZY LOADING
   ============================================ */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.navbar-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle?.classList.remove('active');
        }
    }
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any position-dependent values
    const highlight = document.querySelector('.tab-highlight');
    const activeTab = document.querySelector('.tab-button.active');

    if (highlight && activeTab) {
        const index = Array.from(activeTab.parentElement.children)
            .filter(el => el.classList.contains('tab-button'))
            .indexOf(activeTab);

        const isVertical = window.innerWidth > 768;
        if (isVertical) {
            highlight.style.transform = `translateY(${index * 42}px)`;
        } else {
            highlight.style.transform = `translateX(${index * 100}%)`;
        }
    }
}, 250));

/* ============================================
   VIDEO BACKGROUND AUTOPLAY
   ============================================ */
function initVideoBackground() {
    const video = document.getElementById('bg-video');
    if (!video) return;

    // Force autoplay on load
    video.play().catch(function (error) {
        console.log('Video autoplay was prevented:', error);
        // Try playing on user interaction
        document.addEventListener('click', function playOnClick() {
            video.play();
            document.removeEventListener('click', playOnClick);
        }, { once: true });
    });

    // Ensure video loops and stays muted
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
}

console.log('✨ World-class portfolio animations loaded!');
