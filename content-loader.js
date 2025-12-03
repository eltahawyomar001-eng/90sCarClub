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
    // Apply branding first (colors, fonts, logo)
    if (content.branding) {
        applyBranding(content.branding);
    }
    
    // Apply SEO meta tags
    if (content.seo) {
        applySEO(content.seo);
    }
    
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
        
        // Apply fleet car images - only if valid cars exist in CMS
        if (content.fleet.cars && Array.isArray(content.fleet.cars) && content.fleet.cars.length > 0) {
            // Check if cars have actual content (not empty)
            const validCars = content.fleet.cars.filter(car => car.image && car.name);
            
            if (validCars.length > 0) {
                const fleetGallery = document.querySelector('.fleet-gallery');
                if (fleetGallery) {
                    fleetGallery.innerHTML = ''; // Clear defaults only if we have real cars
                    
                    validCars.forEach((car, index) => {
                        const carCard = document.createElement('div');
                        carCard.className = index === 0 ? 'gallery-item gallery-item-large' : 'gallery-item';
                        carCard.innerHTML = `
                            <div class="gallery-image-wrapper">
                                <img src="${car.image}" alt="${car.name}" class="gallery-image">
                            </div>
                            <div class="gallery-info">
                                <h3 class="gallery-name">${car.name}</h3>
                                ${car.description ? `<p class="gallery-desc">${car.description}</p>` : ''}
                            </div>
                        `;
                        fleetGallery.appendChild(carCard);
                    });
                }
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
    
    // Contact & Social
    if (content.contact) {
        applyContactInfo(content.contact);
    }
}

function applyBranding(branding) {
    // Apply logo - only if it's a valid image URL
    // Must be http/https and must be an actual image file (not a page URL)
    if (branding.logo && branding.logo.trim() !== '') {
        const logoUrl = branding.logo.trim().toLowerCase();
        const isValidImageUrl = (
            (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) &&
            !logoUrl.includes('.html') &&
            !logoUrl.includes('/admin') &&
            (logoUrl.includes('.svg') || logoUrl.includes('.png') || 
             logoUrl.includes('.jpg') || logoUrl.includes('.jpeg') || 
             logoUrl.includes('.webp') || logoUrl.includes('.gif') ||
             logoUrl.includes('blob.vercel-storage.com'))
        );
        
        if (isValidImageUrl) {
            const logos = document.querySelectorAll('.nav-logo-img, .loader-logo');
            logos.forEach(logo => {
                if (logo.tagName === 'IMG') {
                    logo.src = branding.logo;
                }
            });
        }
    }
    
    // Apply colors via CSS variables
    const root = document.documentElement;
    if (branding.primaryColor) {
        root.style.setProperty('--color-accent', branding.primaryColor);
        root.style.setProperty('--color-accent-hover', branding.primaryColor);
        root.style.setProperty('--color-primary', branding.primaryColor);
    }
    if (branding.darkBg) {
        root.style.setProperty('--color-bg-dark', branding.darkBg);
        root.style.setProperty('--color-text', branding.darkBg);
        root.style.setProperty('--color-dark', branding.darkBg);
    }
    
    // Apply fonts
    if (branding.headingFont || branding.bodyFont) {
        let style = document.getElementById('dynamic-fonts');
        if (!style) {
            style = document.createElement('style');
            style.id = 'dynamic-fonts';
            document.head.appendChild(style);
        }
        
        let css = '';
        if (branding.headingFont && branding.headingFont !== 'Cormorant Garamond') {
            css += `h1, h2, h3, h4, h5, h6, .section-title, .hero-title { font-family: '${branding.headingFont}', serif !important; }\n`;
            root.style.setProperty('--font-serif', `'${branding.headingFont}', serif`);
        }
        if (branding.bodyFont && branding.bodyFont !== 'Inter') {
            css += `body, p, a, input, textarea, button { font-family: '${branding.bodyFont}', sans-serif !important; }\n`;
            root.style.setProperty('--font-sans', `'${branding.bodyFont}', sans-serif`);
        }
        style.textContent = css;
        
        // Load Google Fonts
        if (branding.headingFont || branding.bodyFont) {
            const fonts = [];
            if (branding.headingFont && branding.headingFont !== 'Cormorant Garamond') {
                fonts.push(branding.headingFont.replace(/ /g, '+'));
            }
            if (branding.bodyFont && branding.bodyFont !== 'Inter') {
                fonts.push(branding.bodyFont.replace(/ /g, '+'));
            }
            
            if (fonts.length > 0) {
                let fontLink = document.getElementById('dynamic-font-link');
                if (!fontLink) {
                    fontLink = document.createElement('link');
                    fontLink.id = 'dynamic-font-link';
                    fontLink.rel = 'stylesheet';
                    document.head.appendChild(fontLink);
                }
                fontLink.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}:wght@400;600;700`).join('&')}&display=swap`;
            }
        }
    }
}

