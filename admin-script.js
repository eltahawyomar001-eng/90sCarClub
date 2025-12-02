/* ============================================
   BVCC Admin Panel JavaScript
   ============================================ */

// Simple password authentication
const ADMIN_PASSWORD = 'bvcc2024';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initLogin();
    initNavigation();
    initSaveButtons();
    initLogout();
    loadSubmissions();
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
        
        if (password === ADMIN_PASSWORD) {
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
    loadContent();
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
            
            // Remove active class from all items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.dataset.section;
            document.getElementById(`section-${sectionId}`).classList.add('active');
        });
    });
}

/* ============================================
   CONTENT MANAGEMENT
   ============================================ */
function loadContent() {
    const savedContent = localStorage.getItem('bvcc_content');
    
    if (savedContent) {
        const content = JSON.parse(savedContent);
        
        // Load Hero
        if (content.hero) {
            document.getElementById('hero-tag').value = content.hero.tag || '';
            document.getElementById('hero-title-1').value = content.hero.title1 || '';
            document.getElementById('hero-title-2').value = content.hero.title2 || '';
            document.getElementById('hero-subtitle').value = content.hero.subtitle || '';
        }
        
        // Load About
        if (content.about) {
            document.getElementById('about-title').value = content.about.title || '';
            document.getElementById('about-lead').value = content.about.lead || '';
            document.getElementById('about-p1').value = content.about.p1 || '';
            document.getElementById('about-p2').value = content.about.p2 || '';
        }
        
        // Load Location
        if (content.location) {
            document.getElementById('location-title').value = content.location.title || '';
            document.getElementById('location-lead').value = content.location.lead || '';
            document.getElementById('location-text').value = content.location.text || '';
        }
        
        // Load Fleet
        if (content.fleet) {
            document.getElementById('fleet-title').value = content.fleet.title || '';
            document.getElementById('fleet-intro').value = content.fleet.intro || '';
            document.getElementById('fleet-details').value = content.fleet.details || '';
            document.getElementById('fleet-note').value = content.fleet.note || '';
        }
        
        // Load Membership
        if (content.membership) {
            document.getElementById('membership-title').value = content.membership.title || '';
            document.getElementById('membership-lead').value = content.membership.lead || '';
        }
    }
}

function initSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            saveSection(section);
        });
    });
}

function saveSection(section) {
    const savedContent = localStorage.getItem('bvcc_content');
    const content = savedContent ? JSON.parse(savedContent) : {};
    
    switch(section) {
        case 'hero':
            content.hero = {
                tag: document.getElementById('hero-tag').value,
                title1: document.getElementById('hero-title-1').value,
                title2: document.getElementById('hero-title-2').value,
                subtitle: document.getElementById('hero-subtitle').value
            };
            break;
            
        case 'about':
            content.about = {
                title: document.getElementById('about-title').value,
                lead: document.getElementById('about-lead').value,
                p1: document.getElementById('about-p1').value,
                p2: document.getElementById('about-p2').value
            };
            break;
            
        case 'location':
            content.location = {
                title: document.getElementById('location-title').value,
                lead: document.getElementById('location-lead').value,
                text: document.getElementById('location-text').value
            };
            break;
            
        case 'fleet':
            content.fleet = {
                title: document.getElementById('fleet-title').value,
                intro: document.getElementById('fleet-intro').value,
                details: document.getElementById('fleet-details').value,
                note: document.getElementById('fleet-note').value
            };
            break;
            
        case 'membership':
            content.membership = {
                title: document.getElementById('membership-title').value,
                lead: document.getElementById('membership-lead').value
            };
            break;
    }
    
    localStorage.setItem('bvcc_content', JSON.stringify(content));
    showToast('Changes saved successfully!');
    
    // Generate updated HTML file instructions
    generateUpdateInstructions(content);
    
    // Add download button functionality
    addDownloadButton(content);
}

/* ============================================
   DOWNLOAD CONTENT
   ============================================ */
