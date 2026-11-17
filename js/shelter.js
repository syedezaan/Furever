
window.ShelterController = {
  pets: [],
  filteredPets: [],
  selectedPetForAdoption: null,
  donationRaised: 18450,
  donationTarget: 25000,

  async init() {
    await this.loadPets();
    await this.loadStories();
    await this.loadEvents();
    this.bindFilters();
    this.bindDonation();
    this.bindAdoptionModal();
  },

  async loadPets() {
    try {
      this.pets = await App.fetchJSON('../data/adoption-pets.json', 'pets');
      this.filteredPets = [...this.pets];
      this.renderPets();
    } catch (e) {
      console.error('Error loading adoptable pets:', e);
      this.pets = window.DEFAULT_DATA?.pets || [];
      this.filteredPets = [...this.pets];
      this.renderPets();
    }
  },

  bindFilters() {
    document.querySelectorAll('.adopt-filter').forEach(el => {
      el.addEventListener('input', () => this.applyFilters());
      el.addEventListener('change', () => this.applyFilters());
    });
  },

  applyFilters() {
    const q = document.getElementById('adoptionSearch')?.value.toLowerCase().trim() || '';
    const type = document.getElementById('typeFilter')?.value || 'all';
    const age = document.getElementById('ageFilter')?.value || 'all';
    const breed = document.getElementById('breedFilter')?.value || 'all';
    const loc = document.getElementById('locationFilter')?.value || 'all';

    this.filteredPets = this.pets.filter(p => {
      const matchesQuery = !q ||
                           p.name.toLowerCase().includes(q) ||
                           p.breed.toLowerCase().includes(q) ||
                           p.description.toLowerCase().includes(q);

      const matchesType = type === 'all' || p.type?.toLowerCase() === type.toLowerCase() || p.species?.toLowerCase() === type.toLowerCase();
      const matchesAge = age === 'all' || p.ageGroup?.toLowerCase() === age.toLowerCase() || p.age?.toLowerCase().includes(age.toLowerCase());
      const matchesBreed = breed === 'all' || p.breed?.toLowerCase().includes(breed.toLowerCase());
      const matchesLoc = loc === 'all' || p.location?.toLowerCase().includes(loc.toLowerCase());

      return matchesQuery && matchesType && matchesAge && matchesBreed && matchesLoc;
    });

    this.renderPets();
  },

  renderPets() {
    const grid = document.getElementById('adoptionGrid');
    if (!grid) return;

    if (!this.filteredPets.length) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="empty-state py-5">
            <i class="bi bi-heartbreak fs-1 d-block mb-2 text-peach"></i>
            <h4>No pets found matching your filters</h4>
            <p class="small text-muted mb-0">Try selecting "All" or searching for a different breed.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredPets.map(p => `
      <div class="col-md-6 col-lg-4 reveal visible">
        <div class="pet-card">
          <div class="position-relative">
            <img src="${p.image}" alt="${p.name}" class="pet-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'">
            <span class="badge position-absolute top-0 end-0 m-3" style="background: var(--dark); color: #fff;">
              ${p.type || p.species} • ${p.location}
            </span>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-baseline mb-1">
              <h3 class="h5 fw-bold text-brown mb-0">${App.escape(p.name)}</h3>
              <small class="text-muted fw-semibold">${p.age}</small>
            </div>
            <p class="small text-muted mb-2">${p.breed} • ${p.gender}</p>
            ${p.personality ? `
              <div class="mb-2">
                ${p.personality.slice(0, 3).map(trait => `<span class="personality-tag">${trait}</span>`).join('')}
              </div>
            ` : ''}
            <p class="small text-muted mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${App.escape(p.description)}
            </p>
            <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
              <span class="fw-bold text-brown small">${p.fee || '$50 Fee'}</span>
              <button class="btn btn-peach btn-sm px-3 btn-open-adopt-modal" data-id="${p.id}">
                <i class="bi bi-heart-fill me-1"></i> Adopt Me
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-open-adopt-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const pet = this.pets.find(p => p.id === id);
        if (pet) {
          this.selectedPetForAdoption = pet;
          this.showAdoptionModal(pet);
        }
      });
    });
  },

  showAdoptionModal(pet) {
    const modalEl = document.getElementById('adoptionModal');
    if (!modalEl) return;

    document.getElementById('adoptModalPetName').textContent = pet.name;
    document.getElementById('adoptModalPetInfo').textContent = `${pet.breed} • ${pet.age} • ${pet.gender}`;
    document.getElementById('adoptModalPetImg').src = pet.image;
    document.getElementById('adoptModalPetDesc').textContent = pet.description;
    document.getElementById('adoptModalFee').textContent = pet.fee || '$50 Fee';

    new bootstrap.Modal(modalEl).show();
  },

  bindAdoptionModal() {
    const submitBtn = document.getElementById('btnSubmitAdoption');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', () => {
      const applicantName = document.getElementById('adoptApplicantName')?.value.trim();
      const applicantPhone = document.getElementById('adoptApplicantPhone')?.value.trim();

      if (!applicantName || !applicantPhone) {
        App.toast('Please enter your full name and phone number.', 'Missing Information', 'warning');
        return;
      }

      if (this.selectedPetForAdoption) {
        App.saveAdoptionInterest(this.selectedPetForAdoption);
      }

      const modalEl = document.getElementById('adoptionModal');
      if (modalEl) {
        bootstrap.Modal.getInstance(modalEl)?.hide();
      }

      App.toast(`Adoption request submitted for ${this.selectedPetForAdoption?.name || 'your selected pet'}! Our sanctuary counselor will contact you at ${applicantPhone}.`, 'Application Received', 'success', 'bi-heart-fill');
      App.confetti();
    });
  },

  async loadStories() {
    const container = document.getElementById('stories');
    if (!container) return;

    try {
      const stories = await App.fetchJSON('../data/success-stories.json', 'successStories');
      container.innerHTML = stories.map(s => `
        <div class="col-md-6 reveal visible">
          <div class="content-card p-4">
            <div class="row g-3 align-items-center">
              <div class="col-sm-5">
                <img src="${s.image}" alt="${s.name}" class="rounded-3 img-fluid w-100" style="height: 160px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'">
              </div>
              <div class="col-sm-7">
                <h4 class="h6 fw-bold text-brown mb-1">${App.escape(s.name)}</h4>
                <small class="text-muted d-block mb-2"><i class="bi bi-calendar me-1"></i>${s.date}</small>
                <p class="small text-muted mb-0">"${App.escape(s.story)}"</p>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Error loading stories:', e);
    }
  },

  async loadEvents() {
    const container = document.getElementById('events');
    if (!container) return;

    try {
      const events = await App.fetchJSON('../data/events.json', 'events');
      container.innerHTML = events.map((ev, idx) => `
        <div class="col-12 reveal visible">
          <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h4 class="h6 fw-bold text-brown mb-0">${App.escape(ev.title)}</h4>
                <small class="text-muted"><i class="bi bi-geo-alt me-1"></i>${ev.location} • ${ev.date}</small>
              </div>
              <span class="badge badge-soft event-seats-badge-${idx}">${ev.spots || 20} spots remaining</span>
            </div>
            <p class="small text-muted mb-3">${App.escape(ev.description)}</p>
            <button class="btn btn-peach btn-sm px-3 btn-event-rsvp" data-index="${idx}" data-title="${App.escape(ev.title)}">
              <i class="bi bi-ticket-perforated me-1"></i> RSVP / Register
            </button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.btn-event-rsvp').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.title;
          const idx = btn.dataset.index;
          const badge = container.querySelector(`.event-seats-badge-${idx}`);
          if (badge) {
            let current = parseInt(badge.textContent, 10) || 20;
            current = Math.max(0, current - 1);
            badge.textContent = `${current} spots remaining`;
          }
          btn.disabled = true;
          btn.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Registered`;
          App.toast(`Registered for "${title}"! Check your email for venue passes.`, 'RSVP Confirmed', 'success');
          App.confetti();
        });
      });
    } catch (e) {
      console.error('Error loading events:', e);
    }
  },

  bindDonation() {
    const donateBtn = document.getElementById('btnQuickDonate');
    const input = document.getElementById('donateAmountInput');
    const raisedText = document.getElementById('donationRaisedText');
    const progressBar = document.getElementById('donationProgressBar');

    if (!donateBtn || !input) return;

    donateBtn.addEventListener('click', () => {
      const amount = parseFloat(input.value) || 0;
      if (amount <= 0) {
        App.toast('Please enter a donation amount.', 'Invalid Amount', 'warning');
        return;
      }

      this.donationRaised += amount;
      const pct = Math.min(100, Math.round((this.donationRaised / this.donationTarget) * 100));

      if (raisedText) raisedText.textContent = `$${this.donationRaised.toLocaleString()}`;
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
        progressBar.textContent = `${pct}%`;
      }

      App.toast(`Thank you! Your donation of $${amount.toFixed(2)} helps provide warm kennels for rescued pets.`, 'Donation Received', 'success', 'bi-heart-fill');
      App.confetti();
      input.value = '25';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ShelterController.init();
});