function applySEO(seo) {
    // Update page title
    if (seo.title) {
        document.title = seo.title;
    }
    
    // Update meta description
    if (seo.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.description;
    }
    
    // Update meta keywords
    if (seo.keywords) {
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
            metaKeys = document.createElement('meta');
            metaKeys.name = 'keywords';
            document.head.appendChild(metaKeys);
        }
        metaKeys.content = seo.keywords;
    }
    
    // Update Open Graph tags
    if (seo.ogImage) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (!ogImg) {
            ogImg = document.createElement('meta');
            ogImg.setAttribute('property', 'og:image');
            document.head.appendChild(ogImg);
        }
        ogImg.content = seo.ogImage;
    }
    
    if (seo.title) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.content = seo.title;
    }
    
    if (seo.description) {
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
            ogDesc = document.createElement('meta');
            ogDesc.setAttribute('property', 'og:description');
            document.head.appendChild(ogDesc);
        }
        ogDesc.content = seo.description;
    }
}

function applyContactInfo(contact) {
    // Update existing footer with contact info and social links
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Add contact email if provided
    if (contact.email) {
        const contactLink = footer.querySelector('a[href^="mailto:"]');
        if (contactLink) {
            contactLink.href = `mailto:${contact.email}`;
            contactLink.textContent = 'Contact';
        }
    }
    
    // Add social media links if display is enabled
    if (contact.social && contact.social.display) {
        // Check if social links section exists
        let socialCol = footer.querySelector('.footer-social');
        
        if (!socialCol) {
            // Create social links section
            const footerLinks = footer.querySelector('.footer-links');
            if (footerLinks) {
                socialCol = document.createElement('div');
                socialCol.className = 'footer-col footer-social';
                socialCol.innerHTML = '<h5>Follow Us</h5>';
                footerLinks.appendChild(socialCol);
            }
        }
        
        if (socialCol) {
            // Clear existing social links (except h5)
            const h5 = socialCol.querySelector('h5');
            socialCol.innerHTML = '';
            if (h5) socialCol.appendChild(h5);
            else socialCol.innerHTML = '<h5>Follow Us</h5>';
            
            // Add social links
            if (contact.social.instagram) {
                const link = document.createElement('a');
                link.href = contact.social.instagram;
                link.target = '_blank';
                link.textContent = 'Instagram';
                socialCol.appendChild(link);
            }
            
            if (contact.social.facebook) {
                const link = document.createElement('a');
                link.href = contact.social.facebook;
                link.target = '_blank';
                link.textContent = 'Facebook';
                socialCol.appendChild(link);
            }
            
            if (contact.social.twitter) {
                const link = document.createElement('a');
                link.href = contact.social.twitter;
                link.target = '_blank';
                link.textContent = 'Twitter';
                socialCol.appendChild(link);
            }
            
            if (contact.social.youtube) {
                const link = document.createElement('a');
                link.href = contact.social.youtube;
                link.target = '_blank';
                link.textContent = 'YouTube';
                socialCol.appendChild(link);
            }
        }
    }
}

