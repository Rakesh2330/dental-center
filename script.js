/**
 * Dr. Ahalya's Dento Neuro Centre - Restructured Interactive Experience
 * Pure Vanilla JavaScript - High Performance & Accessibility
 */

/* ============================================================
   PRELOADER CONTROLLER — runs immediately, before DOM ready
   ============================================================ */
(function () {
  const preloader = document.getElementById('sitePreloader');
  const bar       = document.getElementById('preloaderBar');
  const label     = document.getElementById('preloaderLabel');
  if (!preloader) return;

  // Apply saved theme instantly so preloader renders correctly
  const savedTheme = localStorage.getItem('dnc-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  let dismissed = false;
  function dismissPreloader() {
    if (dismissed) return;
    dismissed = true;

    if (bar) bar.style.width = '100%';
    if (label) label.textContent = 'Ready';

    setTimeout(() => {
      preloader.classList.add('preloader-done');
      document.body.classList.remove('is-loading');

      // Reveal elements already in viewport
      document.querySelectorAll('.scroll-reveal, .reveal-from-left, .reveal-from-right, .reveal-zoom').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150 && rect.bottom > -50) {
          el.classList.add('is-revealed', 'reveal-done');
        }
      });

      setTimeout(() => {
        preloader.remove();
      }, 280);
    }, 100);
  }

  // Dismiss immediately once DOM is interactive (instant load feel)
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(dismissPreloader, 60);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(dismissPreloader, 60), { once: true });
    window.addEventListener('load', dismissPreloader, { once: true });
  }

  // Safety fallback: never hold page for more than 500ms under any circumstance
  setTimeout(dismissPreloader, 500);
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Toggle (Light / Dark Mode) ---
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('dnc-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dnc-theme', newTheme);
  });

  // --- 2. Scroll Progress Bar & Sticky Header & Scroll To Top ---
  const scrollProgressBar = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress Bar
    if (scrollProgressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Sticky Header Elevation
    if (scrollTop > 25) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Scroll To Top FAB Visibility
    if (scrollTopBtn) {
      if (scrollTop > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Nav Link Active State (Scroll Spy)
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      const secId = sec.getAttribute('id');

      if (scrollTop >= secTop && scrollTop < secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 3. Live Centre Status Indicator ---
  const liveStatusText = document.getElementById('liveStatusText');
  function updateLiveStatus() {
    if (!liveStatusText) return;
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1: Mon ... 6: Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hours + minutes / 60;

    if (day === 0) {
      liveStatusText.textContent = "Sunday Service: Prior Bookings & Emergency Triage Active";
    } else {
      if (timeVal >= 10 && timeVal < 14) {
        liveStatusText.textContent = "Morning OPD Active Now | Saraswathipuram (Until 2:00 PM)";
      } else if (timeVal >= 14 && timeVal < 16) {
        liveStatusText.textContent = "Mid-Day Disinfection Protocol | Evening OPD Starts at 4:00 PM";
      } else if (timeVal >= 16 && timeVal < 20) {
        liveStatusText.textContent = "Evening OPD Active Now | Saraswathipuram (Until 8:00 PM)";
      } else {
        liveStatusText.textContent = "Centre OPD Closed for Tonight | Resumes Tomorrow at 10:00 AM";
      }
    }
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);

  // --- 4. Mobile Drawer Navigation ---
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --- 5. Doctors Bio Data & Interactive Modal ---
  const doctorsData = {
    ahalya: {
      name: "Dr. Ahalya N",
      role: "Dental Surgeon & Aesthetic Specialist",
      qualifications: "BDS (RGUHS Bangalore) | Reg. No. 44345 A (KDC)",
      experience: "6+ Years Specialized Clinical Experience",
      membership: "Indian Dental Association (IDA) Active Member",
      image: "assets/dr-ahalya.jpg",
      bioText: "Dr. Ahalya N is a leading dental surgeon in Mysuru known for combining clinical accuracy with aesthetic smile symmetry. She specializes in single-sitting pain-free root canals, diode laser therapies, restorative cosmetics, and pediatric dental care with an empathetic, patient-first approach.",
      highlights: [
        "Single-Sitting Pain-Free Rotary Root Canal Treatments (Apex-Controlled)",
        "Soft-Tissue Diode Laser Contouring & Bloodless Frenectomy",
        "Digital Smile Designing & Handcrafted Ceramic Veneers",
        "Biomimetic Tooth Restorations & Aesthetic Inlays / Onlays",
        "Comprehensive Preventive & Kid-Friendly Dentistry"
      ],
      consultationHours: "Mon – Sat: 10:00 AM – 2:00 PM & 4:00 PM – 8:00 PM",
      deptCode: "dental"
    },
    puneeth: {
      name: "Dr. Puneeth S",
      role: "Senior Consultant Neurosurgeon & Spine Specialist",
      qualifications: "MBBS, MS, MCh Neurosurgery (PGIMER Chandigarh) | Reg. No. KMC 106238",
      experience: "10+ Years Advanced Neurosurgical Practice",
      membership: "Neurological Society of India (NSI) & Bangalore Neurological Society",
      image: "assets/dr-puneeth.jpg",
      bioText: "Dr. Puneeth S earned his super-specialist MCh Neurosurgery degree from India's premier institute PGIMER Chandigarh. He has managed hundreds of complex neurosurgical cases including brain tumor resections, trauma decompressions, vascular pathologies, and minimally invasive keyhole spine surgeries (MISS).",
      highlights: [
        "Minimally Invasive Keyhole Spine Surgeries (MISS Microdiscectomy)",
        "Microsurgical Resection of Complex Brain & Cranial Tumors",
        "Comprehensive Care for Stroke, Aneurysms & Head Trauma",
        "Diagnostic Workup for Trigeminal Neuralgia & Intractable Migraines",
        "Ethical Second Opinion Reviews for Brain & Spine MRIs / CT Scans"
      ],
      consultationHours: "Mon – Sat: Evening 6:00 PM – 8:00 PM (Every 15-Min Slot by Prior Appointment)",
      deptCode: "neurosurgery"
    }
  };

  const bioModalBackdrop = document.getElementById('bioModalBackdrop');
  const bioModalClose = document.getElementById('bioModalClose');
  const bioModalAvatar = document.getElementById('bioModalAvatar');
  const bioModalName = document.getElementById('bioModalName');
  const bioModalRole = document.getElementById('bioModalRole');
  const bioModalExp = document.getElementById('bioModalExp');
  const bioModalReg = document.getElementById('bioModalReg');
  const bioModalAbout = document.getElementById('bioModalAbout');
  const bioModalList = document.getElementById('bioModalList');
  const bioModalTiming = document.getElementById('bioModalTiming');
  const bioModalBookBtn = document.getElementById('bioModalBookBtn');

  document.querySelectorAll('[data-doctor-bio]').forEach(button => {
    button.addEventListener('click', (e) => {
      const docKey = e.currentTarget.getAttribute('data-doctor-bio');
      const doc = doctorsData[docKey];
      if (!doc) return;

      if (bioModalAvatar) bioModalAvatar.src = doc.image;
      if (bioModalName) bioModalName.textContent = doc.name;
      if (bioModalRole) bioModalRole.textContent = `${doc.role} — ${doc.qualifications}`;
      if (bioModalExp) bioModalExp.textContent = doc.experience;
      if (bioModalReg) bioModalReg.textContent = `${doc.qualifications.split('|')[1]?.trim() || ''} • ${doc.membership}`;
      if (bioModalAbout) bioModalAbout.textContent = doc.bioText;
      if (bioModalTiming) bioModalTiming.textContent = doc.consultationHours;

      if (bioModalList) {
        bioModalList.innerHTML = '';
        doc.highlights.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          bioModalList.appendChild(li);
        });
      }

      if (bioModalBookBtn) {
        bioModalBookBtn.onclick = () => {
          closeBioModal();
          prefillBooking(doc.deptCode, doc.name);
          const formSection = document.getElementById('appointment');
          formSection?.scrollIntoView({ behavior: 'smooth' });
        };
      }

      openBioModal();
    });
  });

  function openBioModal() {
    bioModalBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBioModal() {
    bioModalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  bioModalClose?.addEventListener('click', closeBioModal);
  bioModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === bioModalBackdrop) closeBioModal();
  });

  // --- 6. Services Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCat = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCat === 'all' || cardCat === filterCat) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });

      if (window.refreshFilterAnimation) {
        setTimeout(() => { window.refreshFilterAnimation(); }, 20);
      }
    });
  });

  // --- 6.5 Hero Clinic Images Carousel ---
  // Requirement: 3 images only, starts after 2s, auto-scrolls every 3s
  function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoInterval = null;
    let initialTimer = null;
    let isHovered = false;

    function showSlide(index) {
      if (index === currentIndex) return;
      slides[currentIndex]?.classList.remove('active');
      dots[currentIndex]?.classList.remove('active');
      dots[currentIndex]?.setAttribute('aria-selected', 'false');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex]?.classList.add('active');
      dots[currentIndex]?.classList.add('active');
      dots[currentIndex]?.setAttribute('aria-selected', 'true');
    }

    function advanceSlide() {
      showSlide(currentIndex + 1);
    }

    function startAutoScroll() {
      stopAutoScroll();
      autoInterval = setInterval(() => {
        if (!isHovered) {
          advanceSlide();
        }
      }, 3000); // Auto-scroll every 3 seconds
    }

    function stopAutoScroll() {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
      if (initialTimer) {
        clearTimeout(initialTimer);
        initialTimer = null;
      }
    }

    // Dot click events
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoScroll();
      });
    });

    // Pause on hover, resume on leave
    carousel.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    carousel.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Mobile touch swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isHovered = false;
      if (touchStartX - touchEndX > 45) {
        advanceSlide();
        startAutoScroll();
      } else if (touchEndX - touchStartX > 45) {
        showSlide(currentIndex - 1);
        startAutoScroll();
      }
    }, { passive: true });

    // Initial transition after 2 seconds, then recurring every 3 seconds
    initialTimer = setTimeout(() => {
      if (!isHovered) {
        advanceSlide();
      }
      startAutoScroll();
    }, 2000);
  }

  initHeroCarousel();

  // --- 7. Facilities Lightbox Modal ---
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-caption')?.textContent || 'Centre Facility';
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // --- 8. FAQ Accordion & Live Keyword Search ---
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faqSearchInput');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-answer-panel');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherPanel = other.querySelector('.faq-answer-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        item.classList.remove('active');
        panel.style.maxHeight = null;
      }
    });
  });

  faqSearchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-trigger')?.textContent.toLowerCase() || '';
      const answer = item.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';

      if (question.includes(query) || answer.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // --- 9. Booking Form Engine & Pass Generator ---
  const bookingForm = document.getElementById('appointmentForm');
  const deptSelect = document.getElementById('deptSelect');
  const doctorSelect = document.getElementById('doctorSelect');
  const dateInput = document.getElementById('dateInput');
  const slotOptionsContainer = document.getElementById('slotOptionsContainer');
  const slotScheduleText = document.getElementById('slotScheduleText');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Dr. Puneeth S Neurosurgery Evening 15-Minute Slots (6:00 PM - 8:00 PM)
  const neuroSlots = [
    { value: "6:00 PM - 6:15 PM (Evening OPD)", label: "6:00 PM – 6:15 PM" },
    { value: "6:15 PM - 6:30 PM (Evening OPD)", label: "6:15 PM – 6:30 PM" },
    { value: "6:30 PM - 6:45 PM (Evening OPD)", label: "6:30 PM – 6:45 PM" },
    { value: "6:45 PM - 7:00 PM (Evening OPD)", label: "6:45 PM – 7:00 PM" },
    { value: "7:00 PM - 7:15 PM (Evening OPD)", label: "7:00 PM – 7:15 PM" },
    { value: "7:15 PM - 7:30 PM (Evening OPD)", label: "7:15 PM – 7:30 PM" },
    { value: "7:30 PM - 7:45 PM (Evening OPD)", label: "7:30 PM – 7:45 PM" },
    { value: "7:45 PM - 8:00 PM (Evening OPD)", label: "7:45 PM – 8:00 PM" }
  ];

  // Dental Surgery General Slots (Dr. Ahalya N)
  const dentalSlots = [
    { value: "Morning (10:00 AM - 2:00 PM)", label: "Morning: 10AM – 2PM", icon: "fa-regular fa-sun" },
    { value: "Evening (4:00 PM - 8:00 PM)", label: "Evening: 4PM – 8PM", icon: "fa-regular fa-moon" }
  ];

  // Joint Consultation Slots (Dental + Neuro Synergy: 6:00 PM - 8:00 PM)
  const jointSlots = [
    { value: "6:00 PM - 6:30 PM (Joint Consult)", label: "6:00 PM – 6:30 PM" },
    { value: "6:30 PM - 7:00 PM (Joint Consult)", label: "6:30 PM – 7:00 PM" },
    { value: "7:00 PM - 7:30 PM (Joint Consult)", label: "7:00 PM – 7:30 PM" },
    { value: "7:30 PM - 8:00 PM (Joint Consult)", label: "7:30 PM – 8:00 PM" }
  ];

  function updateTimeSlots() {
    if (!slotOptionsContainer) return;

    const deptVal = deptSelect ? deptSelect.value : 'dental';
    const docVal  = doctorSelect ? doctorSelect.value : '';

    const isNeuro = deptVal === 'neurosurgery' || docVal.includes('Puneeth');
    const isJoint = deptVal === 'joint';

    let currentSlots = dentalSlots;
    let scheduleInfo = "Dr. Ahalya N: 10:00 AM – 2:00 PM & 4:00 PM – 8:00 PM";

    if (isNeuro) {
      currentSlots = neuroSlots;
      scheduleInfo = "Dr. Puneeth S Evening OPD: 6:00 PM – 8:00 PM (Every 15 min)";
      slotOptionsContainer.classList.add('slot-grid-neuro');
    } else if (isJoint) {
      currentSlots = jointSlots;
      scheduleInfo = "Joint Consult (Dental + Neuro): Evening 6:00 PM – 8:00 PM";
      slotOptionsContainer.classList.add('slot-grid-neuro');
    } else {
      slotOptionsContainer.classList.remove('slot-grid-neuro');
    }

    if (slotScheduleText) {
      slotScheduleText.textContent = scheduleInfo;
    }

    slotOptionsContainer.innerHTML = '';
    currentSlots.forEach((slotItem, index) => {
      const label = document.createElement('label');
      label.className = `slot-radio-label ${index === 0 ? 'selected' : ''}`;

      const iconHtml = slotItem.icon
        ? `<i class="${slotItem.icon}"></i> `
        : `<i class="fa-regular fa-clock"></i> `;

      label.innerHTML = `
        <input type="radio" name="slot" value="${slotItem.value}" ${index === 0 ? 'checked' : ''}>
        <span>${iconHtml}${slotItem.label}</span>
      `;

      label.addEventListener('click', () => {
        slotOptionsContainer.querySelectorAll('.slot-radio-label').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        const radio = label.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });

      slotOptionsContainer.appendChild(label);
    });
  }

  // Initial slot rendering
  updateTimeSlots();

  deptSelect?.addEventListener('change', () => {
    const val = deptSelect.value;
    if (val === 'dental') {
      doctorSelect.value = 'Dr. Ahalya N (Dental Surgeon)';
    } else if (val === 'neurosurgery') {
      doctorSelect.value = 'Dr. Puneeth S (Consultant Neurosurgeon)';
    } else {
      doctorSelect.value = 'Any Available Specialist';
    }
    updateTimeSlots();
  });

  doctorSelect?.addEventListener('change', () => {
    const docVal = doctorSelect.value;
    if (docVal.includes('Puneeth')) {
      deptSelect.value = 'neurosurgery';
    } else if (docVal.includes('Ahalya')) {
      deptSelect.value = 'dental';
    }
    updateTimeSlots();
  });

  window.prefillBooking = function(dept, doctorName) {
    if (deptSelect && dept) {
      deptSelect.value = dept;
    }
    if (doctorSelect && doctorName) {
      if (doctorName.includes('Ahalya')) {
        doctorSelect.value = 'Dr. Ahalya N (Dental Surgeon)';
      } else if (doctorName.includes('Puneeth')) {
        doctorSelect.value = 'Dr. Puneeth S (Consultant Neurosurgeon)';
      }
    }
    updateTimeSlots();
  };

  const ticketModal = document.getElementById('ticketModalBackdrop');
  const ticketClose = document.getElementById('ticketClose');
  const printTicketBtn = document.getElementById('printTicketBtn');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const dept = deptSelect.options[deptSelect.selectedIndex].text;
    const doctor = doctorSelect.value;
    const date = dateInput.value;
    const selectedSlotRadio = document.querySelector('input[name="slot"]:checked');
    const slot = selectedSlotRadio ? selectedSlotRadio.value : 'Morning (10:00 AM - 2:00 PM)';
    const notes = document.getElementById('patientNotes').value.trim();

    if (!fullName || !phone) {
      showToast('Please provide your name and phone number.');
      return;
    }

    const token = 'DNC-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('ticketToken').textContent = token;
    document.getElementById('ticketPatient').textContent = fullName;
    document.getElementById('ticketPhone').textContent = phone;
    document.getElementById('ticketDept').textContent = dept;
    document.getElementById('ticketDoctor').textContent = doctor;
    document.getElementById('ticketDateTime').textContent = `${date} | ${slot}`;

    const waText = encodeURIComponent(
      `Hello Dr. Ahalya's Dento Neuro Centre, I have scheduled a consultation.\n\n` +
      `Appointment Pass ID: ${token}\n` +
      `Patient Name: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Specialty: ${dept}\n` +
      `Doctor: ${doctor}\n` +
      `Date & Slot: ${date} (${slot})\n` +
      (notes ? `Chief Symptoms: ${notes}\n` : '') +
      `\nPlease confirm my reservation.`
    );
    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.href = `https://wa.me/916360521761?text=${waText}`;
    }

    ticketModal?.classList.add('active');
    document.body.style.overflow = 'hidden';

    bookingForm.reset();
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
    updateTimeSlots();
  });

  function closeTicket() {
    ticketModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  ticketClose?.addEventListener('click', closeTicket);
  ticketModal?.addEventListener('click', (e) => {
    if (e.target === ticketModal) closeTicket();
  });

  printTicketBtn?.addEventListener('click', () => {
    window.print();
  });

  // --- 10. Copy Address & Toast System ---
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const centreAddressText = "165/1, Sahukar Chennaiah Road, Opposite Brahmasthana Kalyan Mantapa, Saraswathipuram, Mysuru, Karnataka – 570009";

  copyAddressBtn?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(centreAddressText).then(() => {
        showToast("Address copied to clipboard!");
      }).catch(() => {
        fallbackCopy(centreAddressText);
      });
    } else {
      fallbackCopy(centreAddressText);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast("Address copied to clipboard!");
  }

  function showToast(message) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  window.showToast = showToast;

  // --- 11. Scroll-Triggered Reveal Animations for Cards and Images ---
  initScrollAnimations();

  // --- 12. Hero Particle Canvas System ---
  initHeroParticles();

  function initHeroParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    let animFrameId = null;
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 18 : 32;
    const CONNECT_DIST  = isMobile ? 85 : 115;

    // Grey-only palette matching the monochrome design
    const LIGHT_COLORS = [
      [100, 116, 139], // slate-500
      [148, 163, 184], // slate-400
      [71,  85,  105], // slate-600
      [203, 213, 225], // slate-300
    ];
    const DARK_COLORS = [
      [100, 116, 139], // slate-500
      [148, 163, 184], // slate-400
      [71,  85,  105], // slate-600
      [203, 213, 225], // slate-300
    ];

    function resizeCanvas() {
      const hero = canvas.parentElement;
      if (!hero) return;
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
      const palette = isDark() ? DARK_COLORS : LIGHT_COLORS;
      const c = palette[Math.floor(Math.random() * palette.length)];
      return {
        x:  rand(0, canvas.width),
        y:  rand(0, canvas.height),
        vx: rand(-0.24, 0.24),
        vy: rand(-0.18, 0.18),
        r:  rand(1.6, 3.6),
        color: c,
        alpha: rand(0.25, 0.55),
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    }

    function drawParticle(p) {
      const a = isDark() ? p.alpha * 0.85 : p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
      ctx.fill();
    }

    function connectParticles() {
      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < pLen; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * (isDark() ? 0.16 : 0.1);
            const c = pi.color;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    let isVisible = true;
    function tick() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width  + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        drawParticle(p);
      });

      connectParticles();
      animFrameId = requestAnimationFrame(tick);
    }

    resizeCanvas();
    initParticles();
    animFrameId = requestAnimationFrame(tick);

    // Pause animation when hero is off-screen to save CPU & battery
    const heroObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animFrameId);
      }
    }, { threshold: 0.05 });
    heroObserver.observe(canvas.parentElement || canvas);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      initParticles();
    });
    resizeObserver.observe(canvas.parentElement);
  }


  // --- 13. Animated Stat Counters ---
  initStatCounters();

  function initStatCounters() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statNums = document.querySelectorAll('.stat-number[data-target]');
    if (!statNums.length) return;

    function animateCounter(el) {
      const target  = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '';
      const duration = 1600; // ms
      const start    = performance.now();

      function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value    = Math.round(easeOutQuart(progress) * target);
        el.textContent = value >= 1000
          ? value.toLocaleString() + suffix
          : value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      if (prefersReducedMotion) {
        el.textContent = target >= 1000
          ? target.toLocaleString() + suffix
          : target + suffix;
        return;
      }
      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.stat-card, .hero-visual-card, .synergy-card, .pillar-card, .doctor-card, .service-card, .gallery-card, .reason-card, .testimonial-card, .faq-item')
        .forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const cardSelectors = [
      '.stat-card',
      '.hero-visual-card',
      '.synergy-card',
      '.about-quote-box',
      '.pillar-card',
      '.doctor-card',
      '.service-card',
      '.facility-chip',
      '.gallery-card',
      '.reason-card',
      '.testimonial-card',
      '.faq-item',
      '.booking-info-sidebar',
      '.booking-form-container'
    ];

    const imageWrapperSelectors = [
      '.hero-img-container',
      '.doctor-image-wrapper',
      '.gallery-img-box'
    ];

    // Apply staggered reveal indices to grid containers
    const gridContainers = document.querySelectorAll(
      '.hero-stats-row, .synergy-grid, .pillars-grid, .doctors-grid, .services-cards-grid, .gallery-grid, .reasons-grid, .testimonials-grid'
    );

    gridContainers.forEach(grid => {
      const children = Array.from(grid.children);
      children.forEach((child, index) => {
        child.classList.add('scroll-reveal');
        child.setAttribute('data-stagger', index % 6);
      });
    });

    // Ensure all individual card elements have the scroll-reveal class
    cardSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('scroll-reveal')) {
          el.classList.add('scroll-reveal');
        }
      });
    });

    // Add cinematic zoom-in reveal effect to key image containers
    imageWrapperSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(imgWrap => {
        imgWrap.classList.add('scroll-reveal-img');
      });
    });

    // Hero visual card is active right away
    const heroVisualCard = document.querySelector('.hero-visual-card');
    if (heroVisualCard) {
      heroVisualCard.classList.add('is-revealed');
    }

    // IntersectionObserver with generous root margin and zero threshold to trigger before/as entering
    const observerOptions = {
      root: null,
      rootMargin: '120px 0px 120px 0px',
      threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-img');
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 160 && rect.bottom > -50) {
        // Already in or near viewport on initial load
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety timeout: ensure no content stays hidden if observer is delayed
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.is-revealed), .scroll-reveal-img:not(.is-revealed)').forEach(el => {
        el.classList.add('is-revealed');
      });
    }, 1000);

    // Re-trigger animation when filter tabs change
    window.refreshFilterAnimation = function() {
      const activeVisibleCards = document.querySelectorAll('.service-card[style*="display: flex"], .service-card:not([style*="display: none"])');
      activeVisibleCards.forEach((card, idx) => {
        card.setAttribute('data-stagger', idx % 6);
        card.classList.remove('is-revealed');
        void card.offsetWidth; // Force CSS reflow
        card.classList.add('is-revealed');
      });
    };
  }

  // ============================================================
  // PREMIUM SCROLL ANIMATION ENGINE
  // ============================================================
  initPremiumScrollAnimations();

  function initPremiumScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- A. Parallax on Hero Blobs & Image ---
    initParallax(prefersReducedMotion);

    // --- B. Word-split animated headings ---
    initSplitHeadings(prefersReducedMotion);

    // --- C. Clip-path + directional reveals ---
    initDirectionalReveals(prefersReducedMotion);

    // --- D. Magnetic hover on CTA buttons ---
    initMagneticButtons(prefersReducedMotion);

    // --- E. Section accent line progress ---
    initSectionAccentProgress();
  }

  /* ── A. Parallax ─────────────────────────────────────────── */
  function initParallax(reduced) {
    if (reduced) return;

    const blob1  = document.querySelector('.hero-blob-1');
    const blob2  = document.querySelector('.hero-blob-2');
    const blob3  = document.querySelector('.hero-blob-3');
    const halo   = document.querySelector('.hero-halo');
    const heroImg = document.querySelector('.hero-img');
    const heroDot = document.querySelector('.hero-dotgrid');

    let ticking = false;

    function applyParallax() {
      const scrollY = window.pageYOffset;
      const hero    = document.querySelector('.hero-section');
      if (!hero) return;
      const heroH   = hero.offsetHeight;
      // Only run while hero is partially in view
      if (scrollY > heroH * 1.2) {
        ticking = false;
        return;
      }

      const p = scrollY / heroH; // 0→1 as hero scrolls out

      if (blob1)  blob1.style.transform  = `translate(${p * -35}px, ${p * 45}px) rotate(${p * 12}deg)`;
      if (blob2)  blob2.style.transform  = `translate(${p * 40}px, ${p * -30}px) rotate(${p * -8}deg)`;
      if (blob3)  blob3.style.transform  = `translateX(-50%) scale(${1 + p * 0.08})`;
      if (halo)   halo.style.transform   = `translate(-50%, -50%) rotate(${p * 25}deg)`;
      if (heroImg) heroImg.style.transform = `scale(${1 + p * 0.06}) translateY(${p * -18}px)`;
      if (heroDot) heroDot.style.transform = `translateY(${scrollY * 0.18}px)`;

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── B. Word-split headings ──────────────────────────────── */
  function initSplitHeadings(reduced) {
    // Target all h2 section titles (not the hero h1)
    const headings = document.querySelectorAll('.section-title, .synergy-title, .doctor-name');
    if (!headings.length) return;

    headings.forEach(h => {
      // Skip if already processed
      if (h.dataset.splitDone) return;
      h.dataset.splitDone = 'true';

      const originalHTML = h.innerHTML;
      // Split text nodes only, preserve child elements (spans, em, etc.)
      const words = [];
      h.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split(/\s+/).filter(Boolean).forEach(w => {
            words.push({ type: 'word', text: w });
          });
          words.push({ type: 'space' });
        } else {
          words.push({ type: 'element', node: node.cloneNode(true) });
        }
      });

      if (reduced) return; // Keep original if reduced motion

      h.innerHTML = '';
      let wordIdx = 0;
      words.forEach(item => {
        if (item.type === 'word') {
          const span = document.createElement('span');
          span.className = 'word-reveal';
          span.style.transitionDelay = `${wordIdx * 65}ms`;
          span.textContent = item.text;
          h.appendChild(span);
          h.appendChild(document.createTextNode(' '));
          wordIdx++;
        } else if (item.type === 'element') {
          // Wrap element words too
          const wrapper = document.createElement('span');
          wrapper.className = 'word-reveal';
          wrapper.style.transitionDelay = `${wordIdx * 65}ms`;
          wrapper.appendChild(item.node);
          h.appendChild(wrapper);
          wordIdx++;
        }
      });
    });

    if (reduced) return;

    const wordObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word-reveal').forEach(w => {
            w.classList.add('word-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '100px 0px 100px 0px' });

    headings.forEach(h => {
      const rect = h.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150 && rect.bottom > -50) {
        h.querySelectorAll('.word-reveal').forEach(w => w.classList.add('word-visible'));
      } else {
        wordObserver.observe(h);
      }
    });

    // Safety timeout: ensure all headings are visible
    setTimeout(() => {
      document.querySelectorAll('.word-reveal:not(.word-visible)').forEach(w => {
        w.classList.add('word-visible');
      });
    }, 1000);
  }

  /* ── C. Directional clip-path & slide reveals ───────────── */
  function initDirectionalReveals(reduced) {
    if (reduced) return;

    // About quote box — slide from left
    document.querySelectorAll('.about-quote-box').forEach(el => {
      el.classList.add('reveal-from-left');
    });

    // About text block — slide from right
    document.querySelectorAll('.about-editorial-grid > div:last-child').forEach(el => {
      el.classList.add('reveal-from-right');
    });

    // Note: .synergy-box container is intentionally kept clean so the section never blanks

    // Pillar cards — alternating left/right
    document.querySelectorAll('.pillar-card').forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');
    });

    // Reason boxes — zoom scale
    document.querySelectorAll('.reason-box').forEach(el => {
      el.classList.add('reveal-zoom');
    });

    // Testimonials — zoom scale
    document.querySelectorAll('.testimonial-card').forEach(el => {
      el.classList.add('reveal-zoom');
    });

    // Booking panels
    document.querySelectorAll('.booking-info-sidebar').forEach(el => {
      el.classList.add('reveal-from-left');
    });
    document.querySelectorAll('.booking-form-container').forEach(el => {
      el.classList.add('reveal-from-right');
    });

    // Collect all reveal elements
    const allReveal = document.querySelectorAll(
      '.reveal-from-left, .reveal-from-right, .reveal-zoom'
    );

    // Observer — generous rootMargin so elements near viewport always fire
    const dirObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-done');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '120px 0px 120px 0px' });

    allReveal.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Immediately reveal anything already in or very near the viewport
      if (rect.top < window.innerHeight + 160 && rect.bottom > -50) {
        el.classList.add('reveal-done');
      } else {
        dirObserver.observe(el);
      }
    });

    // ── Safety net: after 800ms force-reveal anything still hidden ──
    setTimeout(() => {
      document.querySelectorAll(
        '.reveal-from-left:not(.reveal-done), .reveal-from-right:not(.reveal-done), .reveal-zoom:not(.reveal-done), .reveal-drop:not(.reveal-done), .reveal-clip:not(.reveal-done)'
      ).forEach(el => el.classList.add('reveal-done'));
    }, 800);
  }


  /* ── D. Magnetic buttons ─────────────────────────────────── */
  function initMagneticButtons(reduced) {
    if (reduced) return;

    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect   = btn.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) * 0.28;
        const dy     = (e.clientY - cy) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 460);
      });
    });
  }

  /* ── E. Section accent progress line ─────────────────────── */
  function initSectionAccentProgress() {
    const sections = document.querySelectorAll('section[id]');

    const accentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const tag = entry.target.querySelector('.section-tag');
        if (!tag) return;
        if (entry.isIntersecting) {
          tag.classList.add('tag-in-view');
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(sec => accentObserver.observe(sec));
  }

  /* ═══════════════════════════════════════════════════════════
     INTERACTIVE DENTAL ANATOMY & TEETH CHART EXPLORER
     ═══════════════════════════════════════════════════════════ */
  function initTeethExplorer() {
    const explorerSec = document.getElementById('teeth-explorer');
    const nodesGroup = document.getElementById('teethNodesGroup');
    if (!explorerSec || !nodesGroup) return;

    // Full Medical Tooth Dataset (32 Permanent + 20 Primary)
    const teethData = {
      // UPPER PERMANENT (1 to 16)
      '1': { id: '1', fdi: '18', name: 'Upper Right 3rd Molar (Wisdom)', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '17 – 25 Years', roots: '3 Fused Roots', role: 'Vestigial Third Grinding Molar', functionDesc: 'Historically helped grind raw, coarse foliage. Often erupts partially or impacted in modern jaws.', concerns: ['Pericoronitis (gum flap infection)', 'Difficult cleaning leading to deep decay', 'Crowding pressure on adjacent 2nd molar'], treatments: ['Digital X-ray evaluation', 'Gentle atraumatic surgical removal', 'Conservative antiseptic care'], x: 95, y: 335, rot: 10 },
      '2': { id: '2', fdi: '17', name: 'Upper Right 2nd Molar', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '12 – 13 Years', roots: '3 Roots (2 Buccal, 1 Palatal)', role: 'Secondary Heavy Mastication', functionDesc: 'Provides substantial chewing power to pulverize dense foods before swallowing.', concerns: ['Deep occlusal pit cavities', 'Cracked tooth syndrome from hard food', 'Food impaction between molars'], treatments: ['Biomimetic composite restorations', 'Single-sitting pain-free root canal', 'High-strength Zirconia crowns'], x: 105, y: 280, rot: 15 },
      '3': { id: '3', fdi: '16', name: 'Upper Right 1st Molar (6-Yr Molar)', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '6 – 7 Years', roots: '3 Divergent Roots', role: 'Key Cornerstone of Dental Occlusion', functionDesc: 'The largest tooth in the upper jaw and the primary anchor of the entire bite plane (Angle Class I milestone).', concerns: ['Early childhood cavities in deep fissures', 'Pulp exposure requiring endodontics', 'Heavy clenching wear facets'], treatments: ['Pain-free rotary root canal', 'Custom ceramic inlays / onlays', 'Biomimetic full-coverage crown'], x: 120, y: 228, rot: 25 },
      '4': { id: '4', fdi: '15', name: 'Upper Right 2nd Premolar', type: 'premolar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '10 – 12 Years', roots: '1 Single Root', role: 'Crushing & Masticatory Transition', functionDesc: 'Two cusps work synergistically to transition food particles from canines to broad molars.', concerns: ['Interproximal (floss line) decay', 'Cusp fracture under sudden lateral load', 'Gum recession along buccal margin'], treatments: ['Aesthetic tooth-colored fillings', 'Diode laser pocket decontamination', 'Pain-free root canal treatment'], x: 142, y: 182, rot: 35 },
      '5': { id: '5', fdi: '14', name: 'Upper Right 1st Premolar', type: 'premolar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '10 – 11 Years', roots: '2 Roots (Bifurcated in 60%)', role: 'Tearing & Food Crushing', functionDesc: 'Distinctive sharp buccal cusp aids canines while occlusal surface begins crushing mastication.', concerns: ['Deep proximal cavities near gumline', 'Bifurcated root canal complexity', 'Enamel micro-fractures'], treatments: ['Electronic apex-guided root canal', 'Digital ceramic restorations', 'Preventive dental cleaning'], x: 172, y: 142, rot: 50 },
      '6': { id: '6', fdi: '13', name: 'Upper Right Canine (Cuspid)', type: 'canine', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '11 – 12 Years', roots: '1 Longest Root in Human Jaw', role: 'Canine Guidance & Tearing', functionDesc: 'The cornerstone of facial expression and smile profile; disengages posterior teeth during lateral jaw movement.', concerns: ['Abfraction notches at cervical neck', 'Delayed or palatal impaction', 'Heavy bruxism tip wear'], treatments: ['Biomimetic cervical bonding', 'Laser soft-tissue re-contouring', 'Canine guidance bite alignment'], x: 208, y: 112, rot: 65 },
      '7': { id: '7', fdi: '12', name: 'Upper Right Lateral Incisor', type: 'incisor', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '8 – 9 Years', roots: '1 Slender Root', role: 'Food Shearing & Aesthetic Balance', functionDesc: 'Frames the central incisors to provide natural curvature and harmony in the aesthetic smile arc.', concerns: ['Peg lateral developmental microdontia', 'Lingual pit caries (dens invaginatus)', 'Chipping from incisal edge contact'], treatments: ['Handcrafted porcelain veneers', 'Cosmetic composite smile redesign', 'Pain-free micro-endodontics'], x: 250, y: 92, rot: 78 },
      '8': { id: '8', fdi: '11', name: 'Upper Right Central Incisor', type: 'incisor', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 1 (Upper Right)', eruption: '7 – 8 Years', roots: '1 Straight Cone Root', role: 'Primary Biting, Speech & Smile Center', functionDesc: 'Dominates the aesthetic smile zone and creates primary phonetics for clear pronunciation ("th", "f", "v" sounds).', concerns: ['Sports / accidental trauma fractures', 'Midline diastema (central gap)', 'Aesthetic enamel discoloration'], treatments: ['Digital smile design & porcelain veneers', 'Seamless shade-matched composite bonding', 'Single-sitting pain-free root canal'], x: 286, y: 84, rot: 87 },
      '9': { id: '9', fdi: '21', name: 'Upper Left Central Incisor', type: 'incisor', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '7 – 8 Years', roots: '1 Straight Cone Root', role: 'Primary Biting, Speech & Smile Center', functionDesc: 'Mirrors tooth #8 to establish perfect bilateral symmetry across the facial midline.', concerns: ['Chipped enamel edge from accidental falls', 'Pulp devitalization following blunt impact', 'Extrinsic tea/coffee stubborn staining'], treatments: ['Digital smile redesign & porcelain veneers', 'Single-sitting pain-free root canal', 'In-office gentle laser whitening'], x: 314, y: 84, rot: -87 },
      '10': { id: '10', fdi: '22', name: 'Upper Left Lateral Incisor', type: 'incisor', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '8 – 9 Years', roots: '1 Slender Root', role: 'Food Shearing & Aesthetic Balance', functionDesc: 'Completes the natural curvature of the maxillary anterior aesthetic smile line.', concerns: ['Uneven incisal length', 'Interproximal decay between front teeth', 'Congenital variation in crown width'], treatments: ['Porcelain laminate veneers', 'Biomimetic aesthetic bonding', 'Laser gum height balancing'], x: 350, y: 92, rot: -78 },
      '11': { id: '11', fdi: '23', name: 'Upper Left Canine (Cuspid)', type: 'canine', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '11 – 12 Years', roots: '1 Long Strong Root', role: 'Canine Guidance & Tearing', functionDesc: 'Supports the lip commissure and canine prominence, disengaging rear teeth during sideways chewing.', concerns: ['Loss of canine guidance from grinding', 'Gum recession exposing root dentin', 'Sharp cusp chipping'], treatments: ['Direct aesthetic composite rebuilding', 'Laser desensitization protocol', 'Clear night-guard bruxism therapy'], x: 392, y: 112, rot: -65 },
      '12': { id: '12', fdi: '24', name: 'Upper Left 1st Premolar', type: 'premolar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '10 – 11 Years', roots: '2 Delicate Roots', role: 'Tearing & Food Crushing', functionDesc: 'Dual cusps begin pulverizing food bolus while maintaining smile aesthetic corridor.', concerns: ['Deep proximal cavities near gumline', 'Bifurcated root canals requiring micro-apex location', 'Enamel cracking'], treatments: ['Pain-free rotary root canal', 'Digital ceramic onlays', 'Preventive fluoridated sealants'], x: 428, y: 142, rot: -50 },
      '13': { id: '13', fdi: '25', name: 'Upper Left 2nd Premolar', type: 'premolar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '10 – 12 Years', roots: '1 Single Root', role: 'Crushing & Masticatory Transition', functionDesc: 'Transfers heavy bite load safely from anterior teeth to heavy grinding molars.', concerns: ['Hidden interdental caries', 'Fracture under heavy clenching', 'Gum margin inflammation'], treatments: ['Composite resin restorations', 'Apex-guided root canal therapy', 'Diode laser deep disinfection'], x: 458, y: 182, rot: -35 },
      '14': { id: '14', fdi: '26', name: 'Upper Left 1st Molar (6-Yr Molar)', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '6 – 7 Years', roots: '3 Divergent Roots', role: 'Major Chewing Anchor', functionDesc: 'Coordinates maximum chewing force and locks dental occlusion on the left side of the arch.', concerns: ['Deep anatomical groove cavities', 'Complex 4th root canal (MB2) necrosis', 'Cracked tooth under nutshell/bone bite'], treatments: ['High-precision pain-free root canal', 'Full-coverage monolithic ceramic crown', 'Digital bite re-balancing'], x: 480, y: 228, rot: -25 },
      '15': { id: '15', fdi: '27', name: 'Upper Left 2nd Molar', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '12 – 13 Years', roots: '3 Roots', role: 'Secondary Heavy Mastication', functionDesc: 'Grinds tough, fibrous foods into fine digestible particles.', concerns: ['Difficult hygiene access in back corner', 'Severe sensitivity to cold/sweets', 'Subgingival calculus buildup'], treatments: ['Pain-free rotary root canal', 'Ultrasonic deep root debridement', 'Protective full-coverage crown'], x: 495, y: 280, rot: -15 },
      '16': { id: '16', fdi: '28', name: 'Upper Left 3rd Molar (Wisdom)', type: 'molar', dentition: 'adult', arch: 'Upper Jaw (Maxilla)', quadrant: 'Quadrant 2 (Upper Left)', eruption: '17 – 25 Years', roots: '3 Fused Roots', role: 'Vestigial Third Molar', functionDesc: 'Final tooth in upper left dental quadrant; frequently angulated or impacted.', concerns: ['Food impaction pocket behind 2nd molar', 'Sinus proximity pain', 'Decay due to limited toothbrush reach'], treatments: ['Low-radiation digital X-ray evaluation', 'Gentle atraumatic surgical extraction', 'Conservative local irrigation'], x: 505, y: 335, rot: -10 },

      // LOWER PERMANENT (17 to 32)
      '17': { id: '17', fdi: '38', name: 'Lower Left 3rd Molar (Wisdom)', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '17 – 25 Years', roots: '2 Curved Roots', role: 'Vestigial Lower Molar', functionDesc: 'Bottom left wisdom tooth, often impacted horizontally against mandibular bone.', concerns: ['Painful pericoronitis infection', 'Referred jaw & ear pain', 'Damage to 2nd molar roots'], treatments: ['Digital X-ray diagnostic mapping', 'Minimally invasive local extraction', 'Conservative post-op healing plan'], x: 505, y: 425, rot: 10 },
      '18': { id: '18', fdi: '37', name: 'Lower Left 2nd Molar', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '11 – 13 Years', roots: '2 Robust Roots', role: 'Heavy Grinding & Chewing', functionDesc: 'Handles high bite forces with broad rectangular occlusal table.', concerns: ['Deep fissure decay', 'Pulpitis from thermal sensitivity', 'Gum pocket around back margin'], treatments: ['Single-sitting pain-free root canal', 'Ceramic crown restoration', 'Diode laser pocket therapy'], x: 495, y: 480, rot: 15 },
      '19': { id: '19', fdi: '36', name: 'Lower Left 1st Molar (6-Yr Molar)', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '6 – 7 Years', roots: '2 Broad Roots (Mesial & Distal)', role: 'Primary Anchor of Mandibular Chewing', functionDesc: 'The hardest-working tooth in the lower jaw, absorbing up to 200 lbs of chewing pressure.', concerns: ['High prevalence of early childhood decay', 'Complex multi-canal pulpitis', 'Structural fracture from hard food'], treatments: ['Apex-controlled pain-free root canal', 'Monolithic high-strength Zirconia crown', 'Biomimetic core buildup'], x: 480, y: 532, rot: 25 },
      '20': { id: '20', fdi: '35', name: 'Lower Left 2nd Premolar', type: 'premolar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '11 – 12 Years', roots: '1 Single Root', role: 'Food Crushing & Chewing', functionDesc: 'Two or three cusps provide versatile crushing power directly before the molars.', concerns: ['Interproximal food packing', 'Cervical enamel erosion', 'Deep occlusal caries'], treatments: ['Tooth-colored composite restoration', 'Pain-free root canal therapy', 'Custom ceramic onlay'], x: 458, y: 578, rot: 35 },
      '21': { id: '21', fdi: '34', name: 'Lower Left 1st Premolar', type: 'premolar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '10 – 12 Years', roots: '1 Single Root', role: 'Transitional Tearing & Crushing', functionDesc: 'Transitions bite load from pointed canine to flatter grinding surfaces.', concerns: ['V-shaped toothbrush abrasion notch', 'Nerve inflammation from deep decay', 'Fracture of lingual cusp'], treatments: ['Biomimetic resin restoration', 'Pain-free root canal treatment', 'Laser gum treatment'], x: 428, y: 618, rot: 50 },
      '22': { id: '22', fdi: '33', name: 'Lower Left Canine', type: 'canine', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '9 – 10 Years', roots: '1 Long Sturdy Root', role: 'Canine Guidance & Tearing', functionDesc: 'Acts as structural cornerpost for the lower dental arch, guiding jaw motion during speech and chewing.', concerns: ['Incisal edge flattening from bruxism', 'Gum recession and root sensitivity', 'Enamel micro-chipping'], treatments: ['Direct composite cusp reconstruction', 'Fluoride varnish desensitization', 'Custom night guard therapy'], x: 392, y: 648, rot: 65 },
      '23': { id: '23', fdi: '32', name: 'Lower Left Lateral Incisor', type: 'incisor', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '7 – 8 Years', roots: '1 Slender Root', role: 'Cutting & Shearing Food', functionDesc: 'Pairs with lower central incisors to cleanly slice through vegetables and fruits.', concerns: ['Lower anterior tartar and calculus accumulation', 'Crowding / overlap', 'Enamel thinning'], treatments: ['Ultrasonic tartar scaling & polishing', 'Minimal-prep composite realignment', 'Diode laser gingivectomy'], x: 350, y: 668, rot: 78 },
      '24': { id: '24', fdi: '31', name: 'Lower Left Central Incisor', type: 'incisor', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 3 (Lower Left)', eruption: '6 – 7 Years', roots: '1 Smallest Root in Permanent Dentition', role: 'Initial Food Shearing', functionDesc: 'The smallest permanent tooth, critical for phonetics and slicing food bolus against upper incisors.', concerns: ['High saliva salivary calculus buildup', 'Incisal edge micro-wear', 'Crowding due to narrow jaw arch'], treatments: ['Gentle ultrasonic cleaning', 'Aesthetic composite edge bonding', 'Clear aligner orthodontic guidance'], x: 314, y: 676, rot: 87 },
      '25': { id: '25', fdi: '41', name: 'Lower Right Central Incisor', type: 'incisor', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '6 – 7 Years', roots: '1 Small Root', role: 'Initial Food Shearing', functionDesc: 'Mirrors tooth #24 at the mandibular midline to form a seamless incisal cutting edge.', concerns: ['Rapid tartar accumulation near salivary ducts', 'Bite attrition from clenching', 'Gum recession'], treatments: ['Periodic preventive scaling', 'Laser-assisted bio-stimulation for gums', 'Cosmetic edge contouring'], x: 286, y: 676, rot: -87 },
      '26': { id: '26', fdi: '42', name: 'Lower Right Lateral Incisor', type: 'incisor', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '7 – 8 Years', roots: '1 Slender Root', role: 'Cutting & Shearing Food', functionDesc: 'Maintains spacing and cutting harmony alongside central incisors.', concerns: ['Food trapping between overlapping teeth', 'Subgingival calculus', 'Cold sensitivity'], treatments: ['Professional hygiene scaling', 'Tooth-colored composite restoration', 'Enamel desensitizing therapy'], x: 250, y: 668, rot: -78 },
      '27': { id: '27', fdi: '43', name: 'Lower Right Canine', type: 'canine', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '9 – 10 Years', roots: '1 Long Sturdy Root', role: 'Canine Guidance & Tearing', functionDesc: 'Provides critical canine protection for right-side masticatory chewing cycle.', concerns: ['Heavy wear from nocturnal bruxism', 'Cervical gum recession', 'Sharp tip fracture'], treatments: ['Biomimetic cusp buildup', 'Protective dental night-guard', 'Gentle pain-free endodontics if needed'], x: 208, y: 648, rot: -65 },
      '28': { id: '28', fdi: '44', name: 'Lower Right 1st Premolar', type: 'premolar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '10 – 12 Years', roots: '1 Single Root', role: 'Food Crushing & Tearing Transition', functionDesc: 'Strong outer buccal cusp handles early crushing action efficiently.', concerns: ['Cervical abrasion from hard toothbrushes', 'Interdental caries', 'Bite trauma sensitivity'], treatments: ['Tooth-colored resin filling', 'Pain-free root canal treatment', 'Laser gum pocket treatment'], x: 172, y: 618, rot: -50 },
      '29': { id: '29', fdi: '45', name: 'Lower Right 2nd Premolar', type: 'premolar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '11 – 12 Years', roots: '1 Single Root', role: 'Crushing Food Bolus', functionDesc: 'Broader occlusal surface assists molars in fine mastication.', concerns: ['Deep pit and fissure decay', 'Proximal flossing cavities', 'Cracking under chewing pressure'], treatments: ['Aesthetic composite restoration', 'Pain-free rotary root canal', 'Digital ceramic onlay'], x: 142, y: 578, rot: -35 },
      '30': { id: '30', fdi: '46', name: 'Lower Right 1st Molar (6-Yr Molar)', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '6 – 7 Years', roots: '2 Broad Roots', role: 'Primary Anchor of Right Chewing', functionDesc: 'The primary workhorse for the right side of the jaw, bearing the brunt of chewing force.', concerns: ['Deep occlusal cavity formation', 'Severe pulpitis pain keeping patients awake', 'Cusp fracture from hard nuts/ice'], treatments: ['Single-sitting pain-free rotary root canal', 'Monolithic Zirconia crown', 'Biomimetic core reconstruction'], x: 120, y: 532, rot: -25 },
      '31': { id: '31', fdi: '47', name: 'Lower Right 2nd Molar', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '11 – 13 Years', roots: '2 Strong Roots', role: 'Heavy Grinding & Food Mastication', functionDesc: 'Coordinates with upper 2nd molar for secondary heavy food breakdown.', concerns: ['Hard-to-clean back fissure decay', 'Cold thermal sensitivity', 'Deep periodontal pocket'], treatments: ['Pain-free root canal treatment', 'Custom porcelain crown', 'Ultrasonic deep root scaling'], x: 105, y: 480, rot: -15 },
      '32': { id: '32', fdi: '48', name: 'Lower Right 3rd Molar (Wisdom)', type: 'molar', dentition: 'adult', arch: 'Lower Jaw (Mandible)', quadrant: 'Quadrant 4 (Lower Right)', eruption: '17 – 25 Years', roots: '2 Roots', role: 'Vestigial Lower Molar', functionDesc: 'Final lower tooth on right; frequently horizontal or partially erupted.', concerns: ['Repeated gum flap inflammation (pericoronitis)', 'Pus discharge / difficulty opening mouth', 'Decay on neighbouring molar'], treatments: ['Digital X-ray imaging diagnosis', 'Gentle atraumatic surgical removal', 'Safe post-operative management'], x: 95, y: 425, rot: -10 },

      // PRIMARY MILK TEETH (A to T)
      'A': { id: 'A', fdi: '55', name: 'Primary Upper Right 2nd Molar', type: 'molar', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Right Milk Dentition', eruption: '2 – 3 Years (Shed: 10–12 Yrs)', roots: '3 Spreading Roots', role: 'Primary Chewing & Space Maintenance', functionDesc: 'Reserves crucial space in the jawbone for the incoming permanent 2nd premolar.', concerns: ['Deep nursing bottle caries', 'Premature loss causing severe crowding', 'Pulp infection'], treatments: ['Gentle pediatric pulpotomy', 'Stainless steel pediatric crown', 'Fluoride cavity sealants'], x: 190, y: 325, rot: 15 },
      'B': { id: 'B', fdi: '54', name: 'Primary Upper Right 1st Molar', type: 'molar', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Right Milk Dentition', eruption: '13 – 19 Months (Shed: 9–11 Yrs)', roots: '3 Roots', role: 'Early Chewing & Grinding', functionDesc: 'Enables toddler chewing as solid foods enter the diet.', concerns: ['Interdental decay', 'Space loss if lost early', 'Abscess from deep decay'], treatments: ['Kid-friendly tooth restoration', 'Space maintainer if premature loss', 'Topical fluoride therapy'], x: 204, y: 275, rot: 28 },
      'C': { id: 'C', fdi: '53', name: 'Primary Upper Right Canine', type: 'canine', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Right Milk Dentition', eruption: '16 – 22 Months (Shed: 10–12 Yrs)', roots: '1 Long Root', role: 'Tearing Food & Arch Symmetry', functionDesc: 'Guides permanent canine into proper alignment.', concerns: ['Chipping during rough play', 'Delayed shedding', 'Proximal decay'], treatments: ['Gentle pediatric filling', 'Natural shedding monitoring', 'Preventive oral hygiene guide'], x: 230, y: 232, rot: 45 },
      'D': { id: 'D', fdi: '52', name: 'Primary Upper Right Lateral Incisor', type: 'incisor', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Right Milk Dentition', eruption: '9 – 13 Months (Shed: 7–8 Yrs)', roots: '1 Delicate Root', role: 'Toddler Biting & Smile Arc', functionDesc: 'Aids speech development in early childhood.', concerns: ['Early childhood caries (baby bottle syndrome)', 'Trauma from toddler falls'], treatments: ['Biomimetic aesthetic composite strip crown', 'Topical remineralization therapy'], x: 262, y: 204, rot: 65 },
      'E': { id: 'E', fdi: '51', name: 'Primary Upper Right Central Incisor', type: 'incisor', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Right Milk Dentition', eruption: '8 – 12 Months (Shed: 6–7 Yrs)', roots: '1 Short Root', role: 'First Front Tooth for Biting', functionDesc: 'Crucial for toddler speech milestones and facial development.', concerns: ['Fall trauma / intrusion injury', 'Severe decay from sweet syrups/milk bottles'], treatments: ['Compassionate pediatric pulp therapy', 'Aesthetic composite restoration'], x: 290, y: 196, rot: 85 },
      'F': { id: 'F', fdi: '61', name: 'Primary Upper Left Central Incisor', type: 'incisor', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Left Milk Dentition', eruption: '8 – 12 Months (Shed: 6–7 Yrs)', roots: '1 Short Root', role: 'First Front Tooth for Biting', functionDesc: 'Works with tooth E to provide toddler biting function.', concerns: ['Traumatic chipping from playtime accidents', 'Discoloration after minor trauma'], treatments: ['Conservative non-invasive monitoring', 'Kid-friendly composite restoration'], x: 310, y: 196, rot: -85 },
      'G': { id: 'G', fdi: '62', name: 'Primary Upper Left Lateral Incisor', type: 'incisor', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Left Milk Dentition', eruption: '9 – 13 Months (Shed: 7–8 Yrs)', roots: '1 Delicate Root', role: 'Toddler Biting & Smile Balance', functionDesc: 'Assists early biting and toddler phonetics.', concerns: ['Decay on lingual surface', 'Premature loosening from bump'], treatments: ['Preventive fluoride application', 'Painless composite restoration'], x: 338, y: 204, rot: -65 },
      'H': { id: 'H', fdi: '63', name: 'Primary Upper Left Canine', type: 'canine', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Left Milk Dentition', eruption: '16 – 22 Months (Shed: 10–12 Yrs)', roots: '1 Long Root', role: 'Tearing Food & Guiding Eruption', functionDesc: 'Maintains jaw width for adult canine eruption.', concerns: ['Caries on flat sides', 'Stubborn retention'], treatments: ['Painless pediatric cleaning', 'Gentle extraction if over-retained'], x: 370, y: 232, rot: -45 },
      'I': { id: 'I', fdi: '64', name: 'Primary Upper Left 1st Molar', type: 'molar', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Left Milk Dentition', eruption: '13 – 19 Months (Shed: 9–11 Yrs)', roots: '3 Roots', role: 'Early Chewing Table', functionDesc: 'Facilitates solid food mastication in toddlers.', concerns: ['Pit decay in deep fissures', 'Pulp inflammation from sugar exposure'], treatments: ['Painless kid pulpotomy', 'Composite filling', 'Preventive fissure sealant'], x: 396, y: 275, rot: -28 },
      'J': { id: 'J', fdi: '65', name: 'Primary Upper Left 2nd Molar', type: 'molar', dentition: 'child', arch: 'Upper Jaw (Primary)', quadrant: 'Upper Left Milk Dentition', eruption: '25 – 33 Months (Shed: 10–12 Yrs)', roots: '3 Spreading Roots', role: 'Essential Space Holder', functionDesc: 'Guides permanent 1st molar eruption into accurate bite alignment.', concerns: ['Severe proximal caries', 'Space loss leading to future braces'], treatments: ['Pediatric ceramic/steel crown', 'Space maintainer if extracted', 'Preventive fluoride treatment'], x: 410, y: 325, rot: -15 },
      'K': { id: 'K', fdi: '75', name: 'Primary Lower Left 2nd Molar', type: 'molar', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Left Milk Dentition', eruption: '23 – 31 Months (Shed: 10–12 Yrs)', roots: '2 Spreading Roots', role: 'Primary Chewing Anchor', functionDesc: 'Holds space for permanent lower left 2nd premolar.', concerns: ['Deep decay on occlusal surface', 'Early loss causing severe bite collapse'], treatments: ['Pediatric pulp therapy', 'Space maintainer appliance', 'Fissure sealant'], x: 410, y: 435, rot: 15 },
      'L': { id: 'L', fdi: '74', name: 'Primary Lower Left 1st Molar', type: 'molar', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Left Milk Dentition', eruption: '14 – 18 Months (Shed: 9–11 Yrs)', roots: '2 Roots', role: 'Early Grinding Unit', functionDesc: 'Assists toddler mastication of harder foods.', concerns: ['Food trapping between primary molars', 'Cavities'], treatments: ['Tooth-colored composite restoration', 'Dietary counseling for cavity prevention'], x: 396, y: 485, rot: 28 },
      'M': { id: 'M', fdi: '73', name: 'Primary Lower Left Canine', type: 'canine', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Left Milk Dentition', eruption: '17 – 23 Months (Shed: 9–12 Yrs)', roots: '1 Root', role: 'Tearing & Jaw Guidance', functionDesc: 'Guides adult canine pathway into mandibular bone.', concerns: ['Enamel wear from night grinding', 'Incisal chipping'], treatments: ['Smooth polishing', 'Fluoride treatment', 'Bruxism reassurance'], x: 370, y: 528, rot: 45 },
      'N': { id: 'N', fdi: '72', name: 'Primary Lower Left Lateral Incisor', type: 'incisor', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Left Milk Dentition', eruption: '10 – 16 Months (Shed: 7–8 Yrs)', roots: '1 Small Root', role: 'Toddler Slicing & Smiling', functionDesc: 'Aids in infant feeding and early speech sounds.', concerns: ['Crowding / early loss', 'Enamel decay'], treatments: ['Gentle pediatric filling', 'Preventive cleaning'], x: 338, y: 556, rot: 65 },
      'O': { id: 'O', fdi: '71', name: 'Primary Lower Left Central Incisor', type: 'incisor', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Left Milk Dentition', eruption: '6 – 10 Months (Shed: 6–7 Yrs)', roots: '1 Tiny Root', role: 'Usually Very First Tooth to Erupt in Infants', functionDesc: 'Exciting milestone tooth; starts infant solid food biting.', concerns: ['Teething discomfort / gum soreness', 'Plaque film buildup'], treatments: ['Gentle teething relief guidance', 'Infant dental checkup advice'], x: 310, y: 564, rot: 85 },
      'P': { id: 'P', fdi: '81', name: 'Primary Lower Right Central Incisor', type: 'incisor', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Right Milk Dentition', eruption: '6 – 10 Months (Shed: 6–7 Yrs)', roots: '1 Tiny Root', role: 'Very First Tooth to Erupt in Infants', functionDesc: 'Erupts alongside tooth O to establish the infant bite.', concerns: ['Teething gum inflammation', 'Enamel chipping from hard toy biting'], treatments: ['Pediatric dental assessment', 'Compassionate oral hygiene training'], x: 290, y: 564, rot: -85 },
      'Q': { id: 'Q', fdi: '82', name: 'Primary Lower Right Lateral Incisor', type: 'incisor', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Right Milk Dentition', eruption: '10 – 16 Months (Shed: 7–8 Yrs)', roots: '1 Small Root', role: 'Toddler Slicing & Smiling', functionDesc: 'Enables slicing through toddler snacks.', concerns: ['Cavities from sweet liquids', 'Accidental trauma from falls'], treatments: ['Biomimetic white composite restoration', 'Topical fluoride varnishing'], x: 262, y: 556, rot: -65 },
      'R': { id: 'R', fdi: '83', name: 'Primary Lower Right Canine', type: 'canine', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Right Milk Dentition', eruption: '17 – 23 Months (Shed: 9–12 Yrs)', roots: '1 Root', role: 'Tearing & Jaw Arch Maintenance', functionDesc: 'Maintains arch integrity during developmental growth.', concerns: ['Heavy grinding wear', 'Cavities near gum line'], treatments: ['Preventive fluoride application', 'Tooth restoration'], x: 230, y: 528, rot: -45 },
      'S': { id: 'S', fdi: '84', name: 'Primary Lower Right 1st Molar', type: 'molar', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Right Milk Dentition', eruption: '14 – 18 Months (Shed: 9–11 Yrs)', roots: '2 Roots', role: 'Early Chewing Function', functionDesc: 'Handles solid food chewing on the lower right.', concerns: ['Deep fissure decay', 'Pulpitis'], treatments: ['Gentle pain-free pediatric filling', 'Preventive pit sealant'], x: 204, y: 485, rot: -28 },
      'T': { id: 'T', fdi: '85', name: 'Primary Lower Right 2nd Molar', type: 'molar', dentition: 'child', arch: 'Lower Jaw (Primary)', quadrant: 'Lower Right Milk Dentition', eruption: '23 – 31 Months (Shed: 10–12 Yrs)', roots: '2 Spreading Roots', role: 'Crucial Space Holder for Adult Premolars', functionDesc: 'Preserves lower right jaw space until age 10-12.', concerns: ['Aggressive interproximal decay', 'Premature loss triggering future malocclusion'], treatments: ['Pediatric pulpotomy', 'Space maintainer if lost early', 'Full crown restoration'], x: 190, y: 435, rot: -15 }
    };

    // Helper to generate realistic 3D anatomical tooth shape (Morphology: Molars, Premolars, Canines, Incisors)
    function getToothSvgMarkup(tooth) {
      const isMolar = tooth.type === 'molar';
      const isPremolar = tooth.type === 'premolar';
      const isCanine = tooth.type === 'canine';
      const isAdult = tooth.dentition === 'adult';
      const s = isAdult ? 1 : 0.82; // Child teeth proportional scale

      let shapeMarkup = '';

      if (isMolar) {
        // Multi-cusped 3D Molar Crown (4 anatomical rounded lobes + central developmental fissure + gloss)
        const rx = 13.5 * s, ry = 12 * s;
        shapeMarkup = `
          <path d="M ${-rx} ${-ry + 2} C ${-rx * 0.6} ${-ry - 2}, ${rx * 0.6} ${-ry - 2}, ${rx} ${-ry + 2} C ${rx + 3} ${-ry * 0.4}, ${rx + 3} ${ry * 0.4}, ${rx} ${ry - 2} C ${rx * 0.6} ${ry + 2}, ${-rx * 0.6} ${ry + 2}, ${-rx} ${ry - 2} C ${-rx - 3} ${ry * 0.4}, ${-rx - 3} ${-ry * 0.4}, ${-rx} ${-ry + 2} Z" class="tooth-outline"/>
          <path d="M ${-rx + 2} ${-ry + 3} Q ${-rx * 0.4} ${-ry - 1} -1 ${-ry * 0.3} Q ${-rx * 0.4} 0 ${-rx + 2} ${-ry + 3}" class="cusp-ridge"/>
          <path d="M ${rx - 2} ${-ry + 3} Q ${rx * 0.4} ${-ry - 1} 1 ${-ry * 0.3} Q ${rx * 0.4} 0 ${rx - 2} ${-ry + 3}" class="cusp-ridge"/>
          <path d="M ${-rx + 2} ${ry - 3} Q ${-rx * 0.4} ${ry + 1} -1 ${ry * 0.3} Q ${-rx * 0.4} 0 ${-rx + 2} ${ry - 3}" class="cusp-ridge"/>
          <path d="M ${rx - 2} ${ry - 3} Q ${rx * 0.4} ${ry + 1} 1 ${ry * 0.3} Q ${rx * 0.4} 0 ${rx - 2} ${ry - 3}" class="cusp-ridge"/>
          <path d="M ${-rx + 4} 0 L ${rx - 4} 0 M 0 ${-ry + 3} L 0 ${ry - 3}" class="tooth-fissure"/>
          <path d="M ${-rx * 0.7} ${-ry + 2} Q 0 ${-ry - 1.5} ${rx * 0.7} ${-ry + 2}" class="tooth-specular"/>
        `;
      } else if (isPremolar) {
        // Dual-Cusped Bicuspid 3D Crown (Buccal & Lingual Cusps)
        const rx = 10.5 * s, ry = 10 * s;
        shapeMarkup = `
          <path d="M ${-rx} ${-ry + 2} C ${-rx * 0.5} ${-ry - 2}, ${rx * 0.5} ${-ry - 2}, ${rx} ${-ry + 2} C ${rx + 2} 0, ${rx + 2} 0, ${rx} ${ry - 2} C ${rx * 0.5} ${ry + 2}, ${-rx * 0.5} ${ry + 2}, ${-rx} ${ry - 2} C ${-rx - 2} 0, ${-rx - 2} 0, ${-rx} ${-ry + 2} Z" class="tooth-outline"/>
          <path d="M ${-rx + 3} 0 Q 0 ${-ry * 0.5} ${rx - 3} 0" class="cusp-ridge"/>
          <path d="M ${-rx + 3} 0 Q 0 ${ry * 0.5} ${rx - 3} 0" class="cusp-ridge"/>
          <line x1="${-rx + 2.5}" y1="0" x2="${rx - 2.5}" y2="0" class="tooth-fissure"/>
          <path d="M ${-rx * 0.6} ${-ry + 2} Q 0 ${-ry} ${rx * 0.6} ${-ry + 2}" class="tooth-specular"/>
        `;
      } else if (isCanine) {
        // Conical 3D Canine (Spear-shaped pointed cusp & prominent labial ridge)
        const r = 11.5 * s;
        shapeMarkup = `
          <path d="M 0 ${-r - 1} C ${r * 0.6} ${-r * 0.6}, ${r} ${-r * 0.1}, ${r} ${r * 0.3} C ${r} ${r * 0.8}, ${r * 0.5} ${r + 1}, 0 ${r + 1} C ${-r * 0.5} ${r + 1}, ${-r} ${r * 0.8}, ${-r} ${r * 0.3} C ${-r} ${-r * 0.1}, ${-r * 0.6} ${-r * 0.6}, 0 ${-r - 1} Z" class="tooth-outline"/>
          <line x1="0" y1="${-r + 1}" x2="0" y2="${r - 1}" class="canine-ridge"/>
          <path d="M ${-r * 0.6} ${r * 0.2} Q 0 ${r * 0.5} ${r * 0.6} ${r * 0.2}" class="canine-cingulum"/>
          <line x1="0" y1="${-r + 1}" x2="0" y2="${-r * 0.3}" class="tooth-specular"/>
        `;
      } else {
        // Incisor (Spatulate shovel-shaped curved biting crown)
        const rx = 10 * s, ry = 8.5 * s;
        shapeMarkup = `
          <path d="M ${-rx} ${-ry + 1} C ${-rx * 0.5} ${-ry - 1.5}, ${rx * 0.5} ${-ry - 1.5}, ${rx} ${-ry + 1} C ${rx + 1.5} ${ry * 0.2}, ${rx} ${ry}, ${rx * 0.75} ${ry + 1} C ${rx * 0.3} ${ry + 2}, ${-rx * 0.3} ${ry + 2}, ${-rx * 0.75} ${ry + 1} C ${-rx} ${ry}, ${-rx - 1.5} ${ry * 0.2}, ${-rx} ${-ry + 1} Z" class="tooth-outline"/>
          <line x1="${-rx + 2}" y1="${-ry + 1.5}" x2="${rx - 2}" y2="${-ry + 1.5}" class="incisal-edge"/>
          <line x1="${-rx * 0.35}" y1="${-ry + 2}" x2="${-rx * 0.35}" y2="${ry * 0.4}" class="tooth-fissure"/>
          <line x1="${rx * 0.35}" y1="${-ry + 2}" x2="${rx * 0.35}" y2="${ry * 0.4}" class="tooth-fissure"/>
          <path d="M ${-rx * 0.7} ${-ry + 1.5} Q 0 ${-ry} ${rx * 0.7} ${-ry + 1.5}" class="tooth-specular"/>
        `;
      }

      const haloRadius = isAdult ? 20 : 16;
      const badgeR = isAdult ? 6.5 : 5.5;

      return `
        <circle cx="0" cy="0" r="${haloRadius}" class="tooth-halo"/>
        ${shapeMarkup}
        <circle cx="0" cy="0" r="${badgeR}" class="tooth-num-badge"/>
        <text class="tooth-number" x="0" y="0" text-anchor="middle" dominant-baseline="central">${tooth.id}</text>
      `;
    }

    // Dental Conditions List (8 specialized conditions matching reference visual structure)
    const dentalConditions = [
      {
        id: 'decay',
        name: 'Tooth Decay & Deep Cavities (Painless Fillings)',
        teeth: ['2', '3', '4', '13', '14', '15', '18', '19', '20', '29', '30', '31', 'A', 'B', 'I', 'J', 'K', 'L', 'S', 'T'],
        label: 'Molars & Premolars (Bite Surfaces)',
        desc: 'Acid-producing bacteria break through outer enamel into vulnerable dentin, causing food traps, dark spots, and chewing sensitivity. We treat cavities using gentle, biomimetic tooth-colored restorations without drilling healthy tooth enamel.',
        treatments: ['Biomimetic Tooth-Colored Fillings', 'Preventive Fluoride Sealants', 'Digital X-Ray Diagnostic Check'],
        bookingNote: 'I would like a consultation with Dr. Ahalya regarding Tooth Decay & Deep Cavities (Painless Fillings).'
      },
      {
        id: 'root-canal',
        name: 'Pain-Free Root Canal (RCT & Nerve Preservation)',
        teeth: ['3', '14', '19', '30', '2', '15', '18', '31', '4', '13', '20', '29'],
        label: 'Posterior Molars & Premolars with Pulpitis',
        desc: 'Deep decay or structural trauma reaches the internal pulp chamber, triggering severe throbbing toothache and night pain. Dr. Ahalya performs single-sitting, pain-free rotary root canals with electronic apex locators to eliminate pain and preserve your natural tooth.',
        treatments: ['Single-Sitting Pain-Free RCT', 'Apex-Guided Rotary Endodontics', 'Monolithic High-Strength Zirconia Crown'],
        bookingNote: 'I would like a consultation with Dr. Ahalya regarding Pain-Free Root Canal Treatment (RCT).'
      },
      {
        id: 'broken-teeth',
        name: 'Chipped, Cracked or Broken Teeth (Veneers & Bonding)',
        teeth: ['6', '7', '8', '9', '10', '11', '22', '23', '24', '25', '26', '27', 'C', 'D', 'E', 'F', 'G', 'H'],
        label: 'Anterior Incisors & Aesthetic Smile Zone',
        desc: 'Accidental sports impact, biting hard items, or nocturnal teeth grinding can crack or chip front tooth edges. We restore seamless symmetry and strength using custom porcelain laminate veneers and direct biomimetic composite bonding.',
        treatments: ['Custom Porcelain Veneers', 'Biomimetic Aesthetic Bonding', 'Protective Anti-Grinding Night Guard'],
        bookingNote: 'I would like a consultation regarding Chipped, Cracked or Broken Teeth (Veneers & Bonding).'
      },
      {
        id: 'wisdom-teeth',
        name: 'Wisdom Tooth Pain & Impaction (Gentle Extraction)',
        teeth: ['1', '16', '17', '32'],
        label: '3rd Molars (Wisdom Teeth)',
        desc: 'Third molars frequently erupt tilted or trapped beneath jawbone and gum tissue. This creates painful gum flap swelling (pericoronitis), jaw stiffness, and decay on adjacent second molars. Managed with gentle atraumatic surgical techniques.',
        treatments: ['Digital X-Ray Evaluation', 'Gentle Atraumatic Surgical Removal', 'Conservative Local Irrigation'],
        bookingNote: 'I would like a consultation with Dr. Ahalya regarding Wisdom Tooth Pain & Impaction.'
      },
      {
        id: 'misalignment',
        name: 'Crooked, Gapped or Misaligned Teeth (Smile Alignment)',
        teeth: ['7', '8', '9', '10', '23', '24', '25', '26', '6', '11', '22', '27'],
        label: 'Anterior Aesthetic Smile Corridor',
        desc: 'Crowding, rotations, or central diastema gaps affect smile confidence and create hard-to-clean plaque traps. Corrected comfortably and discreetly using clear aligners and computerized digital smile redesign.',
        treatments: ['Discreet Clear Aligners', 'Digital Smile Redesign', 'Minimally Invasive Interproximal Correction'],
        bookingNote: 'I would like a consultation regarding Crooked, Gapped or Misaligned Teeth (Smile Aligners).'
      },
      {
        id: 'sensitivity',
        name: 'Severe Tooth Sensitivity & Enamel Wear (Laser Care)',
        teeth: ['5', '6', '11', '12', '21', '22', '27', '28'],
        label: 'Canines & Premolar Cervical Necks',
        desc: 'Aggressive toothbrush abrasion or acidic wear exposes microscopic dentin tubules, triggering sharp wincing pain on iced drinks or hot beverages. Relieved rapidly with diode laser desensitization and fluoride enamel remineralization.',
        treatments: ['Diode Laser Desensitization', 'Fluoride Varnish Remineralization', 'Cervical Biomimetic Bonding'],
        bookingNote: 'I would like a consultation regarding Severe Tooth Sensitivity & Enamel Wear.'
      },
      {
        id: 'missing-teeth',
        name: 'Missing Teeth & Gap Replacement (Digital Implants)',
        teeth: ['3', '8', '9', '14', '19', '30'],
        label: 'Edentulous Spaces & Missing Units',
        desc: 'Leaving gaps from extracted teeth allows adjacent teeth to drift, collapses bite height, and triggers jawbone resorption. Replaced permanently with precision titanium dental implants and monolithic aesthetic ceramic bridges.',
        treatments: ['Precision Dental Implants', 'Full-Ceramic Fixed Bridges', 'Digital Impression & Bite Balancing'],
        bookingNote: 'I would like a consultation regarding Missing Teeth & Gap Replacement (Dental Implants).'
      },
      {
        id: 'periodontal',
        name: 'Bleeding Gums & Periodontal Disease (Laser Deep Care)',
        teeth: ['23', '24', '25', '26', '18', '19', '30', '31'],
        label: 'Mandibular & Maxillary Cervical Margins',
        desc: 'Subgingival calculus and bacterial colonies cause red, swollen gums that bleed upon brushing and cause loose teeth. Treated gently with ultrasonic subgingival cleaning and diode laser pocket decontamination.',
        treatments: ['Diode Laser Pocket Decontamination', 'Ultrasonic Subgingival Scaling', 'Laser Gum Bio-Stimulation'],
        bookingNote: 'I would like a consultation regarding Bleeding Gums & Periodontal Laser Care.'
      }
    ];

    // Render all teeth into SVG
    nodesGroup.innerHTML = '';
    const toothElements = {};

    Object.values(teethData).forEach(tooth => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `tooth-node tooth-${tooth.dentition} tooth-${tooth.type}`);
      g.setAttribute('data-tooth-id', tooth.id);
      g.setAttribute('data-type', tooth.type);
      g.setAttribute('data-dentition', tooth.dentition);
      g.setAttribute('transform', `translate(${tooth.x}, ${tooth.y}) rotate(${tooth.rot})`);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Tooth ${tooth.id}: ${tooth.name}`);
      g.innerHTML = getToothSvgMarkup(tooth);

      g.addEventListener('click', () => onToothClick(tooth.id));
      g.addEventListener('mouseenter', () => onToothHover(tooth.id));
      g.addEventListener('mouseleave', () => onToothLeave());
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToothClick(tooth.id);
        }
      });

      nodesGroup.appendChild(g);
      toothElements[tooth.id] = g;
    });

    // Populate Right Column Condition Accordion Items
    const accordionList = document.getElementById('conditionsAccordionList');
    const teethStatusText = document.getElementById('teethStatusText');
    const teethTooltipText = document.getElementById('teethTooltipText');
    const teethHighlightSummary = document.getElementById('teethHighlightSummary');

    let activeConditionId = null;

    if (accordionList) {
      accordionList.innerHTML = '';
      dentalConditions.forEach((cond, idx) => {
        const item = document.createElement('div');
        item.className = 'condition-pill-item';
        item.setAttribute('data-condition-id', cond.id);
        item.setAttribute('role', 'region');

        const teethTagsHtml = cond.teeth.slice(0, 8).map(t => `<span class="tooth-tag-badge">#${t}</span>`).join('');
        const extraCount = cond.teeth.length > 8 ? `<span class="tooth-tag-badge">+${cond.teeth.length - 8} more</span>` : '';
        const treatsHtml = cond.treatments.map(tr => `<span class="condition-treat-pill">${tr}</span>`).join('');

        item.innerHTML = `
          <button class="condition-pill-header" type="button" aria-expanded="false" id="cond-btn-${cond.id}">
            <span class="condition-bullet" aria-hidden="true">
              <span class="condition-bullet-dot"></span>
            </span>
            <span class="condition-title">${cond.name}</span>
            <i class="fa-solid fa-chevron-right condition-chevron" aria-hidden="true"></i>
          </button>
          <div class="condition-drawer" id="drawer-${cond.id}">
            <p class="condition-overview">${cond.desc}</p>
            <div class="condition-teeth-tags-row">
              <span class="condition-teeth-label"><i class="fa-solid fa-tooth"></i> Common Affected Teeth:</span>
              ${teethTagsHtml}
              ${extraCount}
            </div>
            <div class="condition-treatments-row">
              ${treatsHtml}
            </div>
            <button class="condition-book-btn" type="button" data-note="${cond.bookingNote}">
              <i class="fa-solid fa-calendar-check"></i> Book Consultation for this Condition
            </button>
          </div>
        `;

        const headerBtn = item.querySelector('.condition-pill-header');
        headerBtn.addEventListener('click', () => {
          toggleCondition(cond.id);
        });

        // CTA button inside drawer
        const bookBtn = item.querySelector('.condition-book-btn');
        bookBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          prefillBooking('dental', 'Dr. Ahalya N');
          const notes = document.getElementById('patientNotes');
          if (notes) {
            notes.value = cond.bookingNote;
          }
          const apptSection = document.getElementById('appointment');
          apptSection?.scrollIntoView({ behavior: 'smooth' });
        });

        accordionList.appendChild(item);
      });
    }

    // 1. Dual View Switcher: 3D Dental & Nerve Model VS Clinical Dentition Chart (32)
    const viewStage3D = document.getElementById('teeth3DModelStage');
    const viewStageChart = document.getElementById('teethChartStage');
    const glowOverlay = document.getElementById('teeth3DGlowOverlay');
    const viewSwitchBtns = explorerSec.querySelectorAll('.teeth-mode-btn');

    viewSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        viewSwitchBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        if (targetView === '3d-model') {
          if (viewStage3D) {
            viewStage3D.classList.add('active');
            viewStage3D.style.display = 'flex';
          }
          if (viewStageChart) {
            viewStageChart.classList.remove('active');
            viewStageChart.style.display = 'none';
          }
          if (teethStatusText) {
            teethStatusText.textContent = activeConditionId 
              ? (dentalConditions.find(c => c.id === activeConditionId)?.name.split('(')[0].trim() || 'Interactive 3D Dental Model')
              : 'Interactive 3D Dental Model';
          }
        } else {
          // chart-arch
          if (viewStage3D) {
            viewStage3D.classList.remove('active');
            viewStage3D.style.display = 'none';
          }
          if (viewStageChart) {
            viewStageChart.classList.add('active');
            viewStageChart.style.display = 'block';
          }
          if (teethStatusText) {
            teethStatusText.textContent = activeConditionId 
              ? (dentalConditions.find(c => c.id === activeConditionId)?.name.split('(')[0].trim() || 'Clinical Dentition Chart (32)')
              : 'Clinical Dentition Chart (32)';
          }
        }
      });
    });

    // 2. Anatomical Hotspots on 3D Model
    const hotspots = explorerSec.querySelectorAll('.anatomical-hotspot');
    hotspots.forEach(hotspot => {
      const condId = hotspot.getAttribute('data-condition');
      hotspot.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCondition(condId);
      });

      hotspot.addEventListener('mouseenter', () => {
        const cond = dentalConditions.find(c => c.id === condId);
        if (cond && teethTooltipText) {
          teethTooltipText.textContent = `${cond.name.split('(')[0].trim()} • ${cond.label}`;
        }
      });

      hotspot.addEventListener('mouseleave', () => {
        if (!activeConditionId) {
          if (teethTooltipText) teethTooltipText.textContent = 'Tap any hotspot or select a condition on the right';
        } else {
          const cond = dentalConditions.find(c => c.id === activeConditionId);
          if (cond && teethTooltipText) {
            teethTooltipText.textContent = `${cond.name.split('(')[0].trim()} • ${cond.label}`;
          }
        }
      });
    });

    function highlightTeethForCondition(condId) {
      const cond = dentalConditions.find(c => c.id === condId);
      if (!cond) return;

      const affectedSet = new Set(cond.teeth);
      let count = 0;

      // Highlight SVG teeth
      Object.entries(toothElements).forEach(([id, el]) => {
        el.classList.remove('active');
        if (affectedSet.has(id)) {
          el.classList.add('highlighted');
          el.classList.remove('dimmed');
          count++;
        } else {
          el.classList.remove('highlighted');
          el.classList.add('dimmed');
        }
      });

      // Highlight 3D Hotspot Pin & Position Glow
      hotspots.forEach(h => {
        if (h.getAttribute('data-condition') === condId) {
          h.classList.add('active');
          if (glowOverlay) {
            glowOverlay.style.setProperty('--glow-x', h.style.left || '50%');
            glowOverlay.style.setProperty('--glow-y', h.style.top || '50%');
            glowOverlay.classList.add('active');
          }
        } else {
          h.classList.remove('active');
        }
      });

      if (teethStatusText) {
        teethStatusText.textContent = cond.name.split('(')[0].trim();
      }
      if (teethHighlightSummary) {
        teethHighlightSummary.textContent = `${count} Target Teeth / Anatomy Highlighted`;
      }
      if (teethTooltipText) {
        teethTooltipText.textContent = `${cond.name.split('(')[0].trim()} • ${cond.label}`;
      }
    }

    function clearConditionHighlights() {
      Object.values(toothElements).forEach(el => {
        el.classList.remove('highlighted');
        el.classList.remove('dimmed');
        el.classList.remove('active');
      });
      hotspots.forEach(h => h.classList.remove('active'));
      if (glowOverlay) glowOverlay.classList.remove('active');

      if (teethStatusText) teethStatusText.textContent = 'Interactive 3D Dental Model';
      if (teethHighlightSummary) teethHighlightSummary.textContent = 'All 32 Teeth Normal';
      if (teethTooltipText) teethTooltipText.textContent = 'Tap any anatomical zone or select a condition on the right';
    }

    function toggleCondition(condId) {
      const allItems = accordionList?.querySelectorAll('.condition-pill-item') || [];

      if (activeConditionId === condId) {
        // Deselect
        allItems.forEach(it => {
          it.classList.remove('active');
          it.querySelector('.condition-pill-header')?.setAttribute('aria-expanded', 'false');
        });
        activeConditionId = null;
        clearConditionHighlights();
      } else {
        // Activate new condition
        allItems.forEach(it => {
          const match = it.getAttribute('data-condition-id') === condId;
          it.classList.toggle('active', match);
          it.querySelector('.condition-pill-header')?.setAttribute('aria-expanded', match ? 'true' : 'false');
        });
        activeConditionId = condId;
        highlightTeethForCondition(condId);
      }
    }

    // Two-Way Sync: Clicking a tooth on the Left Arch
    function onToothClick(toothId) {
      const tooth = teethData[toothId];
      if (!tooth) return;

      // Find best matching condition that includes this tooth
      let matchedCond = dentalConditions.find(c => c.teeth.includes(toothId));
      if (!matchedCond) {
        matchedCond = dentalConditions[0];
      }

      toggleCondition(matchedCond.id);

      // Specifically highlight the clicked tooth
      const clickedEl = toothElements[toothId];
      if (clickedEl) {
        clickedEl.classList.add('active');
      }

      if (teethTooltipText) {
        teethTooltipText.textContent = `Tooth #${tooth.id}: ${tooth.name} (FDI ${tooth.fdi}) • ${tooth.arch}`;
      }

      // On mobile/tablet, scroll condition into view smoothly
      if (window.innerWidth <= 1024) {
        const itemEl = accordionList?.querySelector(`[data-condition-id="${matchedCond.id}"]`);
        itemEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Tooth Hover preview
    function onToothHover(toothId) {
      const tooth = teethData[toothId];
      if (!tooth) return;
      if (teethTooltipText) {
        teethTooltipText.textContent = `Tooth #${tooth.id}: ${tooth.name} (FDI: ${tooth.fdi}) • ${tooth.quadrant}`;
      }
    }

    function onToothLeave() {
      if (!activeConditionId) {
        if (teethTooltipText) teethTooltipText.textContent = 'Tap any tooth or select a condition on the right';
      } else {
        const cond = dentalConditions.find(c => c.id === activeConditionId);
        if (cond && teethTooltipText) {
          teethTooltipText.textContent = `${cond.name.split('(')[0].trim()} • ${cond.label}`;
        }
      }
    }

    // Default: Activate First Condition (Tooth Decay & Cavities) to impress user immediately with glowing 3D anatomy!
    toggleCondition('decay');

    // Dentition Sub-Switch (Adult 32 / Child 20) inside Chart Stage
    const dentitionSubBtns = explorerSec.querySelectorAll('.dentition-sub-btn');
    dentitionSubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dentitionSubBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-dentition-mode');

        Object.values(teethData).forEach(t => {
          const el = toothElements[t.id];
          if (!el) return;

          if (mode === 'adult') {
            if (t.dentition === 'adult') {
              el.classList.remove('hidden-mode');
            } else {
              el.classList.add('hidden-mode');
            }
          } else {
            // child
            if (t.dentition === 'child') {
              el.classList.remove('hidden-mode');
            } else {
              el.classList.add('hidden-mode');
            }
          }
        });

        // Re-apply active condition highlight for visible teeth
        if (activeConditionId) {
          highlightTeethForCondition(activeConditionId);
        }
      });
    });
  }

  // Initialize Teeth Explorer
  initTeethExplorer();

});