function addDownloadButton(content) {
    // Create download button if it doesn't exist
    let downloadBtn = document.getElementById('downloadContentBtn');
    if (!downloadBtn) {
        downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadContentBtn';
        downloadBtn.className = 'btn btn-secondary';
        downloadBtn.style.marginLeft = '10px';
        downloadBtn.textContent = 'Download Changes';
        
        // Add to admin header actions
        const actions = document.querySelector('.admin-actions');
        if (actions) {
            actions.appendChild(downloadBtn);
        }
    }
    
    downloadBtn.onclick = () => downloadContentFile(content);
}

function downloadContentFile(content) {
    const fileContent = `// BVCC Website Content
// Generated from Admin Panel
// Date: ${new Date().toLocaleString()}

const BVCC_CONTENT = ${JSON.stringify(content, null, 2)};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BVCC_CONTENT;
}`;

    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Content file downloaded! Send this to your developer.');
}

/* ============================================
   WAITLIST SUBMISSIONS
   ============================================ */
function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('bvcc_submissions') || '[]');
    const submissionsList = document.getElementById('submissionsList');
    const totalSubmissions = document.getElementById('totalSubmissions');
    
    totalSubmissions.textContent = submissions.length;
    
    if (submissions.length === 0) {
        submissionsList.innerHTML = '<p class="no-submissions">No submissions yet.</p>';
        return;
    }
    
    submissionsList.innerHTML = '';
    
    submissions.reverse().forEach((submission, index) => {
        const item = createSubmissionItem(submission, index);
        submissionsList.appendChild(item);
    });
    
    // Clear submissions button
    const clearBtn = document.getElementById('clearSubmissions');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all submissions?')) {
                localStorage.removeItem('bvcc_submissions');
                loadSubmissions();
                showToast('All submissions cleared');
            }
        });
    }
    
    // Add export submissions button
    addExportSubmissionsButton(submissions);
}

function addExportSubmissionsButton(submissions) {
    let exportBtn = document.getElementById('exportSubmissionsBtn');
    if (!exportBtn && submissions.length > 0) {
        exportBtn = document.createElement('button');
        exportBtn.id = 'exportSubmissionsBtn';
        exportBtn.className = 'btn btn-secondary';
        exportBtn.textContent = '📥 Export to CSV';
        exportBtn.style.marginLeft = '10px';
        
        const clearBtn = document.getElementById('clearSubmissions');
        if (clearBtn) {
            clearBtn.parentNode.insertBefore(exportBtn, clearBtn);
        }
        
        exportBtn.onclick = () => exportSubmissionsToCSV(submissions);
    }
}

function exportSubmissionsToCSV(submissions) {
    if (submissions.length === 0) {
        alert('No submissions to export');
        return;
    }
    
    // CSV Headers
    const headers = ['Submission Date', 'Full Name', 'Email', 'Phone', 'ZIP Code', 'Drive Manual', 'Own Enthusiast Car', 'Current Car', 'Car Interests', 'Why Join', 'Ready to Join', 'Cost Expectation', 'Usage Frequency', 'Additional Comments'];
    
    // CSV Rows
    const rows = submissions.map(sub => [
        new Date(sub.timestamp).toLocaleString(),
        sub.fullName || '',
        sub.email || '',
        sub.phone || '',
        sub.zipCode || '',
        sub.driveManual || '',
        sub.ownEnthusiastCar || '',
        sub.currentCar || '',
        `"${(sub.carInterests || '').replace(/"/g, '""')}"`,
        `"${(sub.whyJoin || '').replace(/"/g, '""')}"`,
        sub.readyToJoin || '',
        sub.costExpectation || '',
        sub.usageFrequency || '',
        `"${(sub.comments || '').replace(/"/g, '""')}"`
    ]);
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bvcc-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Submissions exported to CSV!');
}

function createSubmissionItem(submission, index) {
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

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ============================================
   GENERATE UPDATE INSTRUCTIONS
   ============================================ */
function generateUpdateInstructions(content) {
    console.log('=== CONTENT UPDATE INSTRUCTIONS ===');
    console.log('Copy this data and use it to update your index.html:');
    console.log(JSON.stringify(content, null, 2));
    console.log('===================================');
}
