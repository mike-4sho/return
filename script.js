/**
 * Return It Landing Page JavaScript
 * Handles FAQ accordion functionality and smooth interactions
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
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', function() {
                    // Check if this item is already active
                    const isActive = item.classList.contains('active');

                    // Close all other FAQ items (optional: for single-open behavior)
                    // Comment out the next 3 lines if you want multiple FAQs open at once
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
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Skip if it's just "#"
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Account for fixed navigation height
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;

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
        const forms = document.querySelectorAll('.waitlist-form');

        forms.forEach(function(form) {
            const button = form.querySelector('.btn');
            const input = form.querySelector('.email-input');

            if (button && input) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();

                    const email = input.value.trim();

                    // Basic email validation for visual feedback
                    if (email && isValidEmail(email)) {
                        // Show success state
                        button.textContent = 'You\'re on the list!';
                        button.style.backgroundColor = '#00D4AA';
                        button.style.color = '#0a0a0a';
                        input.value = '';

                        // Reset after 3 seconds
                        setTimeout(function() {
                            button.textContent = 'Join the Waitlist';
                            button.style.backgroundColor = '';
                            button.style.color = '';
                        }, 3000);
                    } else if (email) {
                        // Show error state for invalid email
                        input.style.borderColor = '#ef4444';

                        setTimeout(function() {
                            input.style.borderColor = '';
                        }, 2000);
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --------------------------------------------------------------------------
    // Navigation Scroll Effect
    // --------------------------------------------------------------------------

    /**
     * Add subtle shadow to navigation when page is scrolled
     */
    function initNavScrollEffect() {
        const nav = document.querySelector('.nav');

        if (nav) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 10) {
                    nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                } else {
                    nav.style.boxShadow = 'none';
                }
            }, { passive: true });
        }
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
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
