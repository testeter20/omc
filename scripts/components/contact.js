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

	function buildWebMailUrl(service, form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();



		var to = 'makinaduru@gmail.com';
		var subjectText = '[Web İletişim] ' + subject;
		var body = 'Ad Soyad: ' + name + '\n' +
				  'E-posta: ' + email + '\n' +
				  'Telefon: ' + phone + '\n\n' +
				  'Mesaj:\n' + message;



		if (service === 'gmail') {
			var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
				   '&su=' + encodeURIComponent(subjectText) +
				   '&body=' + encodeURIComponent(body);

			return url;
		} else if (service === 'outlook') {
			var url = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(to) +
				   '&subject=' + encodeURIComponent(subjectText) +
				   '&body=' + encodeURIComponent(body);

			return url;
		}
		return '';
	}

	function showWebMailPopup(form) {
		var overlay = document.createElement('div');
		overlay.className = 'modal-overlay';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');

		var content = document.createElement('div');
		content.className = 'email-modal';
		content.setAttribute('role', 'document');
		content.innerHTML = `
			<h3 id="email-modal-title" class="email-modal__title">E-posta Uygulaması Seçin</h3>
			<p class="email-modal__subtitle">Hangi e-posta servisini kullanmak istiyorsunuz?</p>
			<div class="email-modal__services">
				<button id="gmail-btn" class="email-modal__btn email-modal__btn--gmail">
					<i class="ri-google-fill email-modal__icon" aria-hidden="true"></i>
					<span>Gmail</span>
				</button>
				<button id="outlook-btn" class="email-modal__btn email-modal__btn--outlook">
					<i class="ri-microsoft-fill email-modal__icon" aria-hidden="true"></i>
					<span>Outlook</span>
				</button>
			</div>
			<button id="cancel-btn" class="email-modal__close">İptal</button>
		`;

		overlay.appendChild(content);
		document.body.appendChild(overlay);

		function closeModal() {
			if (overlay && overlay.parentNode) {
				overlay.parentNode.removeChild(overlay);
			}
			document.removeEventListener('keydown', onKeyDown);
		}

		function onKeyDown(e) {
			if (e.key === 'Escape') {
				closeModal();
			}
		}

		// Event listeners
		document.getElementById('gmail-btn').addEventListener('click', function() {
			var url = buildWebMailUrl('gmail', form);
			window.open(url, '_blank');
			closeModal();
		});

		document.getElementById('outlook-btn').addEventListener('click', function() {
			var url = buildWebMailUrl('outlook', form);
			window.open(url, '_blank');
			closeModal();
		});

		document.getElementById('cancel-btn').addEventListener('click', function() {
			closeModal();
		});

		// Close on outside click
		overlay.addEventListener('click', function(e) {
			if (e.target === overlay) {
				closeModal();
			}
		});

		// Prevent clicks inside content from closing
		content.addEventListener('click', function(e) {
			e.stopPropagation();
		});

		// Focus first action
		var firstBtn = document.getElementById('gmail-btn');
		if (firstBtn) firstBtn.focus();

		// Keyboard handling
		document.addEventListener('keydown', onKeyDown);
	}

	function isMobileDevice() {
		return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function openMailClient(mailtoHref, form) {
		
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
			showWebMailPopup(form);
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		
		var form = event.target;
		
		if (!validateForm(form)) {
			return;
		}
		var mailtoHref = buildMailto(form);
		openMailClient(mailtoHref, form);
		
		// Clear form after a delay
		setTimeout(function() {
			if (form && form.reset) form.reset();
		}, 2000);
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
