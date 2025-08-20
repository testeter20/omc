// Slider Component JavaScript
class Slider {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.slides = this.container ? this.container.querySelectorAll('.hero-bg-slide') : [];
        this.currentSlide = 0;
        this.interval = options.interval || 5000;
        this.autoPlay = options.autoPlay !== false;
        this.timer = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length > 0) {
            this.showSlide(0);
            
            if (this.autoPlay) {
                this.startAutoPlay();
            }
            
            // Pause on hover (for hero slider)
            if (this.container) {
                this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
                this.container.addEventListener('mouseleave', () => this.startAutoPlay());
            }
        }
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoPlay() {
        if (this.autoPlay && !this.timer) {
            this.timer = setInterval(() => {
                this.nextSlide();
            }, this.interval);
        }
    }
    
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    destroy() {
        this.stopAutoPlay();
        if (this.container) {
            this.container.removeEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.removeEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
}

// References Slider (Auto-scrolling)
class ReferencesSlider {
    constructor() {
        this.track1 = document.querySelector('.slider-track-1');
        this.track2 = document.querySelector('.slider-track-2');
        this.references = [];
        
        this.init();
    }
    
    async init() {
        await this.loadReferences();
        this.renderReferences();
        this.cloneItems();
    }
    
    async loadReferences() {
        try {
            const response = await fetch('data/references.json');
            const data = await response.json();
            this.references = data.references;
        } catch (error) {
            console.error('Error loading references:', error);
            // Fallback: varsayılan referanslar (Remix Icon)
            this.references = [
                { name: "BOTAŞ", icon: "ri-building-2-line" },
                { name: "Tekfen", icon: "ri-settings-3-line" },
                { name: "Rubis Terminal Petrol", icon: "ri-oil-line" },
                { name: "Türkerler", icon: "ri-leaf-line" },
                { name: "Soyak", icon: "ri-home-5-line" },
                { name: "SASA", icon: "ri-flask-line" },
                { name: "Lubpart", icon: "ri-tools-line" },
                { name: "Atlas", icon: "ri-landscape-line" },
                { name: "Varaka - Albayrak", icon: "ri-ship-line" },
                { name: "Tefirom", icon: "ri-building-line" },
                { name: "Beştepeler Enerji", icon: "ri-flashlight-line" },
                { name: "AKSA Akrilik", icon: "ri-atom-line" },
                { name: "Konya Şeker", icon: "ri-seedling-line" },
                { name: "İGSAS", icon: "ri-factory-line" },
                { name: "ASOS", icon: "ri-community-line" },
                { name: "Toros Tarım", icon: "ri-tractor-line" },
                { name: "Çevik Grup", icon: "ri-factory-line" },
                { name: "Balküpü", icon: "ri-factory-line" },
                { name: "Türk Traktör", icon: "ri-tractor-line" }
            ];
        }
    }
    
    renderReferences() {
        if (this.track1) {
            this.track1.innerHTML = this.references.map(ref => this.createReferenceItem(ref)).join('');
        }
        if (this.track2) {
            this.track2.innerHTML = this.references.map(ref => this.createReferenceItem(ref)).join('');
        }
    }
    
    createReferenceItem(reference) {
        const icon = reference.icon || 'ri-factory-line';
        const logoHtml = reference.logo ? 
            `<img src="${reference.logo}" alt="${reference.name}" class="reference-logo-img">` : 
            `<i class="${icon}"></i>`;
        
        const linkHtml = reference.url ? 
            `<a href="${reference.url}" target="_blank" rel="noopener noreferrer" class="reference-link">` : 
            `<div class="reference-content">`;
        const closingTag = reference.url ? `</a>` : `</div>`;
        
        return `
            <div class="reference-item">
                ${linkHtml}
                    <div class="reference-logo">
                        ${logoHtml}
                        <span>${reference.name}</span>
                    </div>
                ${closingTag}
            </div>
        `;
    }
    
    cloneItems() {
        // Clone items for infinite scroll effect
        if (this.track1) {
            const items1 = this.track1.querySelectorAll('.reference-item');
            items1.forEach(item => {
                const clone = item.cloneNode(true);
                this.track1.appendChild(clone);
            });
        }
        
        if (this.track2) {
            const items2 = this.track2.querySelectorAll('.reference-item');
            items2.forEach(item => {
                const clone = item.cloneNode(true);
                this.track2.appendChild(clone);
            });
        }
    }
}

// Initialize sliders when DOM is loaded
function initializeSliders() {
    const heroSlider = new Slider('.hero-background', {
        interval: 5000,
        autoPlay: true
    });
    new ReferencesSlider();
}

// If components were already loaded, run immediately; otherwise wait for event
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // In case components loader fires an event later, attach one-time listener
    document.addEventListener('components:loaded', initializeSliders, { once: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('components:loaded', initializeSliders, { once: true });
    });
}
