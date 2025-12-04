/* ============================================
   BVCC Professional Admin Panel
   Connected to Vercel KV Database
   ============================================ */

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initLogin();
});

/* ============================================
   AUTHENTICATION (Server-Side Validated)
   ============================================ */
function checkAuth() {
    const authData = sessionStorage.getItem('bvcc_admin_auth');
    if (authData) {
        try {
            const { token, expiry } = JSON.parse(authData);
            // Check if token exists and hasn't expired
            if (token && expiry && Date.now() < expiry) {
                showAdminPanel();
                return;
            }
        } catch (e) {
            // Invalid auth data, clear it
            sessionStorage.removeItem('bvcc_admin_auth');
        }
    }
}

function getAuthToken() {
    const authData = sessionStorage.getItem('bvcc_admin_auth');
    if (authData) {
        try {
            const { token, expiry } = JSON.parse(authData);
            if (token && expiry && Date.now() < expiry) {
                return token;
            }
        } catch (e) {
            return null;
        }
    }
    return null;
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
        if (loginError) loginError.style.display = 'none';
        
        try {
            // Authenticate via server
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            const result = await response.json();
            
            if (result.success && result.token) {
                // Store token securely in session
                sessionStorage.setItem('bvcc_admin_auth', JSON.stringify({
                    token: result.token,
                    expiry: result.expiry
                }));
                showAdminPanel();
            } else {
                // Show error
                if (loginError) {
                    loginError.textContent = result.error || 'Invalid password';
                    loginError.style.display = 'block';
                } else {
                    alert('Incorrect password. Please try again.');
                }
                document.getElementById('password').value = '';
            }
        } catch (error) {
            console.error('Auth error:', error);
            if (loginError) {
                loginError.textContent = 'Authentication failed. Please try again.';
                loginError.style.display = 'block';
            } else {
                alert('Authentication failed. Please try again.');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    initNavigation();
    initSaveButtons();
    initLogout();
    initImageUploads();
    initBrandingControls();
    initGalleryManager();
    initAnalytics();
    loadContentFromAPI();
    loadSubmissionsFromAPI();
}

function initLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('bvcc_admin_auth');
        location.reload();
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            item.classList.add('active');
            const sectionId = item.dataset.section;
            document.getElementById(`section-${sectionId}`).classList.add('active');
        });
    });
}

/* ============================================
   CONTENT MANAGEMENT - API CONNECTED
   ============================================ */
async function loadContentFromAPI() {
    try {
        showLoadingToast('Loading content...');
        
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.success && data.content) {
            populateFormFields(data.content);
            hideLoadingToast();
            showToast('✅ Content loaded successfully!');
        }
    } catch (error) {
        console.error('Error loading content:', error);
        hideLoadingToast();
        showToast('⚠️ Using local content', 'warning');
    }
}

