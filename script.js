/**
 * Return It Landing Page JavaScript
 * Handles FAQ accordion, form feedback, and smooth interactions
 */

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // FAQ Accordion
    // --------------------------------------------------------------------------

    /**
     * Initialize the FAQ accordion functionality
     * Allows users to expand/collapse FAQ items by clicking on questions
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
                        behavior: 'smooth'
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
                var originalText = button.textContent;
                var isPrimaryButton = button.classList.contains('btn-primary');

                button.addEventListener('click', function(e) {
                    e.preventDefault();

                    var email = input.value.trim();

                    // Basic email validation for visual feedback
                    if (email && isValidEmail(email)) {
                        // Show success state
                        button.innerHTML = 'You\'re on the list! ✓';
                        button.style.backgroundColor = '#10b981';
                        button.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)';
                        button.style.transform = 'scale(1.02)';
                        input.value = '';
                        input.style.borderColor = '#10b981';

                        // Reset after 3 seconds
                        setTimeout(function() {
                            button.textContent = originalText;
                            button.style.backgroundColor = '';
                            button.style.boxShadow = '';
                            button.style.transform = '';
                            input.style.borderColor = '';
                        }, 3000);
                    } else if (email) {
                        // Show error state for invalid email
                        input.style.borderColor = '#ef4444';
                        input.classList.add('shake');

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

                // Add focus effect
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('form-focused');
                });

                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('form-focused');
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
    // Navigation Scroll Effect
    // --------------------------------------------------------------------------

    /**
     * Add shadow to navigation when page is scrolled
     */
    function initNavScrollEffect() {
        var nav = document.querySelector('.nav');
        var scrollThreshold = 20;

        if (nav) {
            function updateNavShadow() {
                if (window.scrollY > scrollThreshold) {
                    nav.style.boxShadow = '0 4px 20px rgba(26, 26, 46, 0.08)';
                } else {
                    nav.style.boxShadow = 'none';
                }
            }

            // Initial check
            updateNavShadow();

            // Listen for scroll
            window.addEventListener('scroll', updateNavShadow, { passive: true });
        }
    }

    // --------------------------------------------------------------------------
    // Intersection Observer for Fade-in Animations
    // --------------------------------------------------------------------------

    /**
     * Initialize scroll-triggered animations for elements below the fold
     */
    function initScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;

        var animatedElements = document.querySelectorAll('.step, .pricing-card, .faq-item');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el, index) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.transitionDelay = (index % 3) * 0.1 + 's';
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
        initNavScrollEffect();
        initScrollAnimations();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
