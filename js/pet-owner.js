
window.PetPassport = {
  activePhotoData: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',

  currentPet: {
    name: 'Maximus',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    age: '2.5 Years',
    weight: '31 kg',
    microchip: '985-1410-0294-817',
    allergies: 'Chicken sensitive, Needs weekly ear cleaning',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    owner: 'Sarah Jenkins',
    contact: '+1 (555) 234-5678',
    vet: 'FurEver Central Animal Hospital',
    vaccine: 'Up to Date (Core & Rabies Verified)',
    issueDate: 'August 2026',
    passportNo: 'FEC-PASSPORT-985141'
  },

  init() {
    this.loadPersistedPet();
    this.bindPhotoControls();
    this.bindChipGenerator();
    this.bindSampleReset();
    this.bindForm();
    this.bindFlipAndPrint();
    this.populateForm();
    this.renderPassportCard();
  },

  loadPersistedPet() {
    const saved = loadSavedPetProfile();
    if (saved && saved.name) {
      this.currentPet = { ...this.currentPet, ...saved };
      this.activePhotoData = this.currentPet.photo || this.activePhotoData;
    }
  },

  populateForm() {
    const p = this.currentPet;
    const setValue = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };

    setValue('petName', p.name);
    setValue('petSpecies', p.species);
    setValue('petBreed', p.breed);
    setValue('petGender', p.gender || 'Male');
    setValue('petAge', p.age);
    setValue('petWeight', p.weight);
    setValue('petChip', p.microchip);
    setValue('petOwnerName', p.owner || 'Sarah Jenkins');
    setValue('petEmergencyPhone', p.contact);
    setValue('petVetClinic', p.vet || 'FurEver Central Animal Hospital');
    setValue('petVaccination', p.vaccine || 'Up to Date (Core & Rabies Verified)');
    setValue('petAllergies', p.allergies);

    this.updatePreviewPhoto(this.currentPet.photo);
  },

  updatePreviewPhoto(src) {
    if (!src) return;
    this.activePhotoData = src;
    const img = document.getElementById('petPhotoPreviewImg');
    if (img) {
      img.src = src;
    }
  },

  bindPhotoControls() {
    const modeRadios = document.querySelectorAll('input[name="photoSourceMode"]');
    const containerFile = document.getElementById('photoContainerFile');
    const containerUrl = document.getElementById('photoContainerUrl');
    const containerPreset = document.getElementById('photoContainerPreset');

    modeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        if (containerFile) containerFile.style.display = mode === 'file' ? 'block' : 'none';
        if (containerUrl) containerUrl.style.display = mode === 'url' ? 'block' : 'none';
        if (containerPreset) containerPreset.style.display = mode === 'preset' ? 'block' : 'none';
      });
    });

    
    const fileInput = document.getElementById('petPhotoFile');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            App.toast('Please choose a valid image file (JPG, PNG, WEBP).', 'Invalid File', 'warning');
            return;
          }
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            const dataUrl = loadEvt.target.result;
            this.updatePreviewPhoto(dataUrl);
            App.toast(`Loaded image: "${file.name}"`, 'Photo Uploaded', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    
    const urlInput = document.getElementById('petPhotoUrl');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'))) {
          this.updatePreviewPhoto(url);
        }
      });
    }

    
    const presetSelect = document.getElementById('petPhotoPreset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          this.updatePreviewPhoto(e.target.value);
        }
      });
    }
  },

  bindChipGenerator() {
    const chipBtn = document.getElementById('btnGenChip');
    if (chipBtn) {
      chipBtn.addEventListener('click', () => {
        const randomChip = '985-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(100 + Math.random() * 900);
        const input = document.getElementById('petChip');
        if (input) {
          input.value = randomChip;
        }
        App.toast(`Generated RFID Microchip: ${randomChip}`, 'Chip Assigned', 'info');
      });
    }
  },

  bindSampleReset() {
    const resetBtn = document.getElementById('btnResetSample');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.currentPet = {
          name: 'Maximus',
          species: 'Dog',
          breed: 'Golden Retriever',
          gender: 'Male',
          age: '2.5 Years',
          weight: '31 kg',
          microchip: '985-1410-0294-817',
          allergies: 'Chicken sensitive, Needs weekly ear cleaning',
          photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
          owner: 'Sarah Jenkins',
          contact: '+1 (555) 234-5678',
          vet: 'FurEver Central Animal Hospital',
          vaccine: 'Up to Date (Core & Rabies Verified)',
          issueDate: 'August 2026',
          passportNo: 'FEC-PASSPORT-985141'
        };
        savePetProfileToStorage(this.currentPet);
        this.populateForm();
        this.renderPassportCard();
        App.toast('Reset to default sample pet profile.', 'Sample Loaded', 'info');
      });
    }
  },

  bindForm() {
    const form = document.getElementById('petProfileForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!App.validateForm(form)) {
        App.toast('Please fill all required fields.', 'Validation Error', 'warning');
        return;
      }

      const name = document.getElementById('petName')?.value.trim() || 'My Pet';
      const species = document.getElementById('petSpecies')?.value || 'Dog';
      const breed = document.getElementById('petBreed')?.value.trim() || 'Mixed Breed';
      const gender = document.getElementById('petGender')?.value || 'Male';
      const age = document.getElementById('petAge')?.value.trim() || '1 Year';
      const weight = document.getElementById('petWeight')?.value.trim() || '10 kg';
      const microchip = document.getElementById('petChip')?.value.trim() || '985-0000-' + Math.floor(1000 + Math.random() * 9000);
      const owner = document.getElementById('petOwnerName')?.value.trim() || 'Sarah Jenkins';
      const contact = document.getElementById('petEmergencyPhone')?.value.trim() || '+1 (555) 234-5678';
      const vet = document.getElementById('petVetClinic')?.value.trim() || 'FurEver Central Animal Hospital';
      const vaccine = document.getElementById('petVaccination')?.value || 'Up to Date (Core & Rabies Verified)';
      const allergies = document.getElementById('petAllergies')?.value.trim() || 'None reported';
      const photo = this.activePhotoData || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80';

      const passportNo = 'FEC-PASSPORT-' + microchip.replace(/[^0-9]/g, '').slice(-6);
      const issueDate = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      this.currentPet = {
        name,
        species,
        breed,
        gender,
        age,
        weight,
        microchip,
        allergies,
        photo,
        owner,
        contact,
        vet,
        vaccine,
        passportNo,
        issueDate
      };

      savePetProfileToStorage(this.currentPet);
      this.renderPassportCard();
      App.toast(`Digital Pet Passport generated for ${name}!`, 'Passport Created', 'success', 'bi-award-fill');
      App.confetti();

      const anchor = document.getElementById('petCardAnchor');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  },

  bindFlipAndPrint() {
    const toggleFlip = () => {
      const card = document.getElementById('printablePetCard');
      const label = document.getElementById('flipCardLabel');
      if (card) {
        card.classList.toggle('flipped');
        const isFlipped = card.classList.contains('flipped');
        if (label) {
          label.textContent = isFlipped ? 'Flip to Front Passport' : 'Flip to Medical Back Side';
        }
      }
    };

    const card = document.getElementById('printablePetCard');
    if (card) card.addEventListener('click', toggleFlip);

    document.getElementById('btnFlipCard')?.addEventListener('click', toggleFlip);

    document.getElementById('btnPrintCard')?.addEventListener('click', () => {
      App.toast('Opening print preview for Digital Pet Passport...', 'Print Document', 'info');
      setTimeout(() => window.print(), 300);
    });

    document.getElementById('btnDownloadCardPng')?.addEventListener('click', () => {
      this.downloadPetIdBadgePng();
    });
  },

  downloadPetIdBadgePng() {
    const pet = this.currentPet || defaultPetProfile;
    App.toast(`Generating high-resolution ID Badge for ${pet.name}...`, 'Generating Image', 'info', 'bi-image');

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    
    const bgGrad = ctx.createLinearGradient(0, 0, 1000, 630);
    bgGrad.addColorStop(0, '#5B3A29');
    bgGrad.addColorStop(0.5, '#402619');
    bgGrad.addColorStop(1, '#2B1A12');
    ctx.fillStyle = bgGrad;
    ctx.roundRect(0, 0, 1000, 630, 32);
    ctx.fill();

    
    ctx.strokeStyle = '#FF9F7A';
    ctx.lineWidth = 6;
    ctx.roundRect(16, 16, 968, 598, 24);
    ctx.stroke();

    
    ctx.fillStyle = '#FF9F7A';
    ctx.font = 'bold 30px Poppins, Arial, sans-serif';
    ctx.fillText('🐾 FUREVER CARE • OFFICIAL PET PASSPORT', 50, 70);

    ctx.fillStyle = '#FFE4D6';
    ctx.font = '16px Poppins, Arial, sans-serif';
    ctx.fillText('ENCRYPTED RFID SMART COMPANION IDENTITY CARD', 50, 100);

    
    ctx.strokeStyle = 'rgba(255, 159, 122, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(950, 120);
    ctx.stroke();

    
    const photoImg = new Image();
    photoImg.crossOrigin = 'Anonymous';
    photoImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(50, 150, 260, 260, 20);
      ctx.clip();
      ctx.drawImage(photoImg, 50, 150, 260, 260);
      ctx.restore();

      
      ctx.strokeStyle = '#FF9F7A';
      ctx.lineWidth = 4;
      ctx.roundRect(50, 150, 260, 260, 20);
      ctx.stroke();

      this.finishCanvasDrawing(canvas, ctx, pet);
    };

    photoImg.onerror = () => {
      
      ctx.fillStyle = '#FFE4D6';
      ctx.roundRect(50, 150, 260, 260, 20);
      ctx.fill();
      ctx.fillStyle = '#5B3A29';
      ctx.font = 'bold 90px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐶', 180, 310);
      ctx.textAlign = 'left';

      this.finishCanvasDrawing(canvas, ctx, pet);
    };

    photoImg.src = pet.photo || defaultPetProfile.photo;
  },

  finishCanvasDrawing(canvas, ctx, pet) {
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Poppins, Arial, sans-serif';
    ctx.fillText(pet.name.toUpperCase(), 350, 185);

    ctx.fillStyle = '#FF9F7A';
    ctx.font = 'bold 20px Poppins, Arial, sans-serif';
    ctx.fillText(`${pet.breed} • ${pet.species}`, 350, 220);

    ctx.fillStyle = '#FFE4D6';
    ctx.font = '18px Poppins, Arial, sans-serif';
    ctx.fillText(`Sex: ${pet.gender}   |   Age: ${pet.age}   |   Weight: ${pet.weight}`, 350, 260);

    ctx.fillStyle = '#FFE4D6';
    ctx.fillText(`Guardian: ${pet.owner || 'Sarah Jenkins'}`, 350, 300);
    ctx.fillText(`Emergency Contact: ${pet.contact || '+1 (555) 234-5678'}`, 350, 335);
    ctx.fillText(`Primary Clinic: ${pet.vet || 'FurEver Central Animal Hospital'}`, 350, 370);

    
    ctx.fillStyle = 'rgba(255, 159, 122, 0.15)';
    ctx.roundRect(50, 440, 900, 75, 16);
    ctx.fill();
    ctx.strokeStyle = '#FF9F7A';
    ctx.lineWidth = 1.5;
    ctx.roundRect(50, 440, 900, 75, 16);
    ctx.stroke();

    ctx.fillStyle = '#FF9F7A';
    ctx.font = 'bold 18px Poppins, Arial, sans-serif';
    ctx.fillText('RFID MICROCHIP TAG:', 70, 485);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Courier, monospace';
    ctx.fillText(pet.microchip || '985-1410-0294-817', 280, 486);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px Poppins, Arial, sans-serif';
    ctx.fillText('VERIFIED ACTIVE', 750, 485);

    
    ctx.fillStyle = '#FFE4D6';
    ctx.font = '14px Poppins, Arial, sans-serif';
    ctx.fillText(`Passport ID: ${pet.passportNo || 'FC-94821'}   |   Issued: ${pet.issueDate || 'August 2026'}   |   Official Digital Credential`, 50, 580);

    
    const link = document.createElement('a');
    link.download = `${pet.name.replace(/\s+/g, '_')}_FurEver_Passport.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    App.confetti();
    App.toast(`Downloaded ${pet.name}'s Official Smart ID Badge!`, 'Badge Saved', 'success', 'bi-file-earmark-check-fill');
  },

  renderPassportCard() {
    const card = document.getElementById('printablePetCard');
    if (!card) return;

    const pet = this.currentPet;
    const icon = pet.species === 'Dog' ? 'bi-heart-fill' : pet.species === 'Cat' ? 'bi-stars' : 'bi-shield-heart';

    card.innerHTML = `
      <!-- FRONT SIDE OF PASSPORT -->
      <div class="pet-id-card-front">
        <!-- Holographic Chip Seal -->
        <div class="pet-id-hologram animate-pulse-glow" title="Official Encrypted Microchip Passport">
          <i class="bi ${icon}"></i>
        </div>

        <!-- Top Header & Photo -->
        <div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge" style="background: var(--brown); color: #fff; font-size: 0.72rem; letter-spacing: 0.5px;">
              🐾 FUREVER CARE PASSPORT
            </span>
            <small class="text-muted font-monospace pe-5" style="font-size: 0.72rem;">${pet.passportNo}</small>
          </div>

          <div class="d-flex align-items-center gap-3">
            <img src="${pet.photo}" alt="${pet.name}" class="pet-id-photo" onerror="this.src='https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2">
                <h4 class="mb-0 fw-bold text-brown">${pet.name}</h4>
                <span class="badge badge-soft" style="font-size: 0.72rem;">${pet.species}</span>
              </div>
              <p class="text-muted mb-1 small fw-semibold">${pet.breed} • ${pet.gender || 'Companion'}</p>
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-0 small" style="font-size: 0.72rem;">
                <i class="bi bi-shield-check me-1"></i> Verified Chip ID
              </span>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="row g-2 bg-white bg-opacity-80 p-2 rounded-3 my-2 small border">
          <div class="col-6">
            <span class="text-muted d-block" style="font-size: 0.72rem;">Age / Weight:</span>
            <strong class="text-brown">${pet.age} • ${pet.weight}</strong>
          </div>
          <div class="col-6">
            <span class="text-muted d-block" style="font-size: 0.72rem;">RFID Microchip Tag:</span>
            <strong class="font-monospace text-brown" style="font-size: 0.8rem;">${pet.microchip}</strong>
          </div>
          <div class="col-12 mt-1 pt-1 border-top">
            <span class="text-muted d-block" style="font-size: 0.72rem;">Special Care / Warnings:</span>
            <span class="text-danger fw-semibold" style="font-size: 0.76rem;">
              <i class="bi bi-exclamation-triangle me-1"></i> ${pet.allergies}
            </span>
          </div>
        </div>

        <!-- Footer with QR Code -->
        <div class="d-flex align-items-center justify-content-between pt-1">
          <div class="pet-id-qr" title="Scan to verify passport online">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=FurEverCare-PetID-${encodeURIComponent(pet.name)}-${pet.microchip}" alt="QR" style="width: 100%; height: 100%;">
          </div>
          <div class="flex-grow-1 ms-3">
            <div class="pet-id-barcode mb-1"></div>
            <div class="d-flex justify-content-between text-muted" style="font-size: 0.68rem;">
              <span>Parent: <strong>${pet.owner}</strong></span>
              <span>Emergency: <strong>${pet.contact}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- BACK SIDE OF PASSPORT (OFFICIAL CLINICAL & VACCINE REGISTER) -->
      <div class="pet-id-card-back">
        <!-- Gold Security Seal -->
        <div class="pet-id-back-seal animate-pulse-glow" title="Official Verified Animal Health Authority Seal">
          <i class="bi bi-award-fill"></i>
        </div>

        <!-- Header -->
        <div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge" style="background: var(--peach); color: #fff; font-size: 0.72rem; letter-spacing: 0.5px;">
              <i class="bi bi-file-medical-fill me-1"></i> VET REGISTER
            </span>
            <small class="text-white-50 font-monospace pe-5" style="font-size: 0.72rem;">ISSUE: ${pet.issueDate}</small>
          </div>
          <h5 class="fw-bold text-white mb-0">${pet.name}'s Medical & Vaccine Record</h5>
          <small class="text-white-50" style="font-size: 0.75rem;">Verified Primary Care Clinic: ${pet.vet}</small>
        </div>

        <!-- Medical Details Box -->
        <div class="pet-back-data-box my-2">
          <div class="row g-2 small">
            <div class="col-6">
              <span class="text-white-50 d-block" style="font-size: 0.7rem;">Immunization Status:</span>
              <span class="text-success fw-bold" style="font-size: 0.78rem;">
                <i class="bi bi-shield-fill-check me-1"></i>${pet.vaccine}
              </span>
            </div>
            <div class="col-6">
              <span class="text-white-50 d-block" style="font-size: 0.7rem;">Rabies & Core Tag:</span>
              <span class="text-warning fw-bold font-monospace" style="font-size: 0.78rem;">#RAB-2026-OK</span>
            </div>
            <div class="col-12 mt-1 pt-1 border-top border-white border-opacity-10">
              <span class="text-white-50 d-block" style="font-size: 0.7rem;">Guardian Emergency Contact:</span>
              <span class="text-white fw-semibold" style="font-size: 0.78rem;">
                <i class="bi bi-telephone-fill me-1 text-peach"></i>${pet.contact} (${pet.owner})
              </span>
            </div>
          </div>
        </div>

        <!-- Verification Signature & Emergency Hotline -->
        <div class="d-flex align-items-center justify-content-between pt-1 border-top border-white border-opacity-15">
          <div>
            <span class="text-white-50 d-block" style="font-size: 0.65rem;">AUTHORIZED CLINICAL STAMP</span>
            <span class="text-peach font-monospace fw-bold" style="font-size: 0.72rem;">
              <i class="bi bi-person-check-fill me-1"></i> Dr. E. Reynolds, DVM
            </span>
          </div>
          <div class="text-end">
            <span class="badge" style="background: rgba(255, 107, 107, 0.25); border: 1px solid rgba(255,107,107,0.5); font-size: 0.68rem; color: #fff;">
              <i class="bi bi-headset me-1"></i> 24/7 PET911 Dispatch
            </span>
          </div>
        </div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.PetPassport.init();
});
