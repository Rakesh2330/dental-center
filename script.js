/**
 * Dr. Ahalya's Dento Neuro Clinic - Restructured Interactive Experience
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

  // Lock scroll
  document.body.classList.add('is-loading');

  // Apply saved theme instantly so preloader renders correctly
  const savedTheme = localStorage.getItem('dnc-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Minimum display time (ms) — lets the animation play fully
  const MIN_DISPLAY = 2200;
  const startTime   = Date.now();

  function dismissPreloader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY - elapsed);

    setTimeout(() => {
      // Complete the progress bar to 100%
      if (bar) bar.style.width = '100%';
      if (label) label.textContent = 'Ready';

      // Small pause then fade out
      setTimeout(() => {
        preloader.classList.add('preloader-done');
        document.body.classList.remove('is-loading');

        // Reveal any elements already visible on screen
        window.dispatchEvent(new Event('scroll'));
        document.querySelectorAll('.scroll-reveal, .reveal-from-left, .reveal-from-right, .reveal-zoom').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 150 && rect.bottom > -50) {
            el.classList.add('is-revealed', 'reveal-done');
          }
        });

        // Remove from DOM after transition
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
        }, { once: true });
      }, 320);
    }, remaining);
  }

  // Dismiss when all assets are loaded
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader, { once: true });
  }

  // Safety fallback: never block for more than 5s
  setTimeout(dismissPreloader, 5000);
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

  // --- 3. Live Clinic Status Indicator ---
  const liveStatusText = document.getElementById('liveStatusText');
  function updateLiveStatus() {
    if (!liveStatusText) return;
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1: Mon ... 6: Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hours + minutes / 60;

    if (day === 0) {
      liveStatusText.textContent = "Sunday Special Service: Prior Appointments & Emergency Triage Active";
    } else {
      if (timeVal >= 10 && timeVal < 14) {
        liveStatusText.textContent = "Morning OPD Active Now in Saraswathipuram | Consultations In Progress (Until 2:00 PM)";
      } else if (timeVal >= 14 && timeVal < 16) {
        liveStatusText.textContent = "Mid-Day Disinfection Protocol | Evening Specialist OPD Starts at 4:00 PM";
      } else if (timeVal >= 16 && timeVal < 20) {
        liveStatusText.textContent = "Evening OPD Active Now | Consultations In Progress (Until 8:00 PM)";
      } else {
        liveStatusText.textContent = "Clinic OPD Closed for Tonight | Resumes Tomorrow at 10:00 AM in Saraswathipuram";
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
      bioText: "Dr. Ahalya N is a leading dental surgeon in Mysuru known for combining micro-endodontic accuracy with aesthetic smile symmetry. She specializes in single-sitting painless root canals, diode laser therapies, restorative cosmetics, and pediatric dental care with an empathetic, patient-first approach.",
      highlights: [
        "Single-Sitting Painless Rotary Root Canal Treatments (Apex-Controlled)",
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

  // --- 7. Facilities Lightbox Modal ---
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-caption')?.textContent || 'Clinic Facility';
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
      `Hello Dr. Ahalya's Dento Neuro Clinic, I have scheduled a consultation.\n\n` +
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
  const clinicAddressText = "165/1, Sahukar Chennaiah Road, Opposite Brahmasthana Kalyan Mantapa, Saraswathipuram, Mysuru, Karnataka – 570009";

  copyAddressBtn?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clinicAddressText).then(() => {
        showToast("Address copied to clipboard!");
      }).catch(() => {
        fallbackCopy(clinicAddressText);
      });
    } else {
      fallbackCopy(clinicAddressText);
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
    let animFrameId;
    let particles = [];
    const PARTICLE_COUNT = 48;
    const CONNECT_DIST  = 130;

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
        vx: rand(-0.28, 0.28),
        vy: rand(-0.22, 0.22),
        r:  rand(1.8, 4.2),
        color: c,
        alpha: rand(0.25, 0.6),
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
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * (isDark() ? 0.18 : 0.12);
            const c = particles[i].color;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
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
    tick();

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
      if (scrollY > heroH * 1.2) return;

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

});
