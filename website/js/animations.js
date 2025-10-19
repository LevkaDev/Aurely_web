// Advanced Animations

// Scroll-triggered animations with Intersection Observer
const animationObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger effect to children
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    }
);

// Observe all animated elements
document.querySelectorAll('[data-animate]').forEach(el => {
    animationObserver.observe(el);
});

// Parallax effect for multiple elements
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroOffset = hero.offsetTop;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
    
    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Throttle function for performance
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Apply parallax on scroll
window.addEventListener('scroll', throttle(parallaxEffect, 10));

// Mouse move parallax for hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;
        
        const floatingElements = hero.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 10 + (index * 5);
            element.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
        });
    });
}

// Gradient animation for text
function animateGradient() {
    const gradientTexts = document.querySelectorAll('.gradient-text');
    
    gradientTexts.forEach(text => {
        let hue = 0;
        
        setInterval(() => {
            hue = (hue + 1) % 360;
            text.style.backgroundImage = `linear-gradient(135deg, 
                hsl(${hue}, 70%, 80%), 
                hsl(${(hue + 60) % 360}, 70%, 70%), 
                hsl(${(hue + 120) % 360}, 70%, 60%))`;
        }, 50);
    });
}

// Typing effect for hero title
function typingEffect(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe counters
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
});

// Smooth reveal for sections
function revealSection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Animate children with stagger
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            observer.unobserve(entry.target);
        }
    });
}

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Temporarily disabled - causing sections to disappear
// document.querySelectorAll('section').forEach(section => {
//     sectionObserver.observe(section);
// });

// Card hover effect with tilt
document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Ripple effect on buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations on load
window.addEventListener('load', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    parallaxEffect();
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
