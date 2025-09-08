// Contact form -> Formspree integration
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

	function showStatusMessage(form, type, message) {
		// Remove existing status message
		var existingStatus = form.querySelector('.form-status');
		if (existingStatus) {
			existingStatus.remove();
		}

		// Create new status message
		var statusDiv = document.createElement('div');
		statusDiv.className = 'form-status form-status--' + type;
		
		var icon = type === 'success' ? 'ri-check-line' : 'ri-error-warning-line';
		statusDiv.innerHTML = `
			<i class="${icon} form-status__icon"></i>
			<span class="form-status__text">${message}</span>
		`;

		// Add to form
		form.appendChild(statusDiv);
		
		// Show with animation
		setTimeout(() => {
			statusDiv.classList.add('show');
		}, 10);

		// Auto hide success message after 5 seconds
		if (type === 'success') {
			setTimeout(() => {
				statusDiv.classList.remove('show');
				setTimeout(() => {
					if (statusDiv.parentNode) {
						statusDiv.remove();
					}
				}, 300);
			}, 5000);
		}
	}

	async function submitToFormspree(form) {
		var name = form.querySelector('#name').value.trim();
		var phone = form.querySelector('#phone').value.trim();
		var email = form.querySelector('#email').value.trim();
		var subject = form.querySelector('#subject').value.trim();
		var message = form.querySelector('#message').value.trim();

		var formData = new FormData();
		formData.append('name', name);
		formData.append('phone', phone);
		formData.append('email', email);
		formData.append('subject', subject);
		formData.append('message', message);

		try {
			const response = await fetch('https://formspree.io/f/xpwjkvdg', {
				method: 'POST',
				body: formData,
				headers: {
					'Accept': 'application/json'
				}
			});

			if (response.ok) {
				showStatusMessage(form, 'success', 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
				form.reset();
			} else {
				const data = await response.json();
				if (data.errors) {
					showStatusMessage(form, 'error', 'Hata: ' + data.errors.map(error => error.message).join(', '));
				} else {
					showStatusMessage(form, 'error', 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
				}
			}
		} catch (error) {
			console.error('Hata:', error);
			showStatusMessage(form, 'error', 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		
		var form = event.target;
		
		if (!validateForm(form)) {
			return;
		}
		
		// Submit to Formspree
		submitToFormspree(form);
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
