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
   AUTHENTICATION
   ============================================ */
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('bvcc_admin_auth');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    }
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === 'bvcc2024') {
            sessionStorage.setItem('bvcc_admin_auth', 'true');
            showAdminPanel();
        } else {
            alert('Incorrect password. Please try again.');
            document.getElementById('password').value = '';
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
        document.getElementById('about-title').value = content.about.title || '';
        document.getElementById('about-lead').value = content.about.lead || '';
        document.getElementById('about-p1').value = content.about.p1 || '';
        document.getElementById('about-p2').value = content.about.p2 || '';
    }
    
    // Location
    if (content.location) {
        document.getElementById('location-title').value = content.location.title || '';
        document.getElementById('location-lead').value = content.location.lead || '';
        document.getElementById('location-text').value = content.location.text || '';
    }
    
    // Fleet
    if (content.fleet) {
        document.getElementById('fleet-title').value = content.fleet.title || '';
        document.getElementById('fleet-intro').value = content.fleet.intro || '';
        document.getElementById('fleet-details').value = content.fleet.details || '';
        document.getElementById('fleet-note').value = content.fleet.note || '';
        
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
        document.getElementById('membership-title').value = content.membership.title || '';
        document.getElementById('membership-lead').value = content.membership.lead || '';
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
    
    try {
        showLoadingToast('Saving changes...');
        
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: 'bvcc2024',
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

function buildContentObject() {
    // Collect fleet cars data
    const cars = [];
    for (let i = 1; i <= 4; i++) {
        const name = document.querySelector(`.car-name[data-car="${i}"]`)?.value || '';
        const description = document.querySelector(`.car-description[data-car="${i}"]`)?.value || '';
        const imageUrl = document.querySelector(`.car-url[data-car="${i}"]`)?.value || 
                        document.querySelector(`.car-img[data-car="${i}"]`)?.src || '';
        
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
            backgroundImage: document.getElementById('hero-bg-url')?.value || 
                           document.getElementById('hero-bg-img')?.src || ''
        },
        about: {
            title: document.getElementById('about-title').value,
            lead: document.getElementById('about-lead').value,
            p1: document.getElementById('about-p1').value,
            p2: document.getElementById('about-p2').value
        },
        location: {
            title: document.getElementById('location-title').value,
            lead: document.getElementById('location-lead').value,
            text: document.getElementById('location-text').value
        },
        fleet: {
            title: document.getElementById('fleet-title').value,
            intro: document.getElementById('fleet-intro').value,
            details: document.getElementById('fleet-details').value,
            note: document.getElementById('fleet-note').value,
            cars: cars
        },
        membership: {
            title: document.getElementById('membership-title').value,
            lead: document.getElementById('membership-lead').value
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
    
    // Fleet car image uploads
    for (let i = 1; i <= 4; i++) {
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
