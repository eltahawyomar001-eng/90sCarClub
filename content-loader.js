/* ============================================
   BVCC Content Loader - FULL CMS MODE
   
   Client can edit via admin panel (/admin.html):
   - Logo
   - Hero section text
   - About section text
   - Location section text
   - Fleet section text
   - Membership section text
   - Contact info (email, phone, address, hours)
   
   Design/styling stays from CSS (not editable by client)
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
});

async function loadContent() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.success && data.content) {
            const content = data.content;
            
            // Apply logo
            if (content.branding && content.branding.logo) {
                applyLogo(content.branding.logo);
            }
            
            // Apply section content
            if (content.hero) applyHero(content.hero);
            if (content.about) applyAbout(content.about);
            if (content.location) applyLocation(content.location);
            if (content.fleet) applyFleet(content.fleet);
            if (content.membership) applyMembership(content.membership);
            if (content.contact) applyContactInfo(content.contact);
        }
    } catch (error) {
        console.log('Using default content from HTML');
    }
}

function applyLogo(logoUrl) {
    if (!logoUrl || logoUrl.trim() === '') return;
    
    // Only apply if it's a valid image URL
    const url = logoUrl.trim().toLowerCase();
    const isValidImage = (
        (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('logos/')) &&
        (url.includes('.svg') || url.includes('.png') || url.includes('.jpg') || 
         url.includes('.jpeg') || url.includes('.webp') || url.includes('blob.vercel-storage.com'))
    );
    
    if (isValidImage) {
        document.querySelectorAll('.nav-logo-img, .loader-logo, .footer-logo-img').forEach(img => {
            if (img.tagName === 'IMG') {
                img.src = logoUrl;
            }
        });
    }
}

function applyHero(hero) {
    if (hero.title1) {
        const line1 = document.querySelector('.hero-title .title-line:first-child');
        if (line1) line1.textContent = hero.title1;
    }
    if (hero.title2) {
        const line2 = document.querySelector('.hero-title .title-line:last-child');
        if (line2) line2.textContent = hero.title2;
    }
    if (hero.subtitle) {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) subtitle.innerHTML = hero.subtitle;
    }
}

function applyAbout(about) {
    const section = document.querySelector('.about');
    if (!section) return;
    
    if (about.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = about.title;
    }
    if (about.lead) {
        const lead = section.querySelector('.about-lead');
        if (lead) lead.textContent = about.lead;
    }
    // Apply additional paragraphs
    const paragraphs = section.querySelectorAll('.about-content p:not(.about-lead)');
    if (about.p1 && paragraphs[0]) paragraphs[0].textContent = about.p1;
    if (about.p2 && paragraphs[1]) paragraphs[1].textContent = about.p2;
    if (about.p3 && paragraphs[2]) paragraphs[2].textContent = about.p3;
}

function applyLocation(location) {
    const section = document.querySelector('.location');
    if (!section) return;
    
    if (location.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = location.title;
    }
    if (location.lead) {
        const lead = section.querySelector('.location-lead');
        if (lead) lead.textContent = location.lead;
    }
    if (location.text) {
        const text = section.querySelector('.location-content p:not(.location-lead)');
        if (text) text.textContent = location.text;
    }
}

function applyFleet(fleet) {
    const section = document.querySelector('.fleet');
    if (!section) return;
    
    if (fleet.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = fleet.title;
    }
    if (fleet.intro) {
        const intro = section.querySelector('.fleet-intro');
        if (intro) intro.textContent = fleet.intro;
    }
    if (fleet.details) {
        const details = section.querySelector('.fleet-details p:first-child');
        if (details) details.textContent = fleet.details;
    }
    if (fleet.note) {
        const note = section.querySelector('.fleet-note');
        if (note) note.textContent = fleet.note;
    }
}

function applyMembership(membership) {
    const section = document.querySelector('.membership');
    if (!section) return;
    
    if (membership.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = membership.title;
    }
    if (membership.lead) {
        const lead = section.querySelector('.membership-lead');
        if (lead) lead.textContent = membership.lead;
    }
}

function applyContactInfo(contact) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    if (contact.email) {
        footer.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.href = `mailto:${contact.email}`;
        });
        const emailDisplay = footer.querySelector('.contact-email-display');
        if (emailDisplay) {
            emailDisplay.innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
        }
    }
    
    if (contact.phone) {
        const phoneEl = footer.querySelector('.contact-phone');
        if (phoneEl) phoneEl.innerHTML = `<a href="tel:${contact.phone}">${contact.phone}</a>`;
    }
    
    if (contact.address) {
        const addressEl = footer.querySelector('.contact-address');
        if (addressEl) addressEl.textContent = contact.address;
    }
    
    if (contact.hours) {
        const hoursEl = footer.querySelector('.contact-hours');
        if (hoursEl) hoursEl.textContent = contact.hours;
    }
}

