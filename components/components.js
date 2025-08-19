/**
 * Component Loader - Bileşen Yükleyici
 * Bu dosya tüm HTML bileşenlerini dinamik olarak yükler
 */

// Bileşen yükleme fonksiyonu
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        } else {
            console.error(`Element with id '${elementId}' not found`);
        }
    } catch (error) {
        console.error(`Error loading component from ${componentPath}:`, error);
    }
}

// Tüm bileşenleri yükle
async function loadAllComponents() {
    // Header ve Footer bileşenleri
    await loadComponent('header-component', 'components/header.html');
    await loadComponent('footer-component', 'components/footer.html');
    
    // Section bileşenleri
    await loadComponent('hero-component', 'pages/sections/hero.html');
    await loadComponent('about-component', 'pages/sections/about.html');
    await loadComponent('vision-mission-component', 'pages/sections/vision-mission.html');
    await loadComponent('services-component', 'pages/sections/services.html');
    await loadComponent('busnies-component', 'pages/sections/busnies.html');
    await loadComponent('references-component', 'pages/sections/references.html');
    await loadComponent('equipment-component', 'pages/sections/equipment.html');
    await loadComponent('contact-component', 'pages/sections/contact.html');

    // Dispatch event after all components are loaded so sliders can initialize safely
    document.dispatchEvent(new Event('components:loaded'));
}

// Sayfa yüklendiğinde bileşenleri yükle
document.addEventListener('DOMContentLoaded', loadAllComponents);
