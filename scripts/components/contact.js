// Contact form -> open default mail client with prefilled content
(function () {
	function validateForm(form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();
		
		console.log('Form validation - Values:', { name, phone, email, subject, message });
		
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

		console.log('Building mailto - Form values:', { name, phone, email, subject, message });

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
		
		console.log('Mailto body:', body);
		
		return 'mailto:' + to +
			'?subject=' + encodeURIComponent(subjectText) +
			'&body=' + encodeURIComponent(body);
	}

	function buildWebMailUrl(service, form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();

		console.log('Building web mail URL - Form values:', { name, phone, email, subject, message });

		var to = 'makinaduru@gmail.com';
		var subjectText = '[Web İletişim] ' + subject;
		var body = 'Ad Soyad: ' + name + '\n' +
				  'E-posta: ' + email + '\n' +
				  'Telefon: ' + phone + '\n\n' +
				  'Mesaj:\n' + message;

		console.log('Web mail body:', body);

		if (service === 'gmail') {
			var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
				   '&su=' + encodeURIComponent(subjectText) +
				   '&body=' + encodeURIComponent(body);
			console.log('Gmail URL:', url);
			return url;
		} else if (service === 'outlook') {
			var url = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(to) +
				   '&subject=' + encodeURIComponent(subjectText) +
				   '&body=' + encodeURIComponent(body);
			console.log('Outlook URL:', url);
			return url;
		}
		return '';
	}

	function showWebMailPopup(form) {
		var popup = document.createElement('div');
		popup.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.5);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 10000;
		`;

		var content = document.createElement('div');
		content.style.cssText = `
			background: white;
			padding: 30px;
			border-radius: 10px;
			text-align: center;
			max-width: 400px;
			width: 90%;
			box-shadow: 0 10px 30px rgba(0,0,0,0.3);
		`;

		content.innerHTML = `
			<h3 style="margin: 0 0 20px 0; color: #333;">E-posta Uygulaması Seçin</h3>
			<p style="margin: 0 0 25px 0; color: #666;">Hangi e-posta servisini kullanmak istiyorsunuz?</p>
			<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
				<button id="gmail-btn" style="
					background: #ea4335;
					color: white;
					border: none;
					padding: 12px 24px;
					border-radius: 6px;
					cursor: pointer;
					font-size: 14px;
					font-weight: 500;
				">Gmail</button>
				<button id="outlook-btn" style="
					background: #0078d4;
					color: white;
					border: none;
					padding: 12px 24px;
					border-radius: 6px;
					cursor: pointer;
					font-size: 14px;
					font-weight: 500;
				">Outlook</button>
			</div>
			<button id="cancel-btn" style="
				background: #6b7280;
				color: white;
				border: none;
				padding: 10px 20px;
				border-radius: 6px;
				cursor: pointer;
				margin-top: 20px;
				font-size: 14px;
			">İptal</button>
		`;

		popup.appendChild(content);
		document.body.appendChild(popup);

		// Event listeners
		document.getElementById('gmail-btn').addEventListener('click', function() {
			console.log('Gmail button clicked');
			var url = buildWebMailUrl('gmail', form);
			window.open(url, '_blank');
			document.body.removeChild(popup);
		});

		document.getElementById('outlook-btn').addEventListener('click', function() {
			console.log('Outlook button clicked');
			var url = buildWebMailUrl('outlook', form);
			window.open(url, '_blank');
			document.body.removeChild(popup);
		});

		document.getElementById('cancel-btn').addEventListener('click', function() {
			document.body.removeChild(popup);
		});

		// Close on outside click
		popup.addEventListener('click', function(e) {
			if (e.target === popup) {
				document.body.removeChild(popup);
			}
		});
	}

	function isMobileDevice() {
		return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function openMailClient(mailtoHref, form) {
		console.log('Opening mail client, mobile device:', isMobileDevice());
		
		// On mobile, try mailto first
		if (isMobileDevice()) {
			var a = document.createElement('a');
			a.href = mailtoHref;
			a.style.display = 'none';
			document.body.appendChild(a);
			
			var mailtoOpened = false;
			
			// Check if mailto worked by monitoring if the page loses focus or if a timeout occurs
			var timeout = setTimeout(function() {
				if (!mailtoOpened) {
					console.log('Mailto failed, showing popup');
					showWebMailPopup(form);
				}
			}, 1000);

			// Listen for window blur (indicates mail app opened)
			var originalOnBlur = window.onblur;
			window.onblur = function() {
				mailtoOpened = true;
				clearTimeout(timeout);
				window.onblur = originalOnBlur;
			};

			try {
				a.click();
			} finally {
				setTimeout(function() { 
					document.body.removeChild(a); 
				}, 0);
			}
		} else {
			// On desktop/web, show popup directly
			console.log('Desktop detected, showing popup directly');
			showWebMailPopup(form);
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		console.log('Form submitted');
		
		var form = event.target;
		
		if (!validateForm(form)) {
			console.log('Form validation failed');
			return;
		}
		
		console.log('Form validation passed, building mailto');
		var mailtoHref = buildMailto(form);
		openMailClient(mailtoHref, form);
		
		// Clear form after a delay
		setTimeout(function() {
			if (form && form.reset) form.reset();
		}, 2000);
	}

	function init() {
		console.log('Contact form initializing...');
		var form = document.getElementById('contactForm');
		if (form) {
			console.log('Contact form found, adding event listener');
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
		} else {
			console.log('Contact form not found');
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
