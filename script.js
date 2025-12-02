/* ============================================
   ANALOG DRIVERS' CLUB
   JavaScript - Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initSmoothScroll();
    initForm();
    initCursor();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    const hero = document.querySelector('.hero');
    
    document.body.classList.add('loading');
    
    // Simulate loading and then reveal content
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            hero.classList.add('loaded');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 1500);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;
    let ticking = false;
    
    function updateNav() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const links = menu.querySelectorAll('.mobile-link');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS (Reveal on Scroll)
   ============================================ */
function initScrollAnimations() {
    // Add reveal class to elements
    const revealElements = [
        '.section-tag',
        '.section-title',
        '.about-lead',
        '.about-content p',
        '.stat',
        '.collection-intro',
        '.gallery-item',
        '.quote',
        '.membership-lead',
        '.membership-requirements',
        '.membership-benefits',
        '.membership-image',
        '.event-item',
        '.contact-info',
        '.contact-form',
        '.form-group'
    ];
    
    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            // Stagger animations for grouped elements
            if (selector === '.stat' || selector === '.form-group') {
                el.classList.add(`reveal-delay-${(index % 4) + 1}`);
            }
            if (selector === '.gallery-item') {
                el.classList.add(`reveal-delay-${(index % 3) + 1}`);
            }
        });
    });
    
    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;
        
        if (scrolled < heroHeight) {
            const parallaxValue = scrolled * 0.4;
            heroImage.style.transform = `scale(1) translateY(${parallaxValue}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                submitBtn.textContent = 'Application Submitted!';
                submitBtn.style.background = '#2E7D32';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
        
        // Add floating label effect
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

/* ============================================
   CUSTOM CURSOR (Desktop Enhancement)
   ============================================ */
function initCursor() {
    // Only on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
        document.body.appendChild(cursor);
        
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 10000;
                mix-blend-mode: difference;
            }
            
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            
            .cursor-outline {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease;
            }
            
            .custom-cursor.hover .cursor-dot {
                transform: translate(-50%, -50%) scale(1.5);
            }
            
            .custom-cursor.hover .cursor-outline {
                transform: translate(-50%, -50%) scale(1.5);
                border-color: rgba(255, 255, 255, 0.8);
            }
            
            body:has(.custom-cursor) {
                cursor: none;
            }
            
            body:has(.custom-cursor) a,
            body:has(.custom-cursor) button {
                cursor: none;
            }
        `;
        document.head.appendChild(style);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .gallery-item');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
}

/* ============================================
   GALLERY IMAGE LOADING
   ============================================ */
function initGalleryLoading() {
    const images = document.querySelectorAll('.gallery-image');
    
    images.forEach(img => {
        if (img.complete) {
            img.parentElement.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.parentElement.classList.add('loaded');
            });
        }
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.textContent);
                animateCounter(target, endValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, endValue) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = endValue;
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--color-accent), var(--color-text));
            z-index: 10001;
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 0.1s linear;
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        
        progressBar.style.transform = `scaleX(${progress})`;
    });
}

// Initialize additional features after main content loads
window.addEventListener('load', () => {
    setTimeout(() => {
        initGalleryLoading();
        initCounters();
        initScrollProgress();
    }, 1600);
});

/* ============================================
   MAGNETIC BUTTONS (Optional Enhancement)
   ============================================ */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// Initialize magnetic buttons
document.addEventListener('DOMContentLoaded', initMagneticButtons);
