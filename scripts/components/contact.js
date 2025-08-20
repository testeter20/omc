// Contact form -> open default mail client with prefilled content
(function () {
	function validateForm(form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();
		
		if (!name || !phone || !email || !subject || !message) {
			alert('Lütfen tüm alanları doldurun.');
			return false;
		}
		
		// Basic email validation
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert('Lütfen geçerli bir e-posta adresi girin.');
			return false;
		}
		
		return true;
	}

	function buildMailto(form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();

		var to = 'makinaduru@gmail.com';
		var subjectText = '[Web İletişim] ' + subject;
		var lines = [
			'Ad Soyad: ' + name,
			'E-posta: ' + email,
			'Telefon: ' + phone,
			'',
			'Mesaj:',
			message
		];
		var body = lines.join('\n');
		return 'mailto:' + to +
			'?subject=' + encodeURIComponent(subjectText) +
			'&body=' + encodeURIComponent(body);
	}

	function openMailClient(mailtoHref) {
		// Preferred: use a temporary anchor click (best for iOS/desktop)
		var a = document.createElement('a');
		a.href = mailtoHref;
		a.style.display = 'none';
		document.body.appendChild(a);
		try {
			a.click();
		} finally {
			setTimeout(function() { document.body.removeChild(a); }, 0);
		}

		// Fallbacks by platform
		var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		if (isMobile) {
			// On some Android builds, anchor click might not trigger; try direct navigation
			setTimeout(function() {
				window.location.href = mailtoHref;
			}, 50);
		} else {
			// Desktop fallback: open in a new tab (some clients capture it)
			setTimeout(function() {
				window.open(mailtoHref, '_blank');
			}, 50);
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		var form = event.target;
		
		if (!validateForm(form)) {
			return;
		}
		
		var mailtoHref = buildMailto(form);
		openMailClient(mailtoHref);
		
		// Do not show blocking alerts; optionally clear the form after a short delay
		setTimeout(function() {
			if (form && form.reset) form.reset();
		}, 1500);
	}

	function init() {
		var form = document.getElementById('contactForm');
		if (form) {
			form.addEventListener('submit', handleSubmit);
			
			// Add input validation styles
			var inputs = form.querySelectorAll('input[required], textarea[required]');
			inputs.forEach(function(input) {
				input.addEventListener('invalid', function() {
					this.style.borderColor = '#ef4444';
				}, false);
				input.addEventListener('input', function() {
					this.style.borderColor = '';
				});
			});
		}
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
	
	// Also initialize when components are loaded
	document.addEventListener('components:loaded', init);
})();
