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
    
    // ============================================
    // DISABLED: Main content sections now use HTML defaults
    // The following sections are NOT overridden by CMS:
    // - Hero Section (title, subtitle)
    // - About Section
    // - Location Section  
    // - Fleet Section
    // - Membership Section
    // - Waitlist Section
    // 
    // Only branding (logo, colors), SEO, and contact info
    // are loaded from CMS. Edit index.html directly for content.
    // ============================================
    
    // Contact & Social - KEEP this from CMS
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
    
    // Add contact email if provided - both as mailto link and visible in contact column
    if (contact.email) {
        // Update the mailto link in Join column
        const contactLink = footer.querySelector('a[href^="mailto:"]');
        if (contactLink) {
            contactLink.href = `mailto:${contact.email}`;
            contactLink.textContent = 'Contact';
        }
        
        // Also show email in contact column
        const emailEl = footer.querySelector('.contact-email-display');
        if (emailEl) {
            emailEl.innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
        }
    }
    
    // Add phone number
    if (contact.phone) {
        const phoneEl = footer.querySelector('.contact-phone');
        if (phoneEl) {
            phoneEl.innerHTML = `<a href="tel:${contact.phone}">${contact.phone}</a>`;
        }
    }
    
    // Add address
    if (contact.address) {
        const addressEl = footer.querySelector('.contact-address');
        if (addressEl) {
            addressEl.textContent = contact.address;
        }
    }
    
    // Add operating hours
    if (contact.hours) {
        const hoursEl = footer.querySelector('.contact-hours');
        if (hoursEl) {
            hoursEl.textContent = contact.hours;
        }
    }
    
    // Hide contact column if nothing to show
    const contactCol = footer.querySelector('.footer-contact');
    if (contactCol) {
        const hasContent = contact.phone || contact.address || contact.hours;
        contactCol.style.display = hasContent ? 'block' : 'none';
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

