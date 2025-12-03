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
   - DISABLED per client request - all content visible immediately
   ============================================ */
function initScrollAnimations() {
    // Animations disabled - all content visible immediately
    return;
}

/* ============================================
   PARALLAX EFFECTS
   - DISABLED per client request - no animations
   ============================================ */
function initParallax() {
    // Parallax disabled - no animations
    return;
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
    const contactForm = document.getElementById('contactForm');
    const waitlistForm = document.getElementById('waitlistForm');
    
    // Handle contact form if it exists
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Handle waitlist form
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleFormSubmit);
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        // If this is the waitlist form, save to localStorage
        if (form.id === 'waitlistForm') {
            saveWaitlistSubmission(data);
        }
        
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
    }
    
    function saveWaitlistSubmission(data) {
        // Save to API
        fetch('/api/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('Submission saved to database');
            }
        })
        .catch(error => {
            console.error('Error saving submission:', error);
        });
        
        // Also save to localStorage as backup
        const submissions = JSON.parse(localStorage.getItem('bvcc_submissions') || '[]');
        const submission = {
            ...data,
            timestamp: new Date().toISOString()
        };
        submissions.push(submission);
        localStorage.setItem('bvcc_submissions', JSON.stringify(submissions));
    }
    
    // Add floating label effect
    document.querySelectorAll('input, textarea, select').forEach(input => {
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

/* ============================================
   CUSTOM CURSOR (Desktop Enhancement)
   - DISABLED per client request - use regular pointer
   ============================================ */
function initCursor() {
    // Custom cursor disabled - use regular pointer
    return;
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
