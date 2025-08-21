// Sustainability section interactions
(function () {
	var scrollHandler = null;
	
	function onScrollReveal() {
		var elements = document.querySelectorAll('.sustainability .reveal');
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;
		elements.forEach(function (el) {
			var rect = el.getBoundingClientRect();
			if (rect.top < windowHeight - 60) {
				el.classList.add('visible');
			}
		});
	}
	
	function initScrollReveal() {
		onScrollReveal();
		
		// Throttle scroll events for better performance
		if (!scrollHandler) {
			var ticking = false;
			scrollHandler = function() {
				if (!ticking) {
					requestAnimationFrame(function() {
						onScrollReveal();
						ticking = false;
					});
					ticking = true;
				}
			};
			window.addEventListener('scroll', scrollHandler, { passive: true });
		}
	}
	
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initScrollReveal);
	} else {
		initScrollReveal();
	}
})();
