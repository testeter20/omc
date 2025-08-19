// Busnies (Work) Slider - Click to pause/resume only
(function(){
	function initBusniesSliderControls() {
		const wrapper = document.getElementById('busnies-slider');
		if (!wrapper) return;

		let isPaused = false;
		function pause() { if (isPaused) return; isPaused = true; wrapper.classList.add('paused'); }
		function resume() { if (!isPaused) return; isPaused = false; wrapper.classList.remove('paused'); }

		// Remove hover pause; only click toggles
		wrapper.addEventListener('click', () => { isPaused ? resume() : pause(); });
	}

	// Ensure after components are loaded
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		document.addEventListener('components:loaded', initBusniesSliderControls, { once: true });
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			document.addEventListener('components:loaded', initBusniesSliderControls, { once: true });
		});
	}
})();
