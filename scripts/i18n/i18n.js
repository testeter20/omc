(function () {
	// Determine initial language: URL ?lang overrides storage/navigator
	var currentLang = (function () {
		try {
			var urlLang = null;
			try {
				urlLang = new URLSearchParams(window.location.search).get('lang');
			} catch (_) {}
			return (urlLang || localStorage.getItem('lang') || (navigator.language || 'tr').slice(0, 2) || 'tr').slice(0,2);
		} catch (_) {
			return 'tr';
		}
	})();

	var translations = {};

	// --- SEO helpers ---
	function upsertMetaByName(name, content) {
		var meta = document.querySelector('meta[name="' + name + '"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.setAttribute('name', name);
			document.head.appendChild(meta);
		}
		if (content != null) meta.setAttribute('content', content);
		return meta;
	}

	function upsertMetaByProperty(prop, content) {
		var meta = document.querySelector('meta[property="' + prop + '"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.setAttribute('property', prop);
			document.head.appendChild(meta);
		}
		if (content != null) meta.setAttribute('content', content);
		return meta;
	}

	function upsertLinkRel(rel, attrs) {
		var link = document.querySelector('link[rel="' + rel + '"]' + (attrs && attrs.hreflang ? '[hreflang="' + attrs.hreflang + '"]' : ''));
		if (!link) {
			link = document.createElement('link');
			link.setAttribute('rel', rel);
			document.head.appendChild(link);
		}
		if (attrs) {
			Object.keys(attrs).forEach(function (k) {
				link.setAttribute(k, attrs[k]);
			});
		}
		return link;
	}

	function absoluteUrl(pathOrUrl) {
		try {
			var u = new URL(pathOrUrl, window.location.origin);
			return u.href;
		} catch (_) {
			return window.location.origin + pathOrUrl;
		}
	}

	function updateJsonLd() {
		var id = 'org-jsonld';
		var script = document.getElementById(id);
		var data = {
			"@context": "https:\/\/schema.org",
			"@type": "Organization",
			"name": "Duru Makina Mühendislik",
			"url": window.location.origin + window.location.pathname,
			"logo": absoluteUrl('/assets/brand/logo.png'),
			"sameAs": [
				"https:\/\/www.facebook.com\/people\/Duru-Makina\/pfbid0NPhT2vdvpuJViotJgcrDExzVBFHrJZL9MS4nxUyJFEDTQyZd2BMnSphN5WZ9AaTbl\/",
				"https:\/\/www.instagram.com\/durumakina\/"
			],
			"contactPoint": [{
				"@type": "ContactPoint",
				"telephone": "+90 532 012 65 55",
				"contactType": "customer service",
				"areaServed": "TR"
			}]
		};
		var json = JSON.stringify(data);
		if (!script) {
			script = document.createElement('script');
			script.type = 'application\/ld+json';
			script.id = id;
			script.text = json;
			document.head.appendChild(script);
		} else {
			script.text = json;
		}
	}

	function updateCanonicalAndHreflang(lang) {
		var baseUrl = window.location.origin + window.location.pathname;
		var urlTr = baseUrl + '?lang=tr';
		var urlEn = baseUrl + '?lang=en';
		var canonicalUrl = lang === 'en' ? urlEn : urlTr;
		upsertLinkRel('canonical', { href: canonicalUrl });
		upsertLinkRel('alternate', { hreflang: 'tr', href: urlTr });
		upsertLinkRel('alternate', { hreflang: 'en', href: urlEn });
		upsertLinkRel('alternate', { hreflang: 'x-default', href: baseUrl });
	}

	function updateOgTwitter(lang, title, description) {
		var baseUrl = window.location.origin + window.location.pathname + (lang ? ('?lang=' + lang) : '');
		upsertMetaByProperty('og:type', 'website');
		upsertMetaByProperty('og:title', title);
		upsertMetaByProperty('og:description', description);
		upsertMetaByProperty('og:url', baseUrl);
		upsertMetaByProperty('og:image', absoluteUrl('/assets/brand/card.jpeg'));
		upsertMetaByProperty('og:locale', lang === 'en' ? 'en_US' : 'tr_TR');

		upsertMetaByName('twitter:card', 'summary_large_image');
		upsertMetaByName('twitter:title', title);
		upsertMetaByName('twitter:description', description);
		upsertMetaByName('twitter:image', absoluteUrl('/assets/brand/card.jpeg'));
	}

	function updateSeoForLang(lang) {
		var seoTitle = get(translations, 'seo.title', document.title || 'Duru Makina Mühendislik');
		var seoDesc = get(translations, 'seo.description', 'Endüstriyel kumlama, boyama, çelik imalat ve montaj hizmetleri.');
		// Title & meta description
		document.title = seoTitle;
		upsertMetaByName('description', seoDesc);
		// Canonical + hreflang
		updateCanonicalAndHreflang(lang);
		// OG & Twitter
		updateOgTwitter(lang, seoTitle, seoDesc);
		// JSON-LD
		updateJsonLd();
	}

	function loadTranslations(lang) {
		return fetch('data/i18n/' + lang + '.json')
			.then(function (res) { return res.ok ? res.json() : {}; })
			.then(function (json) { translations = json || {}; })
			.catch(function () { translations = {}; });
	}

	function get(obj, path, fallback) {
		return path.split('.').reduce(function (acc, key) {
			return acc && acc[key] != null ? acc[key] : undefined;
		}, obj) ?? fallback;
	}

	function translateElement(el) {
		var key = el.getAttribute('data-i18n');
		if (key) {
			var text = get(translations, key, null);
			if (text != null) el.textContent = text;
		}

		var placeholderKey = el.getAttribute('data-i18n-placeholder');
		if (placeholderKey) {
			var p = get(translations, placeholderKey, null);
			if (p != null) el.setAttribute('placeholder', p);
		}

		var titleKey = el.getAttribute('data-i18n-title');
		if (titleKey) {
			var t = get(translations, titleKey, null);
			if (t != null) el.setAttribute('title', t);
		}

		var valueKey = el.getAttribute('data-i18n-value');
		if (valueKey) {
			var v = get(translations, valueKey, null);
			if (v != null) el.setAttribute('value', v);
		}
	}

	function applyTranslations(root) {
		var scope = root || document;
		var elements = scope.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-value]');
		elements.forEach(translateElement);
	}

	function setActiveLangUI(lang) {
		var html = document.documentElement;
		html.setAttribute('lang', lang);
		// Minimal toggle button shows the opposite language label
		var toggle = document.getElementById('lang-toggle');
		if (toggle) {
			toggle.textContent = lang === 'tr' ? 'EN' : 'TR';
			toggle.setAttribute('aria-label', 'Change language to ' + (lang === 'tr' ? 'English' : 'Turkish'));
		}
	}

	function setLanguage(lang) {
		currentLang = lang;
		try { localStorage.setItem('lang', lang); } catch (_) {}
		// Reflect ?lang in URL without reload
		try {
			var usp = new URLSearchParams(window.location.search);
			usp.set('lang', lang);
			history.replaceState(null, '', window.location.pathname + '?' + usp.toString());
		} catch (_) {}
		return loadTranslations(lang).then(function () {
			applyTranslations();
			setActiveLangUI(lang);
			updateSeoForLang(lang);
			document.dispatchEvent(new CustomEvent('language:changed', { detail: { lang: lang } }));
		});
	}

	function getLanguage() { return currentLang; }

	// Public API
	window.i18n = {
		setLanguage: setLanguage,
		getLanguage: getLanguage,
		applyTranslations: applyTranslations
	};

	// Toggle button click -> set opposite language
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('#lang-toggle');
		if (btn) {
			e.preventDefault();
			var next = (currentLang === 'tr') ? 'en' : 'tr';
			setLanguage(next);
		}
	});

	// Initialize: load translations, then apply after components load
	loadTranslations(currentLang).then(function () {
		setActiveLangUI(currentLang);
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function () {
				// Apply once in case static markup exists
				applyTranslations();
				updateSeoForLang(currentLang);
			});
		} else {
			applyTranslations();
			updateSeoForLang(currentLang);
		}
	});

	// Re-apply after components are injected
	document.addEventListener('components:loaded', function () {
		applyTranslations();
		setActiveLangUI(currentLang);
		updateSeoForLang(currentLang);
	});
})();


