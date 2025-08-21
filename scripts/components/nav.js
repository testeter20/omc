// Simple Mobile Menu Handler
function initMobileMenu() {
    console.log('Mobile Menu: Initializing...');
    
    // Function to setup mobile menu
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        
        console.log('Mobile Menu: Elements found:', {
            mobileMenuBtn: !!mobileMenuBtn,
            nav: !!nav
        });
        
        if (mobileMenuBtn && nav) {
            // Remove any existing listeners
            const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
            mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
            
            // Add click listener
            newMobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile Menu: Button clicked!');
                
                nav.classList.toggle('active');
                newMobileMenuBtn.classList.toggle('active');
                
                console.log('Mobile Menu: Active state:', nav.classList.contains('active'));
            });
            
            // Close menu when clicking on links
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    console.log('Mobile Menu: Link clicked, closing menu');
                    nav.classList.remove('active');
                    newMobileMenuBtn.classList.remove('active');
                });
            });
            
            console.log('Mobile Menu: Successfully initialized');
            return true;
        }
        
        return false;
    }
    
    // Try to setup immediately
    if (!setupMobileMenu()) {
        console.log('Mobile Menu: Elements not found, will retry...');
        
        // Retry after components are loaded
        document.addEventListener('components:loaded', function() {
            console.log('Mobile Menu: Components loaded, retrying...');
            setTimeout(() => {
                if (!setupMobileMenu()) {
                    console.log('Mobile Menu: Still not found, final retry...');
                    setTimeout(setupMobileMenu, 500);
                }
            }, 100);
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
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

// Initialize all navigation features
function initAllNavigation() {
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAllNavigation);

// Also initialize when components are loaded
document.addEventListener('components:loaded', function() {
    setTimeout(initAllNavigation, 100);
});

// Fallback: Check every second for the first 5 seconds
let checkCount = 0;
const checkInterval = setInterval(function() {
    checkCount++;
    if (checkCount > 5) {
        clearInterval(checkInterval);
        return;
    }
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav && !mobileMenuBtn.hasAttribute('data-initialized')) {
        console.log('Mobile Menu: Found via interval check');
        mobileMenuBtn.setAttribute('data-initialized', 'true');
        initAllNavigation();
        clearInterval(checkInterval);
    }
}, 1000);