function populateFormFields(content) {
    // Hero
    if (content.hero) {
        document.getElementById('hero-tag').value = content.hero.tag || '';
        document.getElementById('hero-title-1').value = content.hero.title1 || '';
        document.getElementById('hero-title-2').value = content.hero.title2 || '';
        document.getElementById('hero-subtitle').value = content.hero.subtitle || '';
        
        // Hero background image
        if (content.hero.backgroundImage) {
            const heroBgImg = document.getElementById('hero-bg-img');
            const heroBgUrl = document.getElementById('hero-bg-url');
            if (heroBgImg) heroBgImg.src = content.hero.backgroundImage;
            if (heroBgUrl) heroBgUrl.value = content.hero.backgroundImage;
        }
    }
    
    // About
    if (content.about) {
        document.getElementById('about-tag').value = content.about.tag || 'About the Club';
        document.getElementById('about-title').value = content.about.title || '';
        document.getElementById('about-lead').value = content.about.lead || '';
        document.getElementById('about-p1').value = content.about.p1 || '';
        document.getElementById('about-p2').value = content.about.p2 || '';
    }
    
    // Location
    if (content.location) {
        document.getElementById('location-tag').value = content.location.tag || 'Location';
        document.getElementById('location-title').value = content.location.title || '';
        document.getElementById('location-lead').value = content.location.lead || '';
        document.getElementById('location-text').value = content.location.text || '';
    }
    
    // Fleet
    if (content.fleet) {
        document.getElementById('fleet-tag').value = content.fleet.tag || 'Fleet Philosophy';
        document.getElementById('fleet-title').value = content.fleet.title || '';
        document.getElementById('fleet-intro').value = content.fleet.intro || '';
        document.getElementById('fleet-list-title').value = content.fleet.listTitle || 'Representative Fleet List';
        document.getElementById('fleet-details').value = content.fleet.details || '';
        document.getElementById('fleet-note').value = content.fleet.note || '';
        
        // Car brands (new individual fields)
        if (content.fleet.carBrands) {
            document.getElementById('fleet-porsche').value = content.fleet.carBrands.porsche || '';
            document.getElementById('fleet-bmw').value = content.fleet.carBrands.bmw || '';
            document.getElementById('fleet-mercedes').value = content.fleet.carBrands.mercedes || '';
            document.getElementById('fleet-ferrari').value = content.fleet.carBrands.ferrari || '';
            document.getElementById('fleet-aston').value = content.fleet.carBrands.aston || '';
            document.getElementById('fleet-japanese').value = content.fleet.carBrands.japanese || '';
            document.getElementById('fleet-other-brand').value = content.fleet.carBrands.otherBrand || '';
            document.getElementById('fleet-other-models').value = content.fleet.carBrands.otherModels || '';
        }
        
        // Fleet gallery images
        if (content.fleet.galleryImages && Array.isArray(content.fleet.galleryImages)) {
            content.fleet.galleryImages.forEach((imgUrl, index) => {
                const i = index + 1;
                const imgEl = document.getElementById(`fleet-gallery-img-${i}`);
                const urlEl = document.getElementById(`fleet-gallery-url-${i}`);
                if (imgEl && imgUrl) imgEl.src = imgUrl;
                if (urlEl && imgUrl) urlEl.value = imgUrl;
            });
        }
        
        // Fleet cars
        if (content.fleet.cars && Array.isArray(content.fleet.cars)) {
            content.fleet.cars.forEach((car, index) => {
                const i = index + 1;
                const carName = document.querySelector(`.car-name[data-car="${i}"]`);
                const carDesc = document.querySelector(`.car-description[data-car="${i}"]`);
                const carImg = document.querySelector(`.car-img[data-car="${i}"]`);
                const carUrl = document.querySelector(`.car-url[data-car="${i}"]`);
                
                if (carName) carName.value = car.name || '';
                if (carDesc) carDesc.value = car.description || '';
                if (car.image) {
                    if (carImg) carImg.src = car.image;
                    if (carUrl) carUrl.value = car.image;
                }
            });
        }
    }
    
    // Membership
    if (content.membership) {
        document.getElementById('membership-tag').value = content.membership.tag || 'Membership';
        document.getElementById('membership-title').value = content.membership.title || '';
        document.getElementById('membership-lead').value = content.membership.lead || '';
    }
    
    // Waitlist
    if (content.waitlist) {
        if (content.waitlist.tag) {
            document.getElementById('waitlist-tag').value = content.waitlist.tag;
        }
        if (content.waitlist.title) {
            document.getElementById('waitlist-title').value = content.waitlist.title;
        }
        if (content.waitlist.intro) {
            document.getElementById('waitlist-intro').value = content.waitlist.intro;
        }
        // Form questions
        if (content.waitlist.formQuestions) {
            const q = content.waitlist.formQuestions;
            if (q.manualQuestion) document.getElementById('waitlist-q-manual').value = q.manualQuestion;
            if (q.ownCarQuestion) document.getElementById('waitlist-q-own-car').value = q.ownCarQuestion;
            if (q.currentCarQuestion) document.getElementById('waitlist-q-current-car').value = q.currentCarQuestion;
            if (q.currentCarPlaceholder) document.getElementById('waitlist-q-current-placeholder').value = q.currentCarPlaceholder;
            if (q.interestsQuestion) document.getElementById('waitlist-q-interests').value = q.interestsQuestion;
            if (q.whyJoinQuestion) document.getElementById('waitlist-q-why-join').value = q.whyJoinQuestion;
            if (q.readyQuestion) document.getElementById('waitlist-q-ready').value = q.readyQuestion;
        }
    }
    
    // Gallery
    if (content.gallery && Array.isArray(content.gallery)) {
        galleryImages = content.gallery;
        renderGallery();
    }
    
    // Branding
    if (content.branding) {
        const logoImg = document.getElementById('logo-img');
        const logoUrl = document.getElementById('logo-url');
        if (content.branding.logo) {
            if (logoImg) logoImg.src = content.branding.logo;
            if (logoUrl) logoUrl.value = content.branding.logo;
        }
        
        if (content.branding.primaryColor) {
            const primary = document.getElementById('primary-color');
            const primaryHex = document.getElementById('primary-color-hex');
            if (primary) primary.value = content.branding.primaryColor;
            if (primaryHex) primaryHex.value = content.branding.primaryColor;
        }
        
        if (content.branding.darkBg) {
            const dark = document.getElementById('dark-bg-color');
            const darkHex = document.getElementById('dark-bg-hex');
            if (dark) dark.value = content.branding.darkBg;
            if (darkHex) darkHex.value = content.branding.darkBg;
        }
        
        if (content.branding.headingFont) {
            const heading = document.getElementById('heading-font');
            if (heading) heading.value = content.branding.headingFont;
        }
        
        if (content.branding.bodyFont) {
            const body = document.getElementById('body-font');
            if (body) body.value = content.branding.bodyFont;
        }
        
        updateColorPreview();
        updateTypographyPreview();
    }
    
    // SEO
    if (content.seo) {
        const seoTitle = document.getElementById('seo-title');
        const seoDesc = document.getElementById('seo-description');
        const seoKeywords = document.getElementById('seo-keywords');
        const ogImg = document.getElementById('og-image');
        const ogUrl = document.getElementById('og-url');
        
        if (seoTitle) seoTitle.value = content.seo.title || '';
        if (seoDesc) seoDesc.value = content.seo.description || '';
        if (seoKeywords) seoKeywords.value = content.seo.keywords || '';
        if (content.seo.ogImage) {
            if (ogImg) ogImg.src = content.seo.ogImage;
            if (ogUrl) ogUrl.value = content.seo.ogImage;
        }
    }
    
    // Contact & Social
    if (content.contact) {
        const email = document.getElementById('contact-email');
        const phone = document.getElementById('contact-phone');
        const address = document.getElementById('contact-address');
        const hours = document.getElementById('contact-hours');
        
        if (email) email.value = content.contact.email || '';
        if (phone) phone.value = content.contact.phone || '';
        if (address) address.value = content.contact.address || '';
        if (hours) hours.value = content.contact.hours || '';
        
        if (content.contact.social) {
            const instagram = document.getElementById('social-instagram');
            const facebook = document.getElementById('social-facebook');
            const twitter = document.getElementById('social-twitter');
            const youtube = document.getElementById('social-youtube');
            const display = document.getElementById('social-display');
            
            if (instagram) instagram.value = content.contact.social.instagram || '';
            if (facebook) facebook.value = content.contact.social.facebook || '';
            if (twitter) twitter.value = content.contact.social.twitter || '';
            if (youtube) youtube.value = content.contact.social.youtube || '';
            if (display) display.checked = content.contact.social.display !== false;
        }
    }
    
    // Footer content
    if (content.footer) {
        const tagline = document.getElementById('footer-tagline');
        const copyright = document.getElementById('footer-copyright');
        
        if (tagline) tagline.value = content.footer.tagline || 'A private drivers\' club for analog-era enthusiasts.';
        if (copyright) copyright.value = content.footer.copyright || '© 2025 Brooklyn Vintage Car Club. All rights reserved.';
    }
}

function initSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const section = btn.dataset.section;
            await saveSectionToAPI(section);
        });
    });
}

async function saveSectionToAPI(section) {
    const content = buildContentObject();
    const token = getAuthToken();
    
    if (!token) {
        showToast('❌ Session expired. Please login again.', 'error');
        setTimeout(() => location.reload(), 1500);
        return;
    }
    
    try {
        showLoadingToast('Saving changes...');
        
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                content: content
            })
        });
        
        const data = await response.json();
        
        hideLoadingToast();
        
        if (data.success) {
            showToast('✅ Changes saved and live on website!', 'success');
            
            // Open website in new tab to show changes
            setTimeout(() => {
                if (confirm('Changes are live! Open website to see updates?')) {
                    window.open('/index.html', '_blank');
                }
            }, 1000);
        } else {
            showToast('❌ Error saving: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error saving content:', error);
        hideLoadingToast();
        showToast('❌ Failed to save changes', 'error');
    }
}

// Helper function to get valid image URL (not empty or placeholder)
function getValidImageUrl(urlInputId, imgElementId) {
    const urlInput = document.getElementById(urlInputId);
    const imgElement = document.getElementById(imgElementId);
    
    // First check URL input field
    if (urlInput && urlInput.value && urlInput.value.trim() !== '') {
        return urlInput.value.trim();
    }
    
    // Then check img src - but only if it's a real URL (not empty or relative placeholder)
    if (imgElement && imgElement.src) {
        const src = imgElement.src;
        // Only return if it's a valid http/https URL (uploaded image)
        if (src.startsWith('http://') || src.startsWith('https://')) {
            // Don't return if it's just the page URL (empty src resolves to page URL)
            if (!src.includes('/admin.html') && !src.endsWith('/')) {
                return src;
            }
        }
    }
    
    return ''; // Return empty string if no valid URL
}

