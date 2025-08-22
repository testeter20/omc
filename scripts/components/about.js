// 
// About section number counter animation
// Designed by @glitchidea
// GitHub: https://github.com/glitchidea
//

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        
        // Format the number based on target
        if (target === 40) {
            element.textContent = Math.floor(start) + '+';
        } else if (target === 100) {
            element.textContent = Math.floor(start) + '%';
        }
    }, 16);
}

function initAboutCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Check if elements are in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // Extract target number
                let target;
                if (text.includes('40+')) {
                    target = 40;
                } else if (text.includes('100%')) {
                    target = 100;
                }
                
                if (target) {
                    // Reset to 0
                    if (target === 40) {
                        element.textContent = '0+';
                    } else if (target === 100) {
                        element.textContent = '0%';
                    }
                    
                    // Start animation
                    animateCounter(element, target);
                }
                
                // Stop observing after animation starts
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutCounters);
} else {
    initAboutCounters();
}

// Also initialize when components are loaded
document.addEventListener('components:loaded', initAboutCounters);
