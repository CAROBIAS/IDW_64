// Show body after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Display the body
    document.body.style.display = 'block';
    
    // Initialize admin functionality
    initializeAdminPanel();
});

/**
 * Initialize admin panel functionality
 */
function initializeAdminPanel() {
    // Add click handlers for admin buttons
    setupAdminButtons();
    
    // Add any additional initialization here
    console.log('Dashboard Admin initialized');
}

/**
 * Setup click handlers for admin section buttons
 */
function setupAdminButtons() {
    const adminButtons = document.querySelectorAll('.admin-btn');
    
    adminButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // If href is empty, prevent navigation and show alert
            if(this.getAttribute('href') === '') {
                e.preventDefault();
                const sectionName = this.textContent.trim();
                handleSectionClick(sectionName);
            }
        });
    });
}

/**
 * Handle click on admin section button
 * @param {string} sectionName - Name of the clicked section
 */
function handleSectionClick(sectionName) {
    // Show alert with section name
    alert('Sección: ' + sectionName);
    
    // You can replace this with your own navigation logic
    // Example:
    // window.location.href = sectionName.toLowerCase() + '.html';
}

/**
 * Optional: Add smooth scroll behavior for navigation
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Optional: Call smooth scroll if needed
// addSmoothScroll();