function buildContentObject() {
    // Collect fleet cars data (8 cars)
    const cars = [];
    for (let i = 1; i <= 8; i++) {
        const name = document.querySelector(`.car-name[data-car="${i}"]`)?.value || '';
        const description = document.querySelector(`.car-description[data-car="${i}"]`)?.value || '';
        const urlInput = document.querySelector(`.car-url[data-car="${i}"]`);
        const imgElement = document.querySelector(`.car-img[data-car="${i}"]`);
        
        let imageUrl = '';
        if (urlInput && urlInput.value && urlInput.value.trim() !== '') {
            imageUrl = urlInput.value.trim();
        } else if (imgElement && imgElement.src && imgElement.src.startsWith('http') && !imgElement.src.includes('/admin.html')) {
            imageUrl = imgElement.src;
        }
        
        if (name || description || imageUrl) {
            cars.push({
                name: name,
                description: description,
                image: imageUrl
            });
        }
    }
    
    return {
        hero: {
            tag: document.getElementById('hero-tag').value,
            title1: document.getElementById('hero-title-1').value,
            title2: document.getElementById('hero-title-2').value,
            subtitle: document.getElementById('hero-subtitle').value,
            backgroundImage: getValidImageUrl('hero-bg-url', 'hero-bg-img')
        },
        about: {
            tag: document.getElementById('about-tag').value,
            title: document.getElementById('about-title').value,
            lead: document.getElementById('about-lead').value,
            p1: document.getElementById('about-p1').value,
            p2: document.getElementById('about-p2').value
        },
        location: {
            tag: document.getElementById('location-tag').value,
            title: document.getElementById('location-title').value,
            lead: document.getElementById('location-lead').value,
            text: document.getElementById('location-text').value
        },
        fleet: {
            tag: document.getElementById('fleet-tag').value,
            title: document.getElementById('fleet-title').value,
            intro: document.getElementById('fleet-intro').value,
            listTitle: document.getElementById('fleet-list-title').value,
            details: document.getElementById('fleet-details').value,
            note: document.getElementById('fleet-note').value,
            carBrands: {
                porsche: document.getElementById('fleet-porsche').value,
                bmw: document.getElementById('fleet-bmw').value,
                mercedes: document.getElementById('fleet-mercedes').value,
                ferrari: document.getElementById('fleet-ferrari').value,
                aston: document.getElementById('fleet-aston').value,
                japanese: document.getElementById('fleet-japanese').value,
                otherBrand: document.getElementById('fleet-other-brand').value,
                otherModels: document.getElementById('fleet-other-models').value
            },
            galleryImages: [
                getValidImageUrl('fleet-gallery-url-1', 'fleet-gallery-img-1') || 'stock photos/BMW_Fleet_car.jpeg',
                getValidImageUrl('fleet-gallery-url-2', 'fleet-gallery-img-2') || 'stock photos/Fleet_car.jpeg',
                getValidImageUrl('fleet-gallery-url-3', 'fleet-gallery-img-3') || 'logos/AdobeStock_1679661205_Editorial_Use_Only.png'
            ],
            cars: cars
        },
        membership: {
            tag: document.getElementById('membership-tag').value,
            title: document.getElementById('membership-title').value,
            lead: document.getElementById('membership-lead').value
        },
        waitlist: {
            tag: document.getElementById('waitlist-tag').value,
            title: document.getElementById('waitlist-title').value,
            intro: document.getElementById('waitlist-intro').value,
            formQuestions: {
                manualQuestion: document.getElementById('waitlist-q-manual').value,
                ownCarQuestion: document.getElementById('waitlist-q-own-car').value,
                currentCarQuestion: document.getElementById('waitlist-q-current-car').value,
                currentCarPlaceholder: document.getElementById('waitlist-q-current-placeholder').value,
                interestsQuestion: document.getElementById('waitlist-q-interests').value,
                whyJoinQuestion: document.getElementById('waitlist-q-why-join').value,
                readyQuestion: document.getElementById('waitlist-q-ready').value
            }
        },
        gallery: galleryImages,
        branding: {
            logo: getValidImageUrl('logo-url', 'logo-img'),
            primaryColor: document.getElementById('primary-color-hex')?.value || '#FA2223',
            darkBg: document.getElementById('dark-bg-hex')?.value || '#1A1918',
            headingFont: document.getElementById('heading-font')?.value || 'Cormorant Garamond',
            bodyFont: document.getElementById('body-font')?.value || 'Inter'
        },
        seo: {
            title: document.getElementById('seo-title')?.value || '',
            description: document.getElementById('seo-description')?.value || '',
            keywords: document.getElementById('seo-keywords')?.value || '',
            ogImage: getValidImageUrl('og-url', 'og-image')
        },
        contact: {
            email: document.getElementById('contact-email')?.value || '',
            phone: document.getElementById('contact-phone')?.value || '',
            address: document.getElementById('contact-address')?.value || '',
            hours: document.getElementById('contact-hours')?.value || '',
            social: {
                instagram: document.getElementById('social-instagram')?.value || '',
                facebook: document.getElementById('social-facebook')?.value || '',
                twitter: document.getElementById('social-twitter')?.value || '',
                youtube: document.getElementById('social-youtube')?.value || '',
                display: document.getElementById('social-display')?.checked || false
            }
        },
        footer: {
            tagline: document.getElementById('footer-tagline')?.value || 'A private drivers\' club for analog-era enthusiasts.',
            copyright: document.getElementById('footer-copyright')?.value || '© 2025 Brooklyn Vintage Car Club. All rights reserved.'
        }
    };
}

