// Image Modal Functions
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.style.display = 'block';
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside the image
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    };
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Initialize busnies slider functionality
function initBusniesSlider() {
    const slider = document.getElementById('busnies-slider');
    
    if (!slider) return;
    
    // Pause animation on hover
    slider.addEventListener('mouseenter', function() {
        slider.classList.add('paused');
    });
    
    slider.addEventListener('mouseleave', function() {
        slider.classList.remove('paused');
    });
    
    // Pause animation on touch devices
    slider.addEventListener('touchstart', function() {
        slider.classList.add('paused');
    });
    
    slider.addEventListener('touchend', function() {
        setTimeout(() => {
            slider.classList.remove('paused');
        }, 2000);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBusniesSlider();
});

// Re-initialize after components are loaded
document.addEventListener('components:loaded', function() {
    initBusniesSlider();
});
