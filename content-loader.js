/* ============================================
   BVCC Content Loader - FULL CMS MODE
   
   Client can edit via admin panel (/admin.html):
   - Logo
   - Hero section text + background image
   - About section text + image
   - Location section text + image
   - Fleet section text + gallery images
   - Membership section text + image
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
            if (content.waitlist) applyWaitlist(content.waitlist);
            if (content.contact) applyContactInfo(content.contact);
            if (content.footer) applyFooter(content.footer);
            
            // Apply gallery images
            if (content.gallery) applyGallery(content.gallery);
        }
    } catch (error) {
        console.log('Using default content from HTML');
    }
}

function isValidImageUrl(url) {
    if (!url || url.trim() === '') return false;
    const u = url.trim().toLowerCase();
    return (
        (u.startsWith('http://') || u.startsWith('https://') || 
         u.startsWith('stock photos/') || u.startsWith('logos/')) &&
        (u.includes('.svg') || u.includes('.png') || u.includes('.jpg') || 
         u.includes('.jpeg') || u.includes('.webp') || u.includes('.gif') ||
         u.includes('blob.vercel-storage.com'))
    );
}

function applyLogo(logoUrl) {
    if (!isValidImageUrl(logoUrl)) return;
    
    document.querySelectorAll('.nav-logo-img, .loader-logo, .footer-logo-img').forEach(img => {
        if (img.tagName === 'IMG') {
            img.src = logoUrl;
        }
    });
}

function applyHero(hero) {
    // Text content
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
    
    // Background image - DISABLED, using solid dark bg with car image below
    // Hero car image is now a separate element, not a background
}

function applyAbout(about) {
    const section = document.querySelector('.about');
    if (!section) return;
    
    // Section tag
    if (about.tag) {
        const tag = section.querySelector('.section-tag');
        if (tag) tag.textContent = about.tag;
    }
    
    // Text content
    if (about.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = about.title;
    }
    if (about.lead) {
        const lead = section.querySelector('.about-lead');
        if (lead) lead.textContent = about.lead;
    }
    const paragraphs = section.querySelectorAll('.about-content p:not(.about-lead)');
    if (about.p1 && paragraphs[0]) paragraphs[0].textContent = about.p1;
    if (about.p2 && paragraphs[1]) paragraphs[1].textContent = about.p2;
    if (about.p3 && paragraphs[2]) paragraphs[2].textContent = about.p3;
    
    // Image
    if (about.image && isValidImageUrl(about.image)) {
        const img = section.querySelector('.about-img');
        if (img) img.src = about.image;
    }
}

function applyLocation(location) {
    const section = document.querySelector('.location');
    if (!section) return;
    
    // Section tag
    if (location.tag) {
        const tag = section.querySelector('.section-tag');
        if (tag) tag.textContent = location.tag;
    }
    
    // Text content
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
    
    // Image
    if (location.image && isValidImageUrl(location.image)) {
        const img = section.querySelector('.location-img');
        if (img) img.src = location.image;
    }
}

function applyFleet(fleet) {
    const section = document.querySelector('.fleet');
    if (!section) return;
    
    // Section tag
    if (fleet.tag) {
        const tag = section.querySelector('.section-tag');
        if (tag) tag.textContent = fleet.tag;
    }
    
    // Text content
    if (fleet.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = fleet.title;
    }
    if (fleet.intro) {
        const intro = section.querySelector('.fleet-intro');
        if (intro) intro.textContent = fleet.intro;
    }
    if (fleet.listTitle) {
        const listTitle = section.querySelector('.fleet-list-title');
        if (listTitle) listTitle.textContent = fleet.listTitle;
    }
    if (fleet.details) {
        const introText = section.querySelector('.fleet-intro-text');
        if (introText) introText.textContent = fleet.details;
    }
    
    // Car brands (new individual fields)
    if (fleet.carBrands) {
        const carListEl = section.querySelector('.fleet-car-list');
        if (carListEl) {
            let html = '';
            const brands = fleet.carBrands;
            if (brands.porsche) html += `<p><strong>Porsche:</strong> ${brands.porsche}</p>`;
            if (brands.bmw) html += `<p><strong>BMW:</strong> ${brands.bmw}</p>`;
            if (brands.mercedes) html += `<p><strong>Mercedes:</strong> ${brands.mercedes}</p>`;
            if (brands.ferrari) html += `<p><strong>Ferrari:</strong> ${brands.ferrari}</p>`;
            if (brands.aston) html += `<p><strong>Aston Martin:</strong> ${brands.aston}</p>`;
            if (brands.japanese) html += `<p><strong>Acura/Honda/Nissan:</strong> ${brands.japanese}</p>`;
            if (brands.otherBrand && brands.otherModels) {
                html += `<p><strong>${brands.otherBrand}:</strong> ${brands.otherModels}</p>`;
            }
            if (html) carListEl.innerHTML = html;
        }
    }
    // Legacy support for old carList HTML field
    else if (fleet.carList) {
        const carListEl = section.querySelector('.fleet-car-list');
        if (carListEl) carListEl.innerHTML = fleet.carList;
    }
    
    if (fleet.note) {
        const note = section.querySelector('.fleet-note');
        if (note) note.textContent = fleet.note;
    }
    
    // Fleet gallery images (new galleryImages array)
    if (fleet.galleryImages && Array.isArray(fleet.galleryImages)) {
        const galleryImages = section.querySelectorAll('.fleet-gallery-simple .gallery-item img');
        fleet.galleryImages.forEach((imgUrl, index) => {
            if (galleryImages[index] && isValidImageUrl(imgUrl)) {
                galleryImages[index].src = imgUrl;
            }
        });
    }
    // Legacy support for old 'images' key
    else if (fleet.images && Array.isArray(fleet.images)) {
        const galleryImages = section.querySelectorAll('.fleet-gallery-simple .gallery-item img');
        fleet.images.forEach((imgUrl, index) => {
            if (galleryImages[index] && isValidImageUrl(imgUrl)) {
                galleryImages[index].src = imgUrl;
            }
        });
    }
}

function applyMembership(membership) {
    const section = document.querySelector('.membership');
    if (!section) return;
    
    // Section tag
    if (membership.tag) {
        const tag = section.querySelector('.section-tag');
        if (tag) tag.textContent = membership.tag;
    }
    
    // Text content
    if (membership.title) {
        const title = section.querySelector('.section-title');
        if (title) title.innerHTML = membership.title;
    }
    if (membership.lead) {
        const lead = section.querySelector('.membership-lead');
        if (lead) lead.textContent = membership.lead;
    }
    
    // Image
    if (membership.image && isValidImageUrl(membership.image)) {
        const img = section.querySelector('.membership-img');
        if (img) img.src = membership.image;
    }
}

function applyWaitlist(waitlist) {
    const section = document.querySelector('.waitlist');
    if (!section) return;
    
    // Section tag
    if (waitlist.tag) {
        const tag = section.querySelector('.section-tag');
        if (tag) tag.textContent = waitlist.tag;
    }
}

function applyGallery(gallery) {
    // Apply images to main gallery if exists
    if (gallery.images && Array.isArray(gallery.images)) {
        const galleryItems = document.querySelectorAll('.gallery-item img, .fleet-gallery-simple .gallery-item img');
        gallery.images.forEach((imgData, index) => {
            if (galleryItems[index]) {
                if (typeof imgData === 'string' && isValidImageUrl(imgData)) {
                    galleryItems[index].src = imgData;
                } else if (imgData.url && isValidImageUrl(imgData.url)) {
                    galleryItems[index].src = imgData.url;
                    if (imgData.alt) galleryItems[index].alt = imgData.alt;
                }
            }
        });
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

function applyFooter(footer) {
    const footerEl = document.querySelector('.footer');
    if (!footerEl) return;
    
    // Footer tagline
    if (footer.tagline) {
        const tagline = footerEl.querySelector('.footer-tagline');
        if (tagline) tagline.innerHTML = footer.tagline.replace(/\n/g, '<br>');
    }
    
    // Copyright text
    if (footer.copyright) {
        const copyright = footerEl.querySelector('.footer-bottom p');
        if (copyright) copyright.innerHTML = footer.copyright;
    }
}


