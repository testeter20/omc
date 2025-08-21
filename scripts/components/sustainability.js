// Sustainability section interactions
(function () {
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
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', onScrollReveal);
	} else {
		onScrollReveal();
	}
	window.addEventListener('scroll', onScrollReveal);
})();