/* ============================================
   WAITLIST SUBMISSIONS - API CONNECTED
   ============================================ */
async function loadSubmissionsFromAPI() {
    try {
        const response = await fetch('/api/submissions');
        const data = await response.json();
        
        if (data.success) {
            displaySubmissions(data.submissions || []);
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        showToast('⚠️ Could not load submissions', 'warning');
    }
}

function displaySubmissions(submissions) {
    const submissionsList = document.getElementById('submissionsList');
    const totalSubmissions = document.getElementById('totalSubmissions');
    
    totalSubmissions.textContent = submissions.length;
    
    if (submissions.length === 0) {
        submissionsList.innerHTML = '<p class="no-submissions">No submissions yet.</p>';
        return;
    }
    
    submissionsList.innerHTML = '';
    
    submissions.reverse().forEach((submission) => {
        const item = createSubmissionItem(submission);
        submissionsList.appendChild(item);
    });
    
    // Export button
    addExportButton(submissions);
    
    // Clear button
    document.getElementById('clearSubmissions').addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear ALL submissions? This cannot be undone.')) {
            await clearAllSubmissions();
        }
    });
}

function createSubmissionItem(submission) {
    const div = document.createElement('div');
    div.className = 'submission-item';
    
    div.innerHTML = `
        <div class="submission-header">
            <div>
                <div class="submission-name">${submission.fullName}</div>
                <div class="submission-date">${new Date(submission.timestamp).toLocaleString()}</div>
            </div>
        </div>
        <div class="submission-details">
            <div class="submission-field">
                <div class="submission-field-label">Email</div>
                <div class="submission-field-value">${submission.email}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Phone</div>
                <div class="submission-field-value">${submission.phone}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">ZIP Code</div>
                <div class="submission-field-value">${submission.zipCode}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Drive Manual</div>
                <div class="submission-field-value">${submission.driveManual}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Own Enthusiast Car</div>
                <div class="submission-field-value">${submission.ownEnthusiastCar}</div>
            </div>
            ${submission.currentCar ? `
            <div class="submission-field">
                <div class="submission-field-label">Current Car</div>
                <div class="submission-field-value">${submission.currentCar}</div>
            </div>
            ` : ''}
            <div class="submission-field submission-field-full">
                <div class="submission-field-label">Car Interests</div>
                <div class="submission-field-value">${submission.carInterests}</div>
            </div>
            <div class="submission-field submission-field-full">
                <div class="submission-field-label">Why Join</div>
                <div class="submission-field-value">${submission.whyJoin}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Ready to Join</div>
                <div class="submission-field-value">${submission.readyToJoin}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Cost Expectation</div>
                <div class="submission-field-value">${submission.costExpectation}</div>
            </div>
            <div class="submission-field">
                <div class="submission-field-label">Usage Frequency</div>
                <div class="submission-field-value">${submission.usageFrequency}</div>
            </div>
            ${submission.comments ? `
            <div class="submission-field submission-field-full">
                <div class="submission-field-label">Additional Comments</div>
                <div class="submission-field-value">${submission.comments}</div>
            </div>
            ` : ''}
        </div>
    `;
    
    return div;
}

