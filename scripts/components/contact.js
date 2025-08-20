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

	function handleSubmit(event) {
		event.preventDefault();
		var form = event.target;
		
		if (!validateForm(form)) {
			return;
		}
		
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();

		var to = 'makinaduru@gmail.com';
		var subjectText = '[Web İletişim] ' + subject;
		var lines = [
			'Gönderen: ' + name,
			'E-posta: ' + email,
			'Telefon: ' + phone,
			'',
			'Mesaj:',
			message
		];
		var body = lines.join('\n');
		
		try {
			var mailto = 'mailto:' + encodeURIComponent(to) +
				'?subject=' + encodeURIComponent(subjectText) +
				'&body=' + encodeURIComponent(body);

			// For mobile devices, try to open mail app
			if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				// Mobile device - try to open mail app
				window.location.href = mailto;
			} else {
				// Desktop - open default mail client
				window.open(mailto, '_blank');
			}
			
			// Show success message
			setTimeout(function() {
				alert('E-posta uygulamanız açılıyor. E-posta gönderildikten sonra formu temizlemek istiyor musunuz?');
				if (confirm('Formu temizlemek istiyor musunuz?')) {
					form.reset();
				}
			}, 1000);
			
		} catch (error) {
			console.error('Mailto link error:', error);
			alert('E-posta uygulaması açılamadı. Lütfen manuel olarak makinaduru@gmail.com adresine e-posta gönderin.');
		}
	}

	function init() {
		var form = document.getElementById('contactForm');
		if (form) {
			form.addEventListener('submit', handleSubmit);
			
			// Add input validation on blur
			var inputs = form.querySelectorAll('input, textarea');
			inputs.forEach(function(input) {
				input.addEventListener('blur', function() {
					if (this.hasAttribute('required') && !this.value.trim()) {
						this.style.borderColor = '#ef4444';
					} else {
						this.style.borderColor = '';
					}
				});
				
				input.addEventListener('input', function() {
					if (this.style.borderColor === 'rgb(239, 68, 68)') {
						this.style.borderColor = '';
					}
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
