window.VetController = {
  activeDateTab: 'today',
  selectedSlotId: null,
  caseStudies: [],
  activeDoctorId: 'emily',
 
  doctorsData: [
    {
      id: 'emily',
      initials: 'ER',
      image: 'https://i.postimg.cc/HkGrbcVc/download.jpg',
      name: 'Dr. Emily Reynolds, DVM MRCVS',
      title: 'Chief Veterinary Surgeon & Small Animal Specialist',
      tags: ['Orthopedic Surgery', 'Internal Medicine', 'Canine Dermatology', 'Emergency Trauma'],
      bio: '14+ years of clinical excellence in advanced laparoscopic surgery, tibial plateau leveling osteotomy (TPLO), and complex feline internal medicine. Affiliated with FurEver Central Animal Hospital.',
      experience: '14+ Years',
      surgeries: '3,400+',
      rating: '4.98 ⭐',
      fee: 65,
      status: 'online'
    },
    {
      id: 'thomas',
      initials: 'AM',
      image: '../images/2.jpg',
      name: 'Dr. Thomas Baker, DVM',
      title: 'Feline & Exotic Animal Specialist',
      tags: ['Feline Medicine', 'Exotic Pets', 'Avian Care', 'Nutrition Therapy'],
      bio: '9 years of dedicated care for cats, birds, and exotic companions, with a focus on preventive nutrition plans and gentle, low-stress handling techniques.',
      experience: '9 Years',
      surgeries: '2,100+',
      rating: '4.92 ⭐',
      fee: 55,
      status: 'surgery'
    },
    {
      id: 'marcus',
      initials: 'MC',
      image: '../images/3 .jpg',
      name: 'Dr. Marcus Chen, DVM, DACVIM',
      title: 'Internal Medicine & Oncology Specialist',
      tags: ['Oncology', 'Endocrinology', 'Cardiology', 'Diagnostic Imaging'],
      bio: '12 years diagnosing and managing complex chronic conditions, from diabetes to cardiac disease, using advanced ultrasound and endoscopic diagnostics.',
      experience: '12 Years',
      surgeries: '2,800+',
      rating: '4.95 ⭐',
      fee: 75,
      status: 'online'
    },
    {
      id: 'samuel',
      initials: 'SO',
      image: '../images/4.jpg',
      name: 'Dr. Samuel Okafor, DVM',
      title: 'Emergency & Critical Care Veterinarian',
      tags: ['Emergency Medicine', 'Trauma Surgery', 'ICU Care', 'Toxicology'],
      bio: '7 years on the front line of animal emergencies, stabilizing trauma and poisoning cases and leading round-the-clock ICU monitoring.',
      experience: '7 Years',
      surgeries: '1,900+ ER Cases',
      rating: '4.89 ⭐',
      fee: 60,
      status: 'rounds'
    }
  ],
 
  slotsData: {
    today: [
      { id: 't-1', time: '09:00 AM', period: 'morning', status: 'booked', patient: 'Barnaby (Golden Retriever)' },
      { id: 't-2', time: '09:45 AM', period: 'morning', status: 'available' },
      { id: 't-3', time: '10:30 AM', period: 'morning', status: 'available' },
      { id: 't-4', time: '11:15 AM', period: 'morning', status: 'booked', patient: 'Luna (Persian Cat)' },
      { id: 't-5', time: '02:00 PM', period: 'afternoon', status: 'available' },
      { id: 't-6', time: '02:45 PM', period: 'afternoon', status: 'booked', patient: 'Rocky (Labrador)' },
      { id: 't-7', time: '03:30 PM', period: 'afternoon', status: 'available' },
      { id: 't-8', time: '04:15 PM', period: 'afternoon', status: 'available' },
      { id: 't-9', time: '05:30 PM', period: 'evening', status: 'available' },
      { id: 't-10', time: '06:15 PM', period: 'evening', status: 'booked', patient: 'Cleo (Calico)' },
      { id: 't-11', time: '07:00 PM', period: 'evening', status: 'available' }
    ],
    tomorrow: [
      { id: 'tm-1', time: '09:00 AM', period: 'morning', status: 'available' },
      { id: 'tm-2', time: '09:45 AM', period: 'morning', status: 'booked', patient: 'Jasper (Aussie)' },
      { id: 'tm-3', time: '10:30 AM', period: 'morning', status: 'available' },
      { id: 'tm-4', time: '11:15 AM', period: 'morning', status: 'available' },
      { id: 'tm-5', time: '02:00 PM', period: 'afternoon', status: 'available' },
      { id: 'tm-6', time: '02:45 PM', period: 'afternoon', status: 'available' },
      { id: 'tm-7', time: '03:30 PM', period: 'afternoon', status: 'booked', patient: 'Mochi (Cat)' },
      { id: 'tm-8', time: '04:15 PM', period: 'afternoon', status: 'available' }
    ]
  },
 
  init() {
    this.renderDoctorTabs();
    this.renderDoctorProfile();
    this.bindDoctorStatus();
    this.renderSlots();
    this.bindSlotActions();
    this.loadCaseStudies();
    this.initDosageCalculator();
  },
 
  getActiveDoctor() {
    return this.doctorsData.find(d => d.id === this.activeDoctorId) || this.doctorsData[0];
  },
 
  renderDoctorTabs() {
    const container = document.getElementById('vetTabsContainer');
    if (!container) return;
 
    container.innerHTML = this.doctorsData.map(d => `
      <button type="button" class="vet-tab-btn ${d.id === this.activeDoctorId ? 'active' : ''}" data-doctor-id="${d.id}">
        <span class="vet-tab-avatar">${d.image ? `<img src="${d.image}" alt="${App.escape(d.name)}" onerror="this.remove(); this.parentElement.textContent='${d.initials}';">` : d.initials}</span>
        <span>
          <span>${App.escape(d.name.replace('Dr. ', 'Dr. '))}</span>
          <small>${App.escape(d.title)}</small>
        </span>
      </button>
    `).join('');
 
    container.querySelectorAll('.vet-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeDoctorId = btn.dataset.doctorId;
        this.renderDoctorTabs();
        this.renderDoctorProfile();
      });
    });
  },
 
  renderDoctorProfile() {
    const d = this.getActiveDoctor();
 
    const avatar = document.getElementById('vetProfileAvatar');
    const name = document.getElementById('vetProfileName');
    const title = document.getElementById('vetProfileTitle');
    const badges = document.getElementById('vetProfileBadges');
    const bio = document.getElementById('vetProfileBio');
    const statusSelect = document.getElementById('vetStatusSelect');
    const expEl = document.getElementById('vetStatExperience');
    const surgEl = document.getElementById('vetStatSurgeries');
    const ratingEl = document.getElementById('vetStatRating');
    const feeEl = document.getElementById('vetStatFee');
 
    if (avatar) {
      avatar.innerHTML = d.image
        ? `<img src="${d.image}" alt="${App.escape(d.name)}" onerror="this.remove(); this.parentElement.textContent='${d.initials}';">`
        : d.initials;
    }
    if (name) name.textContent = d.name;
    if (title) title.textContent = d.title;
    if (badges) badges.innerHTML = d.tags.map(t => `<span class="badge badge-soft">${App.escape(t)}</span>`).join('');
    if (bio) bio.textContent = d.bio;
    if (statusSelect) statusSelect.value = d.status;
    if (expEl) expEl.textContent = d.experience;
    if (surgEl) surgEl.textContent = d.surgeries;
    if (ratingEl) ratingEl.textContent = d.rating;
    if (feeEl) feeEl.textContent = `$${d.fee} / slot`;
  },
 
  bindDoctorStatus() {
    const select = document.getElementById('vetStatusSelect');
    if (!select) return;
 
    select.addEventListener('change', (e) => {
      const val = e.target.value;
      const d = this.getActiveDoctor();
      d.status = val;
      if (val === 'online') {
        App.toast('Doctor status updated to: Available Online', 'Doctor Profile', 'success', 'bi-person-check-fill');
      } else if (val === 'surgery') {
        App.toast('Doctor status updated to: In Surgery (OR-2)', 'Doctor Profile', 'warning', 'bi-hospital-fill');
      } else {
        App.toast('Doctor status updated to: Inpatient Ward Rounds', 'Doctor Profile', 'info', 'bi-clipboard2-pulse-fill');
      }
    });
  },
 
  renderSlots() {
    const morningContainer = document.getElementById('slotsMorningContainer');
    const afternoonContainer = document.getElementById('slotsAfternoonContainer');
    const eveningContainer = document.getElementById('slotsEveningContainer');
    if (!morningContainer || !afternoonContainer) return;
 
    const slots = this.slotsData[this.activeDateTab] || this.slotsData['today'];
    const morningSlots = slots.filter(s => s.period === 'morning');
    const afternoonSlots = slots.filter(s => s.period === 'afternoon');
    const eveningSlots = slots.filter(s => s.period === 'evening');
 
    const renderList = (list) => {
      if (!list.length) return `<div class="col-12 text-muted small py-2">No clinical slots scheduled.</div>`;
      return list.map(s => `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="slot-pill ${s.status === 'available' ? 'slot-available' : 'slot-booked'}"
               data-id="${s.id}" data-time="${s.time}" data-status="${s.status}">
            <div class="d-flex align-items-center gap-1 mb-1">
              <i class="bi ${s.status === 'available' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}"></i>
              <span class="fw-bold">${s.time}</span>
            </div>
            <small style="font-size: 0.72rem;">
              ${s.status === 'available' ? 'Open for Booking' : (s.patient || 'Booked Slot')}
            </small>
          </div>
        </div>
      `).join('');
    };
 
    morningContainer.innerHTML = renderList(morningSlots);
    afternoonContainer.innerHTML = renderList(afternoonSlots);
    if (eveningContainer) {
      eveningContainer.innerHTML = renderList(eveningSlots);
    }
 
    this.bindSlotClicks();
  },
 
  bindSlotClicks() {
    document.querySelectorAll('.slot-pill').forEach(el => {
      el.addEventListener('click', () => {
        const status = el.dataset.status;
        const id = el.dataset.id;
        const time = el.dataset.time;
 
        if (status === 'booked') {
          App.toast(`Slot (${time}) is currently reserved by another patient.`, 'Slot Unavailable', 'warning');
          return;
        }
 
        this.selectedSlotId = id;
        const d = this.getActiveDoctor();
        const timeDisplay = document.getElementById('bookingSlotTimeDisplay');
        if (timeDisplay) timeDisplay.textContent = time;
        const docNameEl = document.getElementById('bookingDoctorName');
        if (docNameEl) docNameEl.textContent = d.name;
        const docFeeEl = document.getElementById('bookingDoctorFee');
        if (docFeeEl) docFeeEl.textContent = `$${d.fee} (Includes Vitals Diagnostic)`;
 
        const modalEl = document.getElementById('slotBookingModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    });
  },
 
  bindSlotActions() {
    
    document.querySelectorAll('.btn-date-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-date-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeDateTab = btn.dataset.date;
        this.renderSlots();
      });
    });
 
    
    const confirmBtn = document.getElementById('btnConfirmSlot');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const petName = document.getElementById('bookingPetName')?.value.trim() || 'Patient Pet';
        const reason = document.getElementById('bookingReason')?.value.trim() || 'General Consultation';
 
        if (this.selectedSlotId) {
          const slots = this.slotsData[this.activeDateTab];
          const target = slots.find(s => s.id === this.selectedSlotId);
          if (target) {
            target.status = 'booked';
            target.patient = `${petName} (${reason})`;
            this.renderSlots();
 
            const modalEl = document.getElementById('slotBookingModal');
            if (modalEl) {
              bootstrap.Modal.getInstance(modalEl)?.hide();
            }
 
            App.toast(`Appointment confirmed for ${petName} at ${target.time}!`, 'Consultation Booked', 'success', 'bi-calendar-check-fill');
            App.confetti();
          }
        }
      });
    }
  },
 
  async loadCaseStudies() {
    try {
      this.caseStudies = await App.fetchJSON('../data/medical-records.json', 'medicalRecords');
      this.renderCaseStudies();
    } catch (e) {
      console.error('Error loading case studies:', e);
      this.caseStudies = window.DEFAULT_DATA?.medicalRecords || [];
      this.renderCaseStudies();
    }
  },
 
  renderCaseStudies() {
    const accordion = document.getElementById('caseStudiesAccordion');
    if (!accordion) return;
 
    if (!this.caseStudies.length) {
      accordion.innerHTML = `<div class="text-muted small py-3">No case studies loaded.</div>`;
      return;
    }
 
    accordion.innerHTML = this.caseStudies.map((c, idx) => `
      <div class="accordion-item mb-2 border shadow-sm">
        <h2 class="accordion-header" id="headingCase${idx}">
          <button class="accordion-button ${idx !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCase${idx}" aria-expanded="${idx === 0 ? 'true' : 'false'}">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center w-100 me-3">
              <div class="d-flex align-items-center gap-2">
                <span class="badge ${c.badgeClass || 'badge-soft'}">${c.badge || 'Case'}</span>
                <strong class="text-brown">${App.escape(c.title)}</strong>
              </div>
              <small class="text-muted mt-1 mt-md-0"><i class="bi bi-calendar me-1"></i>${c.date} • ${App.escape(c.patient)}</small>
            </div>
          </button>
        </h2>
        <div id="collapseCase${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" data-bs-parent="#caseStudiesAccordion">
          <div class="accordion-body bg-white">
            <div class="p-3 bg-light rounded-3 mb-3 border">
              <h4 class="h6 fw-bold text-brown mb-1"><i class="bi bi-clipboard2-pulse text-peach me-1"></i> Complaint & Diagnostics</h4>
              <p class="small text-muted mb-0">${App.escape(c.complaint || c.chiefComplaint || 'Clinical diagnosis')}</p>
            </div>
            <div class="p-3 bg-light rounded-3 mb-3 border">
              <h4 class="h6 fw-bold text-brown mb-1"><i class="bi bi-bandaid text-peach me-1"></i> Treatment & Protocol</h4>
              <p class="small text-muted mb-0">${App.escape(c.treatment || 'Prescription protocol instituted')}</p>
            </div>
            ${c.vitals && c.vitals.length ? `
              <div class="table-responsive">
                <table class="table table-sm table-bordered bg-white small mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Clinical Parameter</th>
                      <th class="text-danger">Pre-Treatment</th>
                      <th class="text-success">Post-Treatment</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${c.vitals.map(v => `
                      <tr>
                        <td><strong>${v.param || v.parameter}</strong></td>
                        <td class="text-danger">${v.before}</td>
                        <td class="text-success fw-bold"><i class="bi bi-arrow-up-right me-1"></i>${v.after}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  },
 
  initDosageCalculator() {
    const btn = document.getElementById('btnCalcDosage');
    if (!btn) return;
 
    btn.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('dosageWeight')?.value) || 10;
      const target = parseFloat(document.getElementById('dosageTarget')?.value) || 5;
      const conc = parseFloat(document.getElementById('dosageConc')?.value) || 50;
 
      const totalMg = (weight * target).toFixed(2);
      const totalMl = (totalMg / conc).toFixed(2);
 
      const resultBox = document.getElementById('dosageResultBox');
      if (resultBox) {
        resultBox.innerHTML = `
          <div class="p-3 bg-light rounded-3 border border-success animate-pulse-glow">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted d-block">Required Dose</small>
                <h4 class="fw-bold text-brown mb-0">${totalMg} mg</h4>
              </div>
              <div class="text-end">
                <small class="text-muted d-block">Syringe Volume</small>
                <h3 class="fw-bold text-peach mb-0">${totalMl} mL</h3>
              </div>
            </div>
          </div>
        `;
      }
    });
  }
};
 
document.addEventListener('DOMContentLoaded', () => {
  window.VetController.init();
});
 