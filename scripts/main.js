// 
// Main JavaScript designed by @glitchidea
// GitHub: https://github.com/glitchidea
// Cybersecurity Expert & Web Developer
//
// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to be loaded before initializing
    document.addEventListener('components:loaded', function() {
        initHeroSlider();
        initScrollAnimations();
        // Contact form is handled in scripts/components/contact.js
    });
});

// Hero background slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    let currentSlide = 0;
    
    if (slides.length > 0) {
        // Show first slide
        slides[0].classList.add('active');
        
        // Auto-rotate slides
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .stat, .about-content, .equipment-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
