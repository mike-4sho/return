/**
 * Return It Landing Page JavaScript
 * Handles FAQ accordion, form feedback, scroll animations, sticky nav, and interactions
 */

(function() {
    'use strict';

    // Check for reduced motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --------------------------------------------------------------------------
    // FAQ Accordion
    // --------------------------------------------------------------------------

    /**
     * Initialize the FAQ accordion functionality
     * Allows users to expand/collapse FAQ items with smooth animations
     */
    function initFaqAccordion() {
        var faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function(item) {
            var question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', function() {
                    // Check if this item is already active
                    var isActive = item.classList.contains('active');

                    // Close all other FAQ items (single-open behavior)
                    faqItems.forEach(function(otherItem) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    });

                    // Toggle the clicked item
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------

    /**
     * Initialize smooth scrolling for anchor links
     * Provides a polished navigation experience
     */
    function initSmoothScroll() {
        var anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');

                // Skip if it's just "#"
                if (targetId === '#') return;

                var targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Account for fixed navigation height
                    var navHeight = document.querySelector('.nav').offsetHeight;
                    var targetPosition = targetElement.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Form Interaction Feedback
    // --------------------------------------------------------------------------

    /**
     * Add visual feedback when users interact with the waitlist form
     * (No actual submission - this is a visual POC only)
     */
    function initFormFeedback() {
        var forms = document.querySelectorAll('.waitlist-form');

        forms.forEach(function(form) {
            var button = form.querySelector('.btn');
            var input = form.querySelector('.email-input');

            if (button && input) {
                // Store original button state
                var originalHTML = button.innerHTML;

                button.addEventListener('click', function(e) {
                    e.preventDefault();

                    var email = input.value.trim();

                    // Basic email validation for visual feedback
                    if (email && isValidEmail(email)) {
                        // Show success state
                        button.innerHTML = 'You\'re on the list! ✓';
                        button.style.backgroundColor = '#10b981';
                        button.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)';
                        button.classList.remove('btn-pulse');
                        input.value = '';
                        input.style.borderColor = '#10b981';

                        // Reset after 3 seconds
                        setTimeout(function() {
                            button.innerHTML = originalHTML;
                            button.style.backgroundColor = '';
                            button.style.boxShadow = '';
                            input.style.borderColor = '';
                        }, 3000);
                    } else if (email) {
                        // Show error state for invalid email
                        input.style.borderColor = '#ef4444';
                        if (!prefersReducedMotion) {
                            input.classList.add('shake');
                        }

                        setTimeout(function() {
                            input.style.borderColor = '';
                            input.classList.remove('shake');
                        }, 600);
                    } else {
                        // Empty input - focus it
                        input.focus();
                        input.style.borderColor = '#FF6B6B';

                        setTimeout(function() {
                            input.style.borderColor = '';
                        }, 1500);
                    }
                });

                // Clear error state on input
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            }
        });
    }

    /**
     * Simple email validation helper
     * @param {string} email - The email address to validate
     * @returns {boolean} - Whether the email format is valid
     */
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --------------------------------------------------------------------------
    // Navigation Effects
    // --------------------------------------------------------------------------

    /**
     * Handle navigation effects:
     * - Add shadow when scrolled
     * - Show/hide sticky CTA after scrolling past hero
     */
    function initNavEffects() {
        var nav = document.querySelector('.nav');
        var navCta = document.querySelector('.nav-cta');
        var hero = document.querySelector('.hero');

        if (!nav || !hero) return;

        var heroHeight = hero.offsetHeight;
        var scrollThreshold = 20;

        function updateNav() {
            var scrollY = window.scrollY;

            // Add shadow when scrolled
            if (scrollY > scrollThreshold) {
                nav.style.boxShadow = '0 4px 20px rgba(26, 26, 46, 0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }

            // Show/hide sticky CTA after scrolling past hero
            if (navCta) {
                if (scrollY > heroHeight - 100) {
                    navCta.classList.add('visible');
                } else {
                    navCta.classList.remove('visible');
                }
            }
        }

        // Update hero height on resize
        window.addEventListener('resize', function() {
            heroHeight = hero.offsetHeight;
        }, { passive: true });

        // Initial check
        updateNav();

        // Listen for scroll
        window.addEventListener('scroll', updateNav, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Scroll-Triggered Animations
    // --------------------------------------------------------------------------

    /**
     * Initialize scroll-triggered animations for elements below the fold
     * Steps fade in with staggered timing (200ms delay between each)
     */
    function initScrollAnimations() {
        // Skip if reduced motion is preferred
        if (prefersReducedMotion) return;

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;

        // Elements to animate
        var steps = document.querySelectorAll('.step');
        var pricingCards = document.querySelectorAll('.pricing-card');
        var faqItems = document.querySelectorAll('.faq-item');

        // Create observer
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Apply animation class and observe steps (staggered by data-step attribute)
        steps.forEach(function(el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Apply to pricing cards with stagger (150ms between each)
        pricingCards.forEach(function(el, index) {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = (index * 0.15) + 's';
            observer.observe(el);
        });

        // Apply to FAQ items with stagger (80ms between each)
        faqItems.forEach(function(el, index) {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = (index * 0.08) + 's';
            observer.observe(el);
        });
    }

    // --------------------------------------------------------------------------
    // Initialize Everything
    // --------------------------------------------------------------------------

    /**
     * Run all initialization functions when the DOM is ready
     */
    function init() {
        initFaqAccordion();
        initSmoothScroll();
        initFormFeedback();
        initNavEffects();
        initScrollAnimations();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
