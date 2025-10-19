// Main JavaScript

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Temporarily disabled - causing elements to be hidden
// Add scroll-reveal class to feature cards
// document.querySelectorAll('.feature-card').forEach((card, index) => {
//     card.classList.add('scroll-reveal');
//     card.style.transitionDelay = `${index * 0.1}s`;
// });

// Add scroll-reveal class to language categories
// document.querySelectorAll('.language-category').forEach((category, index) => {
//     category.classList.add('scroll-reveal');
//     category.style.transitionDelay = `${index * 0.15}s`;
// });

// Add scroll-reveal class to pricing cards
// document.querySelectorAll('.pricing-card').forEach((card, index) => {
//     card.classList.add('scroll-reveal');
//     card.style.transitionDelay = `${index * 0.2}s`;
// });

// Parallax effect for hero section - DISABLED (causing layout issues)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     
//     if (hero && scrolled < window.innerHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//         hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
//     }
// });

// Detect non-Mac devices and show appropriate message
function detectPlatform() {
    const platform = navigator.platform.toLowerCase();
    const isMac = platform.includes('mac');
    
    if (!isMac) {
        const downloadButtons = document.querySelectorAll('a[href="#download"]');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Aurely is available exclusively for macOS 13.0+. Please visit this page on your Mac to download.');
            });
        });
    }
}

detectPlatform();

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Console message
console.log('%cAurely', 'font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #007AFF, #AF52DE); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cThe Most Intelligent Reminder App for Mac', 'font-size: 16px; color: #666;');
console.log('%cVisit https://aurely.app', 'font-size: 14px; color: #007AFF;');
