/**
 * Form Handler JavaScript for Architect Solutions
 * This file handles form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
});

/**
 * Initialize contact form with validation and submission handling
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  // Form elements for validation
  const formElements = {
    name: {
      input: contactForm.querySelector('#name'),
      error: contactForm.querySelector('#name-error'),
      validate: value => value.trim().length > 0
    },
    email: {
      input: contactForm.querySelector('#email'),
      error: contactForm.querySelector('#email-error'),
      validate: value => isValidEmail(value)
    },
    message: {
      input: contactForm.querySelector('#message'),
      error: contactForm.querySelector('#message-error'),
      validate: value => value.trim().length > 10
    }
  };

  // Success and error message elements
  const formSuccess = contactForm.querySelector('.success-message');
  const formError = contactForm.querySelector('.error-message');

  // Form submission event
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous messages
    hideElement(formSuccess);
    hideElement(formError);

    // Validate all fields
    let isValid = true;

    for (const field in formElements) {
      const { input, error, validate } = formElements[field];
      if (!input) continue;

      const isFieldValid = validate(input.value);
      if (!isFieldValid) {
        isValid = false;
        showValidationError(input, error, getErrorMessage(field));
      } else {
        clearValidationError(input, error);
      }
    }

    // If validation fails, stop submission
    if (!isValid) return;

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-50');
      submitButton.innerHTML = 'Sending...';
    }

    try {
      // Form submission
      const formData = new FormData(contactForm);

      // Convert FormData to JSON
      const formJson = {};
      formData.forEach((value, key) => {
        formJson[key] = value;
      });

      // Submit form data to mock endpoint
      const response = await submitFormData(formJson);

      if (response.success) {
        // Show success message
        showElement(formSuccess);
        // Reset form
        contactForm.reset();
        // Track successful form submission
        trackFormSubmission(contactForm.getAttribute('data-track') || 'Contact Form');
      } else {
        // Show error with message from server
        showElement(formError);
        if (formError) formError.textContent = response.message || 'An error occurred. Please try again.';
      }
    } catch (error) {
      // Show error message
      showElement(formError);
      if (formError) formError.textContent = 'There was a problem submitting the form. Please try again.';
      console.error('Form submission error:', error);
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        submitButton.innerHTML = 'Send Message';
      }
    }
  });

  // Real-time validation for fields
  for (const field in formElements) {
    const { input, error, validate } = formElements[field];
    if (!input) continue;

    input.addEventListener('blur', function() {
      const isFieldValid = validate(input.value);
      if (!isFieldValid) {
        showValidationError(input, error, getErrorMessage(field));
      } else {
        clearValidationError(input, error);
      }
    });

    // Clear error when user starts typing again
    input.addEventListener('input', function() {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.setAttribute('aria-invalid', 'false');
        hideElement(error);
      }
    });
  }
}

/**
 * Validate email format
 * @param {string} email Email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Show validation error for a field
 * @param {HTMLElement} input Input element
 * @param {HTMLElement} error Error message element
 * @param {string} message Error message text
 */
function showValidationError(input, error, message) {
  if (!input || !error) return;

  input.setAttribute('aria-invalid', 'true');
  error.textContent = message;
  showElement(error);
}

/**
 * Clear validation error for a field
 * @param {HTMLElement} input Input element
 * @param {HTMLElement} error Error message element
 */
function clearValidationError(input, error) {
  if (!input || !error) return;

  input.setAttribute('aria-invalid', 'false');
  error.textContent = '';
  hideElement(error);
}

/**
 * Get appropriate error message for a field
 * @param {string} field Field name
 * @returns {string} Error message
 */
function getErrorMessage(field) {
  const messages = {
    name: 'Please enter your name',
    email: 'Please enter a valid email address',
    message: 'Please enter a message (at least 10 characters)'
  };

  return messages[field] || 'This field is required';
}

/**
 * Show an element by removing the hidden class
 * @param {HTMLElement} element Element to show
 */
function showElement(element) {
  if (!element) return;
  element.classList.remove('hidden');
}

/**
 * Hide an element by adding the hidden class
 * @param {HTMLElement} element Element to hide
 */
function hideElement(element) {
  if (!element) return;
  element.classList.add('hidden');
}

/**
 * Submit form data to the server
 * @param {Object} formData Form data to submit as JSON
 * @returns {Promise<Object>} Response object
 */
async function submitFormData(formData) {
  try {
    // For demo purposes, we're using a mock API endpoint
    // In production, replace this with your actual API endpoint
    const apiUrl = 'https://api.architect.solutions/contact';

    // Log the submission for demonstration
    console.log('Submitting form data:', formData);

    // In a real implementation, this would be an actual fetch call:
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(formData)
    // });
    // const data = await response.json();
    // return data;

    // For demonstration, simulate a successful API response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful submission
        resolve({
          success: true,
          message: 'Form submitted successfully',
          id: 'mock-' + Date.now(),
          timestamp: new Date().toISOString()
        });

        // For testing error state, uncomment:
        // resolve({
        //   success: false,
        //   message: 'Server error: Could not process request'
        // });
      }, 1500); // Simulate network delay
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'There was a problem submitting the form. Please try again.'
    };
  }
}

/**
 * Track form submission event
 * @param {string} formName Name of the form
 */
function trackFormSubmission(formName) {
  // Check if Google Analytics is available
  if (typeof gtag === 'function') {
    gtag('event', 'form_submit', {
      'event_category': 'Engagement',
      'event_label': formName
    });
  }
}
