/* ============================================================
   SpiceTick — Premium Spice Company
   JavaScript — Animations & Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- LOADING SCREEN ----
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1200);
    });
    // Fallback: hide loader after 4s even if load event is slow
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 4000);


    // ---- NAVBAR SCROLL BEHAVIOR ----
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScrollY > 300) {
            if (currentScrollY > lastScrollY + 5) {
                navbar.classList.add('hide-nav');
            } else if (currentScrollY < lastScrollY - 5) {
                navbar.classList.remove('hide-nav');
            }
        } else {
            navbar.classList.remove('hide-nav');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });


    // ---- SMOOTH SCROLLING ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            const hamburger = document.getElementById('hamburger');
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });


    // ---- HAMBURGER MOBILE MENU ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });


    // ---- VIDEO MUTE/UNMUTE ----
    const heroVideo = document.getElementById('heroVideo');
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');

    if (muteBtn && heroVideo) {
        muteBtn.addEventListener('click', () => {
            heroVideo.muted = !heroVideo.muted;
            if (heroVideo.muted) {
                muteIcon.className = 'fas fa-volume-xmark';
            } else {
                muteIcon.className = 'fas fa-volume-high';
            }
        });
    }


    // ---- SCROLL REVEAL ANIMATIONS ----
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ---- COUNTER ANIMATION ----
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }


    // ---- ACTIVE NAV LINK HIGHLIGHT ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));


    // ---- CONTACT FORM (WhatsApp Redirection) ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;

            // Format message for WhatsApp
            const wpText = `Hello SpiceTick!%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0APhone: ${encodeURIComponent(phone)}%0A%0AMessage: ${encodeURIComponent(message)}`;
            const wpUrl = `https://wa.me/918590091408?text=${wpText}`;

            // Cosmetic feedback
            const btn = contactForm.querySelector('.submit-btn');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Redirecting...</span>';
            btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
            btn.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.35)';

            // Open WhatsApp in a new tab after a brief delay
            setTimeout(() => {
                window.open(wpUrl, '_blank');

                // Reset form and button
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                    contactForm.reset();
                }, 1000);
            }, 800);
        });
    }


    // ---- PARALLAX SUBTLE EFFECT ----
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        window.addEventListener('scroll', () => {
            const rect = aboutImage.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const translateY = (scrollPercent - 0.5) * 30;
                aboutImage.style.transform = `translateY(${translateY}px)`;
            }
        });
    }


    // ---- GALLERY ITEM HOVER GLOW ----
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});
