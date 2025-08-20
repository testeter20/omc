// Navigation Component JavaScript
class Navigation {
    constructor() {
        this.nav = null;
        this.mobileMenuBtn = null;
        this.navLinks = null;
        this.sections = null;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        // Try to initialize immediately if elements exist
        this.tryInit();
        
        // Also listen for components loaded event
        document.addEventListener('components:loaded', () => {
            this.tryInit();
        });
    }
    
    tryInit() {
        if (this.initialized) return;
        
        this.nav = document.querySelector('.nav');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        
        if (this.nav && this.mobileMenuBtn) {
            this.initMobileMenu();
            this.initSmoothScrolling();
            this.initActiveNavigation();
            this.initScrollIndicator();
            this.initialized = true;
            console.log('Navigation initialized successfully');
        }
    }
    
    initMobileMenu() {
        if (this.mobileMenuBtn && this.nav) {
            // Remove existing listeners to prevent duplicates
            this.mobileMenuBtn.removeEventListener('click', this.toggleMenu);
            this.mobileMenuBtn.addEventListener('click', this.toggleMenu.bind(this));
            
            // Close mobile menu when clicking on a link
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.closeMenu);
                link.addEventListener('click', this.closeMenu.bind(this));
            });
        }
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        // Add hamburger animation
        this.mobileMenuBtn.classList.toggle('active');
    }
    
    closeMenu() {
        this.nav.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
    }
    
    initSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleSmoothScroll);
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }
    
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    initActiveNavigation() {
        // Remove existing scroll listener to prevent duplicates
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    handleScroll() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.removeEventListener('click', this.handleScrollIndicator);
            scrollIndicator.addEventListener('click', this.handleScrollIndicator.bind(this));
        }
    }
    
    handleScrollIndicator() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

// Also initialize when components are loaded
document.addEventListener('components:loaded', () => {
    // Small delay to ensure DOM is fully updated
    setTimeout(() => {
        if (!window.navigationInstance) {
            window.navigationInstance = new Navigation();
        } else {
            window.navigationInstance.tryInit();
        }
    }, 100);
});
