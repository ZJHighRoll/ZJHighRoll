// Main website JavaScript

// Mobile menu toggle
const navLinks = document.querySelector('.nav-links');

// Smooth scrolling for navigation links
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

// Add animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and guide cards
document.querySelectorAll('.card, .guide-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Join Now button functionality
const joinButton = document.querySelector('.btn-primary');
if (joinButton) {
    joinButton.addEventListener('click', () => {
        // Button already has onclick, but this adds extra functionality
    });
}

// Visit Forums button
const forumButtons = document.querySelectorAll('.btn-secondary');
forumButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const section = e.target.textContent;
        alert(`${section} feature coming soon!`);
    });
});

// Add glow effect to logo on hover
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', () => {
        logo.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.8)';
    });
    logo.addEventListener('mouseleave', () => {
        logo.style.boxShadow = '0 0 0 2px rgba(0, 212, 255, 1)';
    });
}

// Floating logo animation enhancement
const floatingLogo = document.querySelector('.floating-logo');
if (floatingLogo) {
    floatingLogo.addEventListener('mousemove', (e) => {
        const rect = floatingLogo.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        floatingLogo.style.transform = `translateY(-50px) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
    });
    
    floatingLogo.addEventListener('mouseleave', () => {
        floatingLogo.style.transform = 'translateY(-50px)';
    });
}

// Navbar active link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent)';
        } else {
            link.style.color = 'var(--text-light)';
        }
    });
});

// Leaderboard auto-update simulation
function updateLeaderboard() {
    const leaderboardRows = document.querySelectorAll('.leaderboard-table tbody tr');
    leaderboardRows.forEach(row => {
        row.style.transition = 'background-color 0.3s ease';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('ZJHighRoll website loaded!');
    updateLeaderboard();
});