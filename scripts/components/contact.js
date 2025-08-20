// Contact form -> open default mail client with prefilled content
(function () {
	function handleSubmit(event) {
		event.preventDefault();
		var form = event.target;
		var name = (form.querySelector('#name') || {}).value || '';
		var phone = (form.querySelector('#phone') || {}).value || '';
		var email = (form.querySelector('#email') || {}).value || '';
		var subject = (form.querySelector('#subject') || {}).value || 'Web İletişim';
		var message = (form.querySelector('#message') || {}).value || '';

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
		var mailto = 'mailto:' + encodeURIComponent(to) +
			'?subject=' + encodeURIComponent(subjectText) +
			'&body=' + encodeURIComponent(body);

		window.location.href = mailto;
	}

	function init() {
		var form = document.getElementById('contactForm');
		if (form) {
			form.addEventListener('submit', handleSubmit);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
