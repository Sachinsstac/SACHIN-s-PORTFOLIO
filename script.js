/* ============================================
   DOM CONTENT LOADED — INIT EVERYTHING
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initCustomCursor();
    initParticles();
    initTypingEffect();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initTiltEffect();
    initBackToTop();
    initContactForm();
});

/* ============================================
   1. LOADING SCREEN
   ============================================ */
function initLoader() {
    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("hidden");
            // Trigger hero animations after loader
            animateHero();
        }, 1500);
    });

    // Fallback: hide loader after 4 seconds max
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 4000);
}

/* ============================================
   2. CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const glow = document.querySelector(".cursor-glow");

    if (!dot || !glow) return;

    // Check for touch device
    if ("ontouchstart" in window) {
        dot.style.display = "none";
        glow.style.display = "none";
        return;
    }

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });

    // Smooth glow follow
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
        "a, button, .project-card, .service-card, .social-link, .btn, .nav-toggle, input, textarea"
    );
    hoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            dot.classList.add("hover");
            glow.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
            dot.classList.remove("hover");
            glow.classList.remove("hover");
        });
    });
}

/* ============================================
   3. PARTICLE SYSTEM (Canvas)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += dx * force * 0.02;
                    this.y += dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(131, 56, 236, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(131, 56, 236, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   4. TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const element = document.getElementById("typingText");
    if (!element) return;

    const words = [
        "Full Stack Developer",
        "MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Frontend + Backend Dev",
        // "UI Designer",
        "Creative Coder",
        "Web Developer",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after a short delay
    setTimeout(type, 1000);
}

/* ============================================
   5. NAVBAR — Scroll & Active Link
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");

    // Sticky navbar
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Click scroll + active
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            // Smooth scroll with offset fix
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: "smooth"
            });

            // Active update
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

/* ============================================
   6. MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const links = document.querySelectorAll(".nav-link");

    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        navLinks.classList.toggle("open");
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            toggle.classList.remove("active");
            navLinks.classList.remove("open");
        });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove("active");
            navLinks.classList.remove("open");
        }
    });
}

/* ============================================
   7. SCROLL ANIMATIONS (Intersection Observer + GSAP)
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll("[data-animate]");

    // Intersection Observer for CSS animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    animatedElements.forEach((el) => observer.observe(el));

    // GSAP ScrollTrigger Animations (if available)
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Parallax effect on hero image
        gsap.to(".hero-image-wrapper", {
            y: -50,
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });

        // Section headers
        gsap.utils.toArray(".section-header").forEach((header) => {
            gsap.from(header.querySelector(".section-title"), {
                y: 30,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Project cards stagger
        gsap.utils.toArray(".project-card").forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Service cards stagger
        gsap.utils.toArray(".service-card").forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                rotation: 3,
                duration: 0.7,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Contact section
        gsap.from(".contact-info", {
            x: -50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        gsap.from(".contact-form", {
            x: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });
    }
}

/* ============================================
   8. HERO ANIMATION (after loader)
   ============================================ */
function animateHero() {
    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-greeting", { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-name", { y: 40, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-description", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-buttons .btn", {
            y: 20, opacity: 0, duration: 0.5, stagger: 0.15,
        }, "-=0.3")
        .from(".hero-socials .social-link", {
            y: 20, opacity: 0, duration: 0.4, stagger: 0.1,
        }, "-=0.3")
        .from(".hero-image-wrapper", {
            x: 60, opacity: 0, duration: 0.8, ease: "power2.out",
        }, "-=0.8")
        .from(".floating-badge", {
            scale: 0, opacity: 0, duration: 0.5, stagger: 0.15,
            ease: "back.out(1.7)",
        }, "-=0.4")
        .from(".scroll-indicator", {
            y: 20, opacity: 0, duration: 0.5,
        }, "-=0.2");
}

/* ============================================
   9. SKILL BARS ANIMATION
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");
    const circlesFills = document.querySelectorAll(".circle-fill");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Animate progress bars
                    skillBars.forEach((bar) => {
                        const width = bar.getAttribute("data-width");
                        setTimeout(() => {
                            bar.style.width = width + "%";
                        }, 200);
                    });

                    // Animate circle progress
                    circlesFills.forEach((circle) => {
                        const percent = circle.style.getPropertyValue("--percent");
                        const circumference = 2 * Math.PI * 54; // r=54
                        const offset = circumference - (percent / 100) * circumference;
                        setTimeout(() => {
                            circle.style.strokeDashoffset = offset;
                        }, 400);
                    });

                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    const skillsSection = document.getElementById("skills");
    if (skillsSection) observer.observe(skillsSection);
}

/* ============================================
   10. COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute("data-count"));
                    let current = 0;
                    const increment = target / 60;
                    const duration = 2000;
                    const stepTime = duration / 60;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, stepTime);

                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
}

/* ============================================
   11. 3D TILT EFFECT ON CARDS
   ============================================ */
function initTiltEffect() {
    const cards = document.querySelectorAll(".tilt-card");

    if (window.innerWidth < 768) return; // Disable on mobile

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
            card.style.transition = "transform 0.5s ease";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.1s ease";
        });
    });
}

/* ============================================
   12. BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ============================================
   13. CONTACT FORM (visual feedback)
   ============================================ */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");
        const originalHTML = btn.innerHTML;

        // Show success state
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = "linear-gradient(135deg, #00c853, #00e676)";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = "";
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}