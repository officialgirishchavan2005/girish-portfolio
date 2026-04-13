document.addEventListener('DOMContentLoaded', () => {
    // ========== Mouse Parallax for Hero ==========
    const hero = document.getElementById('home');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (hero && window.innerWidth > 1024) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / 25;
            const moveY = (clientY - centerY) / 25;
            
            floatingCards.forEach((card, index) => {
                const depth = (index + 1) * 0.5;
                card.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            floatingCards.forEach(card => {
                card.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========== Initialization ==========
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 50
    });

    // ========== Scroll Progress Bar ==========
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Navbar Scrolled State
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link on Scroll
        updateActiveLink();
    });

    // ========== Typing Animation ==========
    const typeText = document.getElementById('type-text');
    const roles = ['Full Stack Developer', 'AI-Driven Builder', 'Software Engineer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 150;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 100;
        } else {
            typeText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500;
        }

        setTimeout(type, typeDelay);
    }
    type();

    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    body.className = savedTheme;

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.className = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.className = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // ========== Mobile Menu ==========
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.querySelector('i').classList.toggle('fa-bars');
        menuBtn.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').classList.add('fa-bars');
            menuBtn.querySelector('i').classList.remove('fa-times');
        });
    });

    // ========== Active Link Logic ==========
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    }

    // ========== Smooth Scroll ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Contact Form ==========
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.innerHTML = '<p style="color: var(--primary); margin-top: 1rem;">Sending message...</p>';
            
            // Simulate API call
            setTimeout(() => {
                formStatus.innerHTML = '<p style="color: #10b981; margin-top: 1rem;">Message sent successfully! I will get back to you soon.</p>';
                contactForm.reset();
            }, 1500);
        });
    }

    // ========== Dynamic Gallery Logic ==========
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryInput = document.getElementById('gallery-input');
    const galleryEmpty = document.getElementById('gallery-empty');

    function loadGallery() {
        const images = JSON.parse(localStorage.getItem('portfolioGallery')) || [];
        galleryGrid.innerHTML = '';
        
        if (images.length === 0) {
            galleryEmpty.style.display = 'block';
        } else {
            galleryEmpty.style.display = 'none';
            images.forEach((imgData, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.setAttribute('data-aos', 'zoom-in');
                item.innerHTML = `
                    <img src="${imgData}" alt="Gallery Image">
                    <div class="gallery-item-overlay">
                        <button class="delete-btn" onclick="deleteImage(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                galleryGrid.appendChild(item);
            });
            AOS.refresh();
        }
    }

    window.deleteImage = (index) => {
        let images = JSON.parse(localStorage.getItem('portfolioGallery')) || [];
        images.splice(index, 1);
        localStorage.setItem('portfolioGallery', JSON.stringify(images));
        loadGallery();
    };

    if (galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    let images = JSON.parse(localStorage.getItem('portfolioGallery')) || [];
                    images.push(event.target.result);
                    localStorage.setItem('portfolioGallery', JSON.stringify(images));
                    loadGallery();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    loadGallery();
});
