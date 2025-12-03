/* ============================================
   BVCC Dynamic Content Loader
   Loads content from CMS API
   ============================================ */

// Load content when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadDynamicContent();
});

async function loadDynamicContent() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.success && data.content) {
            applyContent(data.content);
        }
    } catch (error) {
        console.error('Error loading content:', error);
        // Site will display default HTML content if API fails
    }
}

function applyContent(content) {
    // Hero Section
    if (content.hero) {
        const tagText = document.querySelector('.tag-text');
        const titleLine1 = document.querySelector('.hero-title .title-line:nth-child(1)');
        const titleLine2 = document.querySelector('.hero-title .title-line:nth-child(2)');
        const subtitle = document.querySelector('.hero-subtitle');
        const heroSection = document.querySelector('.hero');
        
        if (tagText && content.hero.tag) tagText.textContent = content.hero.tag;
        if (titleLine1 && content.hero.title1) titleLine1.textContent = content.hero.title1;
        if (titleLine2 && content.hero.title2) titleLine2.textContent = content.hero.title2;
        if (subtitle && content.hero.subtitle) subtitle.innerHTML = content.hero.subtitle;
        
        // Apply hero background image
        if (heroSection && content.hero.backgroundImage) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(26, 25, 24, 0.7), rgba(26, 25, 24, 0.7)), url('${content.hero.backgroundImage}')`;
        }
    }
    
    // About Section
    if (content.about) {
        const aboutTitle = document.querySelector('.about .section-title');
        const aboutLead = document.querySelector('.about-lead');
        const aboutP1 = document.querySelector('.about-content p:nth-of-type(1)');
        const aboutP2 = document.querySelector('.about-content p:nth-of-type(2)');
        
        if (aboutTitle && content.about.title) aboutTitle.innerHTML = content.about.title;
        if (aboutLead && content.about.lead) aboutLead.textContent = content.about.lead;
        if (aboutP1 && content.about.p1) aboutP1.textContent = content.about.p1;
        if (aboutP2 && content.about.p2) aboutP2.textContent = content.about.p2;
    }
    
    // Location Section
    if (content.location) {
        const locationTitle = document.querySelector('.location .section-title');
        const locationLead = document.querySelector('.location-lead');
        const locationText = document.querySelector('.location-content p:last-child');
        
        if (locationTitle && content.location.title) locationTitle.innerHTML = content.location.title;
        if (locationLead && content.location.lead) locationLead.textContent = content.location.lead;
        if (locationText && content.location.text) locationText.textContent = content.location.text;
    }
    
    // Fleet Section
    if (content.fleet) {
        const fleetTitle = document.querySelector('.fleet .section-title');
        const fleetIntro = document.querySelector('.fleet-intro');
        const fleetDetails = document.querySelector('.fleet-details p:nth-of-type(1)');
        const fleetNote = document.querySelector('.fleet-note');
        
        if (fleetTitle && content.fleet.title) fleetTitle.innerHTML = content.fleet.title;
        if (fleetIntro && content.fleet.intro) fleetIntro.textContent = content.fleet.intro;
        if (fleetDetails && content.fleet.details) fleetDetails.innerHTML = `<strong>${content.fleet.details.split(',')[0]}</strong>${content.fleet.details.substring(content.fleet.details.indexOf(','))}`;
        if (fleetNote && content.fleet.note) fleetNote.textContent = content.fleet.note;
        
        // Apply fleet car images
        if (content.fleet.cars && Array.isArray(content.fleet.cars)) {
            const fleetGallery = document.querySelector('.fleet-gallery');
            if (fleetGallery && content.fleet.cars.length > 0) {
                fleetGallery.innerHTML = ''; // Clear existing
                
                content.fleet.cars.forEach((car, index) => {
                    if (car.image || car.name) {
                        const carCard = document.createElement('div');
                        carCard.className = 'fleet-car';
                        carCard.innerHTML = `
                            <img src="${car.image || 'stock photos/placeholder.jpg'}" alt="${car.name || 'Car'}">
                            <h3>${car.name || ''}</h3>
                            ${car.description ? `<p>${car.description}</p>` : ''}
                        `;
                        fleetGallery.appendChild(carCard);
                    }
                });
            }
        }
    }
    
    // Membership Section
    if (content.membership) {
        const membershipTitle = document.querySelector('.membership .section-title');
        const membershipLead = document.querySelector('.membership-lead');
        
        if (membershipTitle && content.membership.title) membershipTitle.innerHTML = content.membership.title;
        if (membershipLead && content.membership.lead) membershipLead.textContent = content.membership.lead;
    }
}
