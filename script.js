/**
 * GLAMOUR BEAUTY PARLOUR — JAVASCRIPT
 * =====================================
 * Author: Glamour Beauty Parlour
 * Description: All interactive behaviour for the
 *   Glamour Beauty landing page.
 *
 * Features / Functions:
 *   1. Navbar: scroll shadow + hamburger toggle + auto-close
 *   2. Active nav-link tracking on scroll
 *   3. Scroll-reveal: IntersectionObserver animates .reveal elements
 *   4. Gallery Lightbox: open / close / navigate / keyboard
 *   5. Contact Form: client-side validation + success feedback
 *   6. Booking Popup: show / close from hero CTA
 */

// =============================================
// 1. NAVBAR — SCROLL SHADOW + HAMBURGER TOGGLE
// =============================================

/**
 * Elements we'll reference throughout this file.
 * Cached at the top to avoid repeated DOM queries.
 */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');

if (!navbar || !hamburger || !navLinks) {
  // Not on index.html — skip all landing page scripts
} else {

/**
 * addScrolledClass()
 * Adds the .scrolled CSS class to the navbar once the
 * user scrolls past 60px, which changes the background
 * from transparent glass to a solid dark colour.
 */
function addScrolledClass() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Run on page load and on every scroll event
window.addEventListener('scroll', addScrolledClass);
addScrolledClass(); // run once immediately

/**
 * toggleMenu()
 * Opens or closes the mobile slide-in menu.
 * Toggles .open on both the hamburger button and the
 * nav-links list, and updates aria-expanded for accessibility.
 */
function toggleMenu() {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);

  // Prevent body scrolling while menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);

/**
 * Close the mobile menu when any nav link is clicked.
 * This improves UX on single-page scroll sites.
 */
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/**
 * Close the mobile menu when user clicks outside of it.
 */
document.addEventListener('click', function (event) {
  const clickedInsideNav = navLinks.contains(event.target);
  const clickedHamburger = hamburger.contains(event.target);

  if (!clickedInsideNav && !clickedHamburger && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


// =============================================
// 2. ACTIVE NAV-LINK TRACKING ON SCROLL
// =============================================

/**
 * All page sections and their matching nav links.
 * When a section enters the viewport, its nav link
 * gets the .active class highlighted.
 */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

/**
 * updateActiveLink()
 * Determines which section is currently visible
 * and activates the corresponding nav link.
 */
function updateActiveLink() {
  let currentSection = '';

  sections.forEach(function (section) {
    // A section is "active" when its top is within 200px of the viewport top
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 120) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(function (link) {
    link.classList.remove('active');
    // Match link href="#sectionId" to the current section
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();


// =============================================
// 3. SCROLL-REVEAL ANIMATION
// =============================================

/**
 * IntersectionObserver watches all elements with class .reveal.
 * When they enter the viewport (threshold: 15%), the .visible
 * class is added, which triggers the CSS slide-up transition
 * defined in style.css (.reveal → .reveal.visible).
 */
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing (no need to animate again)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,   // element must be 15% visible to trigger
    rootMargin: '0px 0px -40px 0px'  // trigger slightly before bottom edge
  }
);

// Observe every .reveal element on the page
document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});


// =============================================
// 4. GALLERY LIGHTBOX
// =============================================

/**
 * Gallery image source paths and alt text.
 * Kept as an array so prev/next navigation is trivial.
 */
const galleryImages = [
  { src: 'img1.jpg', alt: 'Hair Styling' },
  { src: 'img2.jpg', alt: 'Nail Art' },
  { src: 'img3.jpg', alt: 'Facial Care' },
  { src: 'img4.jpg', alt: 'Bridal Makeup' },
  { src: 'img5.jpg', alt: 'Herbal Treatment' },
];

/** Currently visible image index in the lightbox */
let currentLightboxIndex = 0;

const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');

/**
 * openLightbox(index)
 * Opens the lightbox and shows the image at [index].
 * @param {number} index - Index in galleryImages array
 */
function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // lock scroll
}

/**
 * closeLightbox()
 * Hides the lightbox overlay and restores page scrolling.
 */
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * changeLightbox(direction)
 * Moves to the previous (-1) or next (+1) image,
 * wrapping around at the ends.
 * @param {number} direction - -1 for prev, +1 for next
 */
function changeLightbox(direction) {
  currentLightboxIndex =
    (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

/**
 * updateLightboxImage()
 * Updates the <img> src/alt and the counter text
 * based on currentLightboxIndex.
 */
function updateLightboxImage() {
  var image = galleryImages[currentLightboxIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightboxCounter.textContent =
    (currentLightboxIndex + 1) + ' / ' + galleryImages.length;
}

/**
 * Keyboard support for lightbox:
 *   Escape → close
 *   ArrowLeft → previous image
 *   ArrowRight → next image
 */
document.addEventListener('keydown', function (event) {
  if (!lightbox.classList.contains('active')) return;

  if (event.key === 'Escape')      { closeLightbox(); }
  if (event.key === 'ArrowLeft')   { changeLightbox(-1); }
  if (event.key === 'ArrowRight')  { changeLightbox(1); }
});

/**
 * Close lightbox when clicking the dark overlay background
 * (but not when clicking the image itself).
 */
lightbox.addEventListener('click', function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


// =============================================
// 5. CONTACT FORM — VALIDATION + FEEDBACK
// =============================================

const contactForm     = document.getElementById('contact-form');
const btnSubmit       = document.getElementById('btn-submit');
const btnSubmitText   = document.getElementById('btn-submit-text');
const btnSubmitSpin   = document.getElementById('btn-submit-spinner');

/**
 * validateField(input, errorId, message)
 * Marks an input as invalid and shows an error message.
 * Returns false so the calling function knows validation failed.
 *
 * @param {HTMLElement} input   - The input to mark invalid
 * @param {string}      errorId - ID of the error <span>
 * @param {string}      message - Error message to display
 * @returns {boolean} false
 */
function validateField(input, errorId, message) {
  input.classList.add('error');
  document.getElementById(errorId).textContent = message;
  return false;
}

/**
 * clearField(input, errorId)
 * Clears the error state from an input.
 */
function clearField(input, errorId) {
  input.classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

/**
 * isValidEmail(email)
 * Basic email format check using a regex.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Form submit event handler.
 * Validates all required fields, shows errors inline,
 * then simulates a booking request (1.5s delay) and
 * shows the success popup.
 */
contactForm.addEventListener('submit', function (event) {
  event.preventDefault(); // stop native form submission

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const serviceInput = document.getElementById('service');
  let isValid = true;

  // --- Validate: Name (required, min 2 chars) ---
  if (nameInput.value.trim().length < 2) {
    isValid = validateField(nameInput, 'name-error', 'Please enter your full name.');
  } else {
    clearField(nameInput, 'name-error');
  }

  // --- Validate: Email (required, format check) ---
  if (!emailInput.value.trim()) {
    isValid = validateField(emailInput, 'email-error', 'Email address is required.');
  } else if (!isValidEmail(emailInput.value.trim())) {
    isValid = validateField(emailInput, 'email-error', 'Please enter a valid email address.');
  } else {
    clearField(emailInput, 'email-error');
  }

  // --- Validate: Service selection ---
  if (!serviceInput.value) {
    isValid = validateField(serviceInput, 'service-error', 'Please select a service.');
  } else {
    clearField(serviceInput, 'service-error');
  }

  // If any field failed validation, stop here
  if (!isValid) return;

  // --- All valid: show loading state ---
  btnSubmit.disabled = true;
  btnSubmitText.textContent = 'Sending…';
  btnSubmitSpin.classList.remove('hidden');

  /**
   * Simulate a network request with a 1.5s timeout.
   * In a real project this would be a fetch() API call.
   */
  setTimeout(function () {
    // Reset button state
    btnSubmit.disabled = false;
    btnSubmitText.textContent = 'Send Booking Request';
    btnSubmitSpin.classList.add('hidden');

    // Clear the form fields
    contactForm.reset();

    // Show the success popup
    showBookingPopup();
  }, 1500);
});

/**
 * Live validation: clear errors as the user types.
 * Improves UX by giving immediate positive feedback.
 */
['name', 'email', 'service'].forEach(function (fieldId) {
  var field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('input', function () {
      clearField(field, fieldId + '-error');
    });
  }
});


// =============================================
// 6. BOOKING POPUP — SHOW / CLOSE
// =============================================

const popupOverlay = document.getElementById('popup-overlay');

/**
 * showBookingPopup()
 * Displays the booking confirmation popup overlay.
 * Called by the hero CTA button and on form submit success.
 */
function showBookingPopup() {
  popupOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * closeBookingPopup()
 * Hides the popup overlay and restores scrolling.
 */
function closeBookingPopup() {
  popupOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Close popup when clicking the dark overlay background
 * (but not the card itself).
 */
popupOverlay.addEventListener('click', function (event) {
  if (event.target === popupOverlay) {
    closeBookingPopup();
  }
});

/**
 * Close popup with Escape key.
 */
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !popupOverlay.classList.contains('hidden')) {
    closeBookingPopup();
  }
});

}

/* =============================================
   TASK 2 — INTERACTIVE COMPONENT SCRIPTS
   ============================================= */

// =============================================
// COMPONENT 1: TESTIMONIALS CAROUSEL
// =============================================

/**
 * Testimonials Carousel
 * ---------------------
 * Features:
 *   - Auto-plays every 4 seconds (pauses on hover)
 *   - Click prev/next arrows to navigate
 *   - Click dot indicators to jump to a slide
 *   - Drag (mouse) and swipe (touch) to change slides
 *
 * Technique: moves a flex track with CSS transform: translateX()
 */
(function () {
  var track       = document.getElementById('carousel-track');
  var prevBtn     = document.getElementById('carousel-prev');
  var nextBtn     = document.getElementById('carousel-next');
  var dotsWrapper = document.getElementById('carousel-dots');

  if (!track) return; // guard: carousel may not exist on components.html

  var slides      = track.querySelectorAll('.carousel-slide');
  var dots        = dotsWrapper ? dotsWrapper.querySelectorAll('.dot') : [];
  var total       = slides.length;
  var current     = 0;
  var autoTimer   = null;
  var INTERVAL    = 4000; // ms between auto-advances

  /**
   * goTo(index)
   * Moves the carousel to the specified slide index.
   * Updates dots and aria-selected attributes.
   * @param {number} index
   */
  function goTo(index) {
    // Clamp and wrap index
    current = ((index % total) + total) % total;
    // Slide the track
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    // Update dots
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  /** Move one slide forward */
  function next() { goTo(current + 1); }

  /** Move one slide backward */
  function prev() { goTo(current - 1); }

  /** Start the auto-play timer */
  function startAuto() {
    autoTimer = setInterval(next, INTERVAL);
  }

  /** Stop the auto-play timer */
  function stopAuto() {
    clearInterval(autoTimer);
  }

  // Wire up arrow buttons
  nextBtn.addEventListener('click', function () { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', function () { stopAuto(); prev(); startAuto(); });

  // Wire up dot buttons
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  // Pause auto-play when mouse is over the carousel
  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  // ---- Drag & Touch Swipe Support ----
  var dragStartX  = 0;
  var dragCurrentX = 0;
  var isDragging  = false;
  var DRAG_THRESHOLD = 50; // px needed to trigger a slide change

  /** Pointer-agnostic drag start */
  function onDragStart(x) {
    isDragging  = true;
    dragStartX  = x;
    dragCurrentX = x;
    track.classList.add('dragging');
    stopAuto();
  }

  /** Pointer-agnostic drag move */
  function onDragMove(x) {
    if (!isDragging) return;
    dragCurrentX = x;
  }

  /** Pointer-agnostic drag end */
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    var delta = dragCurrentX - dragStartX;
    if (delta < -DRAG_THRESHOLD) { next(); }
    else if (delta > DRAG_THRESHOLD) { prev(); }
    startAuto();
  }

  // Mouse events
  track.addEventListener('mousedown',  function (e) { onDragStart(e.clientX); });
  track.addEventListener('mousemove',  function (e) { onDragMove(e.clientX); });
  track.addEventListener('mouseup',    onDragEnd);
  track.addEventListener('mouseleave', onDragEnd);

  // Touch events
  track.addEventListener('touchstart', function (e) { onDragStart(e.touches[0].clientX); }, { passive: true });
  track.addEventListener('touchmove',  function (e) { onDragMove(e.touches[0].clientX); },  { passive: true });
  track.addEventListener('touchend',   onDragEnd);

  // Initialise
  goTo(0);
  startAuto();
}());


// =============================================
// COMPONENT 2: BEFORE / AFTER SLIDER
// =============================================

/**
 * BeforeAfterSlider
 * -----------------
 * The user drags a vertical handle left/right over two images.
 * The "before" image clips using CSS clip-path updated via JS.
 *
 * Technique: uses pointermove / pointerdown for unified mouse+touch.
 */
(function () {
  var slider   = document.getElementById('ba-slider');
  var handle   = document.getElementById('ba-handle');
  var before   = document.getElementById('ba-before');

  if (!slider) return; // guard

  var isDragging = false;

  /**
   * setPosition(percent)
   * Updates the visual state for a given handle position (0–100%).
   * @param {number} percent — 0 = full before, 100 = full after
   */
  function setPosition(percent) {
    // Clamp between 5% and 95% so labels remain visible
    percent = Math.min(95, Math.max(5, percent));
    // Move the handle line
    handle.style.left = percent + '%';
    // Clip the before image to only show the left portion
    before.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
    // Update ARIA value for screen readers
    handle.setAttribute('aria-valuenow', Math.round(percent));
  }

  /**
   * getPercent(event)
   * Converts a pointer event position to a percentage of the slider width.
   * @param {PointerEvent} event
   * @returns {number} — percentage 0–100
   */
  function getPercent(event) {
    var rect = slider.getBoundingClientRect();
    var x = event.clientX - rect.left;
    return (x / rect.width) * 100;
  }

  // Start dragging on pointerdown anywhere on the slider
  slider.addEventListener('pointerdown', function (e) {
    isDragging = true;
    slider.setPointerCapture(e.pointerId); // capture so drag works outside element
    setPosition(getPercent(e));
  });

  // Update position while dragging
  slider.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    setPosition(getPercent(e));
  });

  // Stop dragging on pointerup or pointercancel
  slider.addEventListener('pointerup',     function () { isDragging = false; });
  slider.addEventListener('pointercancel', function () { isDragging = false; });

  // Keyboard accessibility: arrow keys move the handle
  handle.addEventListener('keydown', function (e) {
    var current = parseFloat(handle.style.left) || 50;
    if (e.key === 'ArrowLeft')  { setPosition(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPosition(current + 5); e.preventDefault(); }
  });
  handle.setAttribute('tabindex', '0'); // make focusable

  // Start at 50%
  setPosition(50);
}());


// =============================================
// COMPONENT 3: FAQ ACCORDION
// =============================================

/**
 * Accordion
 * ---------
 * Click a trigger to open/close its panel.
 * Only one panel can be open at a time (exclusive toggle).
 *
 * Technique: toggles .open class; CSS max-height transitions do the animation.
 */
(function () {
  var accordion = document.getElementById('faq-accordion');
  if (!accordion) return; // guard

  var triggers = accordion.querySelectorAll('.accordion-trigger');

  /**
   * closeAll()
   * Closes every accordion item.
   */
  function closeAll() {
    accordion.querySelectorAll('.accordion-item').forEach(function (item) {
      item.classList.remove('open');
      item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Each trigger toggles the parent item open/closed.
   * If clicked item is already open → close it.
   * If a different item is open → close it and open the new one.
   */
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item    = trigger.closest('.accordion-item');
      var isOpen  = item.classList.contains('open');

      // Close everything first
      closeAll();

      // If the clicked item was closed, open it
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}());


// =============================================
// COMPONENT 4: ANIMATED COUNTER
// =============================================

/**
 * AnimatedCounter
 * ---------------
 * Finds all elements with [data-count-to] and animates
 * their text value from 0 up to the target number
 * when they scroll into view.
 *
 * Usage in HTML:  <span data-count-to="500" data-suffix="+">0</span>
 *
 * Technique: requestAnimationFrame loop with easeOutQuart easing.
 */
(function () {
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  /**
   * easeOutQuart(t)
   * Easing function: fast start, slow end.
   * @param {number} t — progress 0 to 1
   * @returns {number}
   */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * animateCounter(el)
   * Counts up the text content of el from 0 to data-count-to
   * over a fixed duration.
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-count-to'), 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var duration = 1800; // ms
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var value    = Math.round(easeOutQuart(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Use IntersectionObserver to fire the animation when each counter
  // scrolls into view. Once triggered, stop observing.
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
}());


// =============================================
// COMPONENT 5: TOAST NOTIFICATION SYSTEM
// =============================================

/**
 * Toast System
 * ------------
 * showToast(type, title, message, duration)
 *   - type:     'success' | 'error' | 'warning' | 'info'
 *   - title:    bold headline
 *   - message:  body text
 *   - duration: ms before auto-dismiss (default 4000)
 *
 * Features:
 *   - Stacks multiple toasts vertically
 *   - Each toast has a shrinking progress bar
 *   - Manual close button
 *   - Smooth slide-in / slide-out animations
 *
 * The container is created automatically on first use.
 */

/** Lazily-created toast container element */
var toastContainer = null;

/**
 * getToastContainer()
 * Returns (or creates) the fixed toast container div.
 * @returns {HTMLElement}
 */
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'false');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * ICON_MAP — emoji icons for each toast type.
 */
var TOAST_ICONS = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️'
};

/**
 * showToast(type, title, message, duration)
 * Creates and displays a toast notification.
 *
 * @param {string} type     — 'success' | 'error' | 'warning' | 'info'
 * @param {string} title    — Bold notification title
 * @param {string} message  — Secondary description
 * @param {number} duration — Auto-dismiss delay in ms (default 4000)
 */
function showToast(type, title, message, duration) {
  duration = duration || 4000;
  var container = getToastContainer();

  // Build toast element
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  // Pass duration as CSS variable so the progress animation matches
  toast.style.setProperty('--toast-duration', duration + 'ms');

  toast.innerHTML =
    '<span class="toast-icon" aria-hidden="true">' + (TOAST_ICONS[type] || 'ℹ️') + '</span>' +
    '<div class="toast-body">' +
      '<div class="toast-title">' + title + '</div>' +
      '<div class="toast-message">' + message + '</div>' +
    '</div>' +
    '<button class="toast-close" aria-label="Dismiss notification">&times;</button>' +
    '<div class="toast-progress"></div>';

  container.appendChild(toast);

  /**
   * dismissToast()
   * Adds the slide-out animation class, then removes the element.
   */
  function dismissToast() {
    toast.classList.add('toast-out');
    // Wait for the animation to finish before removing from DOM
    toast.addEventListener('animationend', function () {
      toast.remove();
    }, { once: true });
  }

  // Close button handler
  toast.querySelector('.toast-close').addEventListener('click', dismissToast);

  // Auto-dismiss after [duration] ms
  var autoTimer = setTimeout(dismissToast, duration);

  // If user hovers, pause auto-dismiss (reset timer on leave)
  toast.addEventListener('mouseenter', function () { clearTimeout(autoTimer); });
  toast.addEventListener('mouseleave', function () {
    autoTimer = setTimeout(dismissToast, 1000); // short delay after un-hover
  });
}

// Expose showToast globally for components.html demo buttons
window.showToast = showToast;


// =============================================
// COMPONENT 6: MULTI-STEP BOOKING WIZARD
// =============================================

/**
 * Wizard
 * ------
 * A 3-step form with:
 *   - Step indicators (circles + connecting line)
 *   - Top progress bar that fills as steps complete
 *   - Step content panels that fade in
 *   - Back / Next navigation with per-step validation
 *   - Final success confirmation panel
 *
 * The wizard HTML is in components.html (standalone demo).
 * This JS supports any .wizard element on the page.
 */
(function () {
  var wizard = document.getElementById('booking-wizard');
  if (!wizard) return; // only runs on components.html

  var steps       = wizard.querySelectorAll('.wizard-step-item');
  var panels      = wizard.querySelectorAll('.wizard-panel');
  var progressFill = wizard.querySelector('.wizard-progress-fill');
  var currentStep = 1; // 1-indexed
  var totalSteps  = steps.length;

  /**
   * updateWizard(step)
   * Renders the correct step by:
   *   1. Updating step circle states (active / completed)
   *   2. Showing the correct panel
   *   3. Animating the progress bar
   * @param {number} step — 1-indexed step number
   */
  function updateWizard(step) {
    // Update step indicators
    steps.forEach(function (s, i) {
      var num = i + 1;
      s.classList.remove('active', 'completed');
      if (num === step)      { s.classList.add('active'); }
      else if (num < step)   { s.classList.add('completed'); s.querySelector('.step-circle').textContent = '✓'; }
      else                   { s.querySelector('.step-circle').textContent = num; }
    });

    // Show the correct panel
    panels.forEach(function (p, i) {
      p.classList.toggle('active', i + 1 === step);
    });

    // Update progress bar (step 1 = 33%, step 2 = 66%, step 3 = 100%)
    var percent = ((step - 1) / (totalSteps - 1)) * 100;
    if (progressFill) { progressFill.style.width = percent + '%'; }
  }

  /**
   * validateStep(step)
   * Checks if the current step's required inputs are filled.
   * Shows a toast warning if not.
   * @param {number} step
   * @returns {boolean}
   */
  function validateStep(step) {
    var panel = wizard.querySelector('.wizard-panel:nth-child(' + step + ')');
    if (!panel) return true;

    // Step 1: must pick a service (radio)
    if (step === 1) {
      var checked = panel.querySelector('input[type="radio"]:checked');
      if (!checked) {
        showToast('warning', 'Select a Service', 'Please choose a service to continue.');
        return false;
      }
    }

    // Step 2: name + email required
    if (step === 2) {
      var nameEl  = panel.querySelector('#wiz-name');
      var emailEl = panel.querySelector('#wiz-email');
      if (nameEl && nameEl.value.trim().length < 2) {
        showToast('error', 'Name Required', 'Please enter your full name.');
        nameEl.focus();
        return false;
      }
      if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        showToast('error', 'Invalid Email', 'Please enter a valid email address.');
        emailEl.focus();
        return false;
      }
    }

    return true;
  }

  // Wire up Next buttons
  wizard.querySelectorAll('.btn-wizard-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!validateStep(currentStep)) return;
      if (currentStep < totalSteps) {
        currentStep++;
        updateWizard(currentStep);
      }
    });
  });

  // Wire up Back buttons
  wizard.querySelectorAll('.btn-wizard-back').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 1) {
        currentStep--;
        updateWizard(currentStep);
      }
    });
  });

  // Initialise wizard at step 1
  updateWizard(1);
}());