async function clearAllSubmissions() {
    try {
        showLoadingToast('Clearing submissions...');
        
        const response = await fetch('/api/submissions', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: 'bvcc2024' })
        });
        
        const data = await response.json();
        hideLoadingToast();
        
        if (data.success) {
            showToast('✅ All submissions cleared', 'success');
            loadSubmissionsFromAPI();
        } else {
            showToast('❌ Error clearing submissions', 'error');
        }
    } catch (error) {
        hideLoadingToast();
        showToast('❌ Failed to clear submissions', 'error');
    }
}

function addExportButton(submissions) {
    if (submissions.length === 0) return;
    
    let exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) {
        exportBtn = document.createElement('button');
        exportBtn.id = 'exportBtn';
        exportBtn.className = 'btn btn-secondary';
        exportBtn.textContent = '📥 Export CSV';
        exportBtn.style.marginLeft = '10px';
        
        const clearBtn = document.getElementById('clearSubmissions');
        clearBtn.parentNode.insertBefore(exportBtn, clearBtn);
    }
    
    exportBtn.onclick = () => exportToCSV(submissions);
}

function exportToCSV(submissions) {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'ZIP', 'Manual', 'Own Car', 'Current Car', 'Interests', 'Why Join', 'Ready', 'Cost', 'Frequency', 'Comments'];
    
    const rows = submissions.map(s => [
        new Date(s.timestamp).toLocaleString(),
        s.fullName || '',
        s.email || '',
        s.phone || '',
        s.zipCode || '',
        s.driveManual || '',
        s.ownEnthusiastCar || '',
        s.currentCar || '',
        `"${(s.carInterests || '').replace(/"/g, '""')}"`,
        `"${(s.whyJoin || '').replace(/"/g, '""')}"`,
        s.readyToJoin || '',
        s.costExpectation || '',
        s.usageFrequency || '',
        `"${(s.comments || '').replace(/"/g, '""')}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bvcc-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('✅ CSV exported successfully!', 'success');
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Remove existing classes
    toast.className = 'toast';
    
    // Add type class
    if (type === 'success') toast.classList.add('toast-success');
    if (type === 'error') toast.classList.add('toast-error');
    if (type === 'warning') toast.classList.add('toast-warning');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function showLoadingToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = 'toast toast-loading';
    toastMessage.textContent = message;
    toast.classList.add('show');
}

function hideLoadingToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

/* ============================================
   IMAGE UPLOAD SYSTEM
   ============================================ */
function initImageUploads() {
    // Hero background image upload
    const heroBgUpload = document.getElementById('hero-bg-upload');
    const heroBgUrl = document.getElementById('hero-bg-url');
    const heroBgPreview = document.getElementById('hero-bg-img');
    
    if (heroBgUpload) {
        heroBgUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await uploadImage(file, heroBgPreview);
            }
        });
    }
    
    if (heroBgUrl) {
        heroBgUrl.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                heroBgPreview.src = url;
            }
        });
    }
    
    // Fleet gallery image uploads (3 images)
    for (let i = 1; i <= 3; i++) {
        const galleryUpload = document.getElementById(`fleet-gallery-upload-${i}`);
        const galleryUrl = document.getElementById(`fleet-gallery-url-${i}`);
        const galleryPreview = document.getElementById(`fleet-gallery-img-${i}`);
        
        if (galleryUpload) {
            galleryUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await uploadImage(file, galleryPreview);
                    if (galleryUrl) galleryUrl.value = galleryPreview.src;
                }
            });
        }
        
        if (galleryUrl) {
            galleryUrl.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url && galleryPreview) {
                    galleryPreview.src = url;
                }
            });
        }
    }
    
    // Fleet car image uploads (8 cars)
    for (let i = 1; i <= 8; i++) {
        const carUpload = document.querySelector(`.car-upload[data-car="${i}"]`);
        const carUrl = document.querySelector(`.car-url[data-car="${i}"]`);
        const carPreview = document.querySelector(`.car-img[data-car="${i}"]`);
        
        if (carUpload) {
            carUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await uploadImage(file, carPreview);
                }
            });
        }
        
        if (carUrl) {
            carUrl.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url && carPreview) {
                    carPreview.src = url;
                }
            });
        }
    }
}

async function uploadImage(file, previewElement) {
    try {
        showLoadingToast('📤 Uploading image...');
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        if (result.url) {
            previewElement.src = result.url;
            hideLoadingToast();
            showToast('✅ Image uploaded successfully!', 'success');
            return result.url;
        } else {
            throw new Error('No URL returned');
        }
    } catch (error) {
        console.error('Upload error:', error);
        hideLoadingToast();
        showToast('❌ Upload failed. Try pasting URL instead.', 'error');
        return null;
    }
}

/* ============================================
   IMAGE REMOVAL FUNCTIONS
   ============================================ */
function removeHeroImage() {
    const heroImg = document.getElementById('hero-bg-img');
    const heroUrl = document.getElementById('hero-bg-url');
    const heroUpload = document.getElementById('hero-bg-upload');
    
    if (heroImg) heroImg.src = '';
    if (heroUrl) heroUrl.value = '';
    if (heroUpload) heroUpload.value = '';
    
    showToast('Hero image cleared. Save to apply changes.', 'success');
}

function removeCarImage(carNumber) {
    const carImg = document.querySelector(`.car-img[data-car="${carNumber}"]`);
    const carUrl = document.querySelector(`.car-url[data-car="${carNumber}"]`);
    const carUpload = document.querySelector(`.car-upload[data-car="${carNumber}"]`);
    
    if (carImg) carImg.src = '';
    if (carUrl) carUrl.value = '';
    if (carUpload) carUpload.value = '';
    
    showToast(`Car ${carNumber} image cleared. Save to apply changes.`, 'success');
}

function removeLogo() {
    const logoImg = document.getElementById('logo-img');
    const logoUrl = document.getElementById('logo-url');
    const logoUpload = document.getElementById('logo-upload');
    
    if (logoImg) logoImg.src = '';
    if (logoUrl) logoUrl.value = '';
    if (logoUpload) logoUpload.value = '';
    
    showToast('Logo cleared. Save to apply changes.', 'success');
}

function removeOGImage() {
    const ogImg = document.getElementById('og-image');
    const ogUrl = document.getElementById('og-url');
    const ogUpload = document.getElementById('og-upload');
    
    if (ogImg) ogImg.src = '';
    if (ogUrl) ogUrl.value = '';
    if (ogUpload) ogUpload.value = '';
    
    showToast('Open Graph image cleared. Save to apply changes.', 'success');
}

/* ============================================
   BRANDING CONTROLS
   ============================================ */
function initBrandingControls() {
    // Logo upload
    const logoUpload = document.getElementById('logo-upload');
    const logoUrl = document.getElementById('logo-url');
    const logoPreview = document.getElementById('logo-img');
    
    if (logoUpload) {
        logoUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) await uploadImage(file, logoPreview);
        });
    }
    
    if (logoUrl) {
        logoUrl.addEventListener('input', (e) => {
            if (logoPreview) logoPreview.src = e.target.value.trim();
        });
    }
    
    // Color pickers
    const primaryColor = document.getElementById('primary-color');
    const primaryHex = document.getElementById('primary-color-hex');
    const darkBg = document.getElementById('dark-bg-color');
    const darkHex = document.getElementById('dark-bg-hex');
    
    if (primaryColor && primaryHex) {
        primaryColor.addEventListener('input', (e) => {
            primaryHex.value = e.target.value;
            updateColorPreview();
        });
        
        primaryHex.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                primaryColor.value = color;
                updateColorPreview();
            }
        });
    }
    
    if (darkBg && darkHex) {
        darkBg.addEventListener('input', (e) => {
            darkHex.value = e.target.value;
            updateColorPreview();
        });
        
        darkHex.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                darkBg.value = color;
                updateColorPreview();
            }
        });
    }
    
    // Font selectors
    const headingFont = document.getElementById('heading-font');
    const bodyFont = document.getElementById('body-font');
    
    if (headingFont) {
        headingFont.addEventListener('change', updateTypographyPreview);
    }
    
    if (bodyFont) {
        bodyFont.addEventListener('change', updateTypographyPreview);
    }
    
    // SEO image upload
    const ogUpload = document.getElementById('og-upload');
    const ogUrl = document.getElementById('og-url');
    const ogPreview = document.getElementById('og-image');
    
    if (ogUpload) {
        ogUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) await uploadImage(file, ogPreview);
        });
    }
    
    if (ogUrl) {
        ogUrl.addEventListener('input', (e) => {
            if (ogPreview) ogPreview.src = e.target.value.trim();
        });
    }
}

function resetColor() {
    document.getElementById('primary-color').value = '#FA2223';
    document.getElementById('primary-color-hex').value = '#FA2223';
    updateColorPreview();
}

function updateColorPreview() {
    const primary = document.getElementById('primary-color').value;
    const dark = document.getElementById('dark-bg-color').value;
    const preview = document.getElementById('colorPreview');
    
    if (preview) {
        preview.style.setProperty('--preview-primary', primary);
        preview.style.setProperty('--preview-dark', dark);
    }
}

function updateTypographyPreview() {
    const heading = document.getElementById('heading-font').value;
    const body = document.getElementById('body-font').value;
    const preview = document.getElementById('typographyPreview');
    
    if (preview) {
        preview.style.setProperty('--preview-heading', heading);
        preview.style.setProperty('--preview-body', body);
    }
}

/* ============================================
   GALLERY MANAGER
   ============================================ */
let galleryImages = [];

function initGalleryManager() {
    const galleryUpload = document.getElementById('gallery-upload');
    
    if (galleryUpload) {
        galleryUpload.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            
            for (const file of files) {
                const url = await uploadImage(file, document.createElement('img'));
                if (url) {
                    galleryImages.push({
                        url: url,
                        caption: '',
                        id: Date.now() + Math.random()
                    });
                }
            }
            
            renderGallery();
        });
    }
    
    loadGalleryFromAPI();
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    galleryImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.draggable = true;
        item.dataset.index = index;
        
        item.innerHTML = `
            <img src="${img.url}" alt="${img.caption || 'Gallery image'}">
            <div class="gallery-item-actions">
                <button class="gallery-item-delete" onclick="deleteGalleryImage(${index})">×</button>
            </div>
        `;
        
        // Drag and drop handlers
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        
        grid.appendChild(item);
    });
}

function deleteGalleryImage(index) {
    if (confirm('Delete this image?')) {
        galleryImages.splice(index, 1);
        renderGallery();
    }
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    this.style.opacity = '0.4';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    
    if (draggedItem !== this) {
        const fromIndex = parseInt(draggedItem.dataset.index);
        const toIndex = parseInt(this.dataset.index);
        
        const [moved] = galleryImages.splice(fromIndex, 1);
        galleryImages.splice(toIndex, 0, moved);
        
        renderGallery();
    }
    
    return false;
}

function handleDragEnd() {
    this.style.opacity = '1';
}

async function loadGalleryFromAPI() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        if (data.success && data.content && data.content.gallery) {
            galleryImages = data.content.gallery;
            renderGallery();
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

/* ============================================
   ANALYTICS
   ============================================ */
function initAnalytics() {
    updateAnalyticsDisplay();
}

async function updateAnalyticsDisplay() {
    try {
        // Get waitlist count
        const response = await fetch('/api/submissions');
        const data = await response.json();
        
        if (data.success) {
            const submissions = data.submissions || [];
            document.getElementById('stat-submissions').textContent = submissions.length;
            
            // Calculate conversion rate (placeholder - needs view tracking)
            const views = 1000; // Placeholder
            const conversion = submissions.length > 0 ? ((submissions.length / views) * 100).toFixed(1) : 0;
            document.getElementById('stat-conversion').textContent = conversion + '%';
        }
        
        // Placeholder for other stats
        document.getElementById('stat-views').textContent = '---';
        document.getElementById('stat-time').textContent = '---';
        
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}