// =============================================
// COMPONENT 7: FLOATING ACTION BUTTON (FAB)
// =============================================

/**
 * FAB Speed-Dial
 * --------------
 * The main ✦ button toggles a vertical stack of 3 quick-action buttons:
 *   💬 WhatsApp | 📅 Book Now | 📞 Call
 * The icon rotates 135° when open for a visual "×" cue.
 * Clicking outside the FAB closes it.
 */
(function () {
  var fabContainer = document.getElementById('fab-container');
  var fabMain      = document.getElementById('fab-main');
  var fabActions   = document.getElementById('fab-actions');

  if (!fabMain) return;

  /**
   * openFAB() / closeFAB()
   * Toggle the FAB open/closed state and update ARIA.
   */
  function openFAB() {
    fabContainer.classList.add('open');
    fabMain.setAttribute('aria-expanded', 'true');
    fabActions.setAttribute('aria-hidden', 'false');
  }

  function closeFAB() {
    fabContainer.classList.remove('open');
    fabMain.setAttribute('aria-expanded', 'false');
    fabActions.setAttribute('aria-hidden', 'true');
  }

  function toggleFAB() {
    fabContainer.classList.contains('open') ? closeFAB() : openFAB();
  }

  fabMain.addEventListener('click', function (e) {
    e.stopPropagation(); // prevent document click from immediately closing
    toggleFAB();
  });

  // Close FAB when clicking outside
  document.addEventListener('click', function (e) {
    if (!fabContainer.contains(e.target)) { closeFAB(); }
  });

  // Close FAB with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeFAB(); }
  });

  // Close FAB when a speed-dial action link is clicked
  fabActions.querySelectorAll('.fab-action').forEach(function (link) {
    link.addEventListener('click', closeFAB);
  });
}());


// =============================================
// SCROLL-TO-TOP BUTTON
// =============================================

/**
 * Scroll-to-Top
 * -------------
 * Shows a ↑ button in the bottom-left corner once the user
 * has scrolled past 400px. Clicking it smoothly scrolls back to the top.
 */
(function () {
  var scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Smooth scroll to top on click
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());