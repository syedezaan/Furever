
window.AppState = {
  cart: JSON.parse(localStorage.getItem('furever_cart') || '[]'),
  adoptionInterests: JSON.parse(localStorage.getItem('furever_adoptions') || '[]'),
  visitorCount: 12584,
  currentUser: {
    name: sessionStorage.getItem('fureverFirstName') || 'Sarah Jenkins',
    role: 'owner'
  }
};

const App = {
  
  toast(message, title = 'FurEver Care Alert', type = 'success', icon = 'bi-bell') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center border-0 shadow-lg mb-2`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    let bgClass = 'text-bg-success';
    let iconClass = icon;
    if (type === 'error' || type === 'danger') {
      bgClass = 'text-bg-danger';
      iconClass = 'bi-exclamation-triangle-fill';
    } else if (type === 'warning') {
      bgClass = 'text-bg-warning';
      iconClass = 'bi-exclamation-circle-fill';
    } else if (type === 'info') {
      bgClass = 'text-bg-primary';
      iconClass = 'bi-info-circle-fill';
    }

    toastEl.classList.add(bgClass);

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${iconClass} fs-5"></i>
          <div>
            ${title ? `<strong class="d-block" style="font-size: 0.85rem;">${title}</strong>` : ''}
            <span style="font-size: 0.82rem;">${message}</span>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  },

  
  confetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.65 }
      });
    }
  },

  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  },

  
  async fetchJSON(path, fallbackKey) {
    try {
      const response = await fetch(path);
      if (response && response.ok) {
        const data = await response.json();
        if (data) return data;
      }
    } catch (e) {
      console.info(`[FurEverCare] Fetch failed for "${path}" (file protocol or offline). Loading fallback dataset.`);
    }

    
    if (fallbackKey && window.DEFAULT_DATA && window.DEFAULT_DATA[fallbackKey]) {
      return window.DEFAULT_DATA[fallbackKey];
    }

    
    const lower = path.toLowerCase();
    if (lower.includes('product')) return window.DEFAULT_DATA?.products || [];
    if (lower.includes('emergency')) return window.DEFAULT_DATA?.emergency || [];
    if (lower.includes('adoption') || lower.includes('pets')) return window.DEFAULT_DATA?.pets || [];
    if (lower.includes('medical') || lower.includes('records')) return window.DEFAULT_DATA?.medicalRecords || [];
    if (lower.includes('appointment')) return window.DEFAULT_DATA?.appointments || [];
    if (lower.includes('vet')) return window.DEFAULT_DATA?.vets || [];
    if (lower.includes('event')) return window.DEFAULT_DATA?.events || [];
    if (lower.includes('story') || lower.includes('success')) return window.DEFAULT_DATA?.successStories || [];
    if (lower.includes('health') || lower.includes('tip')) return window.DEFAULT_DATA?.healthTips || [];

    return [];
  },

  validateForm(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach(i => {
      if (!i.value.trim()) {
        i.classList.add('is-invalid');
        ok = false;
      } else {
        i.classList.remove('is-invalid');
      }
    });
    form.querySelectorAll('input[type="email"]').forEach(i => {
      if (i.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)) {
        i.classList.add('is-invalid');
        ok = false;
      }
    });
    return ok;
  },

  
  addToCart(item) {
    if (!item) return;
    window.AppState.cart.push(item);
    localStorage.setItem('furever_cart', JSON.stringify(window.AppState.cart));
    this.updateCartBadge();
    this.toast(`Added "${item.name}" to your care cart!`, 'Cart Updated', 'success', 'bi-bag-check-fill');
    this.confetti();
  },

  saveAdoptionInterest(pet) {
    if (!pet) return;
    const exists = window.AppState.adoptionInterests.some(p => p.id === pet.id);
    if (!exists) {
      window.AppState.adoptionInterests.push(pet);
      localStorage.setItem('furever_adoptions', JSON.stringify(window.AppState.adoptionInterests));
    }
    this.updateCartBadge();
    this.toast(`Adoption interest for ${pet.name} saved in My Care!`, 'Adoption Saved', 'success', 'bi-heart-fill');
    this.confetti();
  },

  updateCartBadge() {
    const totalCount = (window.AppState.cart.length || 0) + (window.AppState.adoptionInterests.length || 0);
    document.querySelectorAll('.cart-badge-count').forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    });
  },

  renderCartModal() {
    let modalEl = document.getElementById('cartModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'cartModal';
      modalEl.className = 'modal fade';
      modalEl.setAttribute('tabindex', '-1');
      modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border-radius: 20px; border: 1px solid var(--light);">
            <div class="modal-header border-bottom">
              <h5 class="modal-title fw-bold text-brown">
                <i class="bi bi-bag-heart-fill text-peach me-2"></i> My Care Basket
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div id="cartModalItems" class="mb-3"></div>
              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <span class="fw-bold">Supplies Total:</span>
                <span class="h4 fw-bold mb-0 text-peach" id="cartModalTotal">$0.00</span>
              </div>
            </div>
            <div class="modal-footer border-top">
              <button type="button" class="btn btn-outline-peach btn-sm" data-bs-dismiss="modal">Keep Browsing</button>
              <button type="button" class="btn btn-peach btn-sm" id="btnCartCheckout">
                <i class="bi bi-lock-fill me-1"></i> Checkout Now
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);

      
      modalEl.querySelector('#btnCartCheckout')?.addEventListener('click', () => {
        if (!window.AppState.cart.length) {
          App.toast('Your supply basket is empty. Add some pet essentials first!', 'Basket Empty', 'warning');
          return;
        }
        bootstrap.Modal.getInstance(modalEl)?.hide();
        App.openCheckoutWizard();
      });
    }

    const itemsContainer = document.getElementById('cartModalItems');
    const totalContainer = document.getElementById('cartModalTotal');
    if (!itemsContainer || !totalContainer) return;

    let total = 0;
    const cart = window.AppState.cart || [];
    const adoptions = window.AppState.adoptionInterests || [];

    if (!cart.length && !adoptions.length) {
      itemsContainer.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-bag-x fs-1 d-block mb-2 text-peach"></i>
          <strong>Your basket is empty</strong>
          <p class="small mb-0">Explore pet essentials or meet an adoptable friend.</p>
        </div>
      `;
      totalContainer.textContent = '$0.00';
      return;
    }

    let html = '';
    if (cart.length) {
      html += cart.map((item, idx) => {
        const p = parseFloat(item.price) || 0;
        total += p;
        return `
          <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
              <strong class="d-block text-brown" style="font-size: 0.9rem;">${App.escape(item.name)}</strong>
              <small class="text-muted">Standard 2-Day Dispatch</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-peach">$${p.toFixed(2)}</span>
              <button class="btn btn-sm text-danger p-0 ms-1 btn-remove-cart" data-index="${idx}" title="Remove item">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (adoptions.length) {
      html += `
        <div class="mt-3 pt-2 border-top">
          <small class="fw-bold text-peach d-block mb-2"><i class="bi bi-heart-fill me-1"></i> Saved Adoption Applications</small>
          ${adoptions.map((pet, idx) => `
            <div class="d-flex align-items-center justify-content-between py-1 small">
              <span><strong>${App.escape(pet.name)}</strong> (${App.escape(pet.breed || pet.type || 'Pet')})</span>
              <div class="d-flex align-items-center gap-2">
                <span class="badge badge-soft">Application Ready</span>
                <button class="btn btn-sm text-danger p-0 ms-1 btn-remove-adoption" data-index="${idx}" title="Remove application">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    itemsContainer.innerHTML = html;
    totalContainer.textContent = `$${total.toFixed(2)}`;

    
    itemsContainer.querySelectorAll('.btn-remove-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        window.AppState.cart.splice(idx, 1);
        localStorage.setItem('furever_cart', JSON.stringify(window.AppState.cart));
        App.updateCartBadge();
        App.renderCartModal();
      });
    });

    itemsContainer.querySelectorAll('.btn-remove-adoption').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        window.AppState.adoptionInterests.splice(idx, 1);
        localStorage.setItem('furever_adoptions', JSON.stringify(window.AppState.adoptionInterests));
        App.updateCartBadge();
        App.renderCartModal();
      });
    });

    
    const checkoutBtn = document.getElementById('btnCheckoutCart');
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        const cartModalEl = document.getElementById('cartModal');
        if (cartModalEl) bootstrap.Modal.getInstance(cartModalEl)?.hide();
        App.openCheckoutWizard();
      };
    }
  },

  
  
  // ===================== CHECKOUT WIZARD (Cart -> Details -> Payment -> Confirmation) =====================
  checkoutWizard: {
    step: 1,
    details: { fullName: '', phone: '', email: '', city: '', address: '' },
    payMethod: 'card',
    card: { holder: '', number: '', expiry: '', cvv: '' },
    orderSnapshot: null
  },

  openCheckoutWizard() {
    if (!window.AppState.cart.length) {
      App.toast('Your care cart is currently empty.', 'Cart Empty', 'warning');
      return;
    }

    // Reset wizard state fresh every time it's opened
    App.checkoutWizard = {
      step: 1,
      details: {
        fullName: window.AppState.currentUser?.name || '',
        phone: '',
        email: '',
        city: '',
        address: ''
      },
      payMethod: 'card',
      card: { holder: '', number: '', expiry: '', cvv: '' },
      orderSnapshot: null
    };

    let modalEl = document.getElementById('checkoutWizardModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'checkoutWizardModal';
      modalEl.className = 'modal fade';
      modalEl.setAttribute('tabindex', '-1');
      modalEl.setAttribute('data-bs-backdrop', 'static');
      document.body.appendChild(modalEl);
    }

    App.renderCheckoutWizard();

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  },

  checkoutStepMeta() {
    return [
      { id: 1, label: 'Cart', icon: 'bi-bag-heart-fill' },
      { id: 2, label: 'Details', icon: 'bi-person-vcard-fill' },
      { id: 3, label: 'Payment', icon: 'bi-credit-card-2-front-fill' },
      { id: 4, label: 'Confirmation', icon: 'bi-patch-check-fill' }
    ];
  },

  renderStepIndicator(current) {
    const steps = App.checkoutStepMeta();
    return `
      <div class="checkout-stepper d-flex align-items-center justify-content-between mb-4">
        ${steps.map((s, idx) => `
          <div class="checkout-step-item d-flex align-items-center ${idx < steps.length - 1 ? 'flex-grow-1' : ''}">
            <div class="text-center">
              <div class="checkout-step-circle ${current === s.id ? 'is-active' : ''} ${current > s.id ? 'is-done' : ''}">
                ${current > s.id ? '<i class="bi bi-check-lg"></i>' : s.id}
              </div>
              <small class="d-block mt-1 fw-semibold ${current === s.id ? 'text-peach' : 'text-muted'}" style="font-size: 0.72rem;">${s.label}</small>
            </div>
            ${idx < steps.length - 1 ? `<div class="checkout-step-line ${current > s.id ? 'is-done' : ''}"></div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderOrderSummaryPanel(itemsOverride) {
    const cart = itemsOverride || window.AppState.cart || [];
    const subtotal = cart.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
    return `
      <div class="p-3 rounded-3 border checkout-summary-box">
        <h6 class="fw-bold text-brown mb-3"><i class="bi bi-receipt me-1"></i> Order Summary</h6>
        <div style="max-height: 180px; overflow-y: auto;" class="mb-2">
          ${cart.length ? cart.map(item => `
            <div class="d-flex justify-content-between align-items-center py-1 small border-bottom">
              <span class="text-truncate me-2">${App.escape(item.name)}</span>
              <span class="fw-bold text-peach text-nowrap">$${(parseFloat(item.price) || 0).toFixed(2)}</span>
            </div>
          `).join('') : '<small class="text-muted">No items</small>'}
        </div>
        <div class="d-flex justify-content-between small text-muted mb-1">
          <span>Items:</span><span>${cart.length}</span>
        </div>
        <div class="d-flex justify-content-between small text-muted mb-1">
          <span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between small text-muted mb-2">
          <span>Delivery:</span><span class="text-success fw-bold">FREE</span>
        </div>
        <hr class="my-2">
        <div class="d-flex justify-content-between fw-bold text-brown fs-6">
          <span>Total:</span><span class="text-peach">$${subtotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  },

  renderCheckoutWizard() {
    const modalEl = document.getElementById('checkoutWizardModal');
    if (!modalEl) return;
    const wiz = App.checkoutWizard;

    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content" style="border-radius: 24px; border: 1px solid var(--light);">
          <div class="modal-header border-bottom">
            <h5 class="modal-title fw-bold text-brown">
              <i class="bi bi-bag-heart-fill text-peach me-2"></i> FurEver Care Checkout
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            ${App.renderStepIndicator(wiz.step)}
            <div class="row g-4">
              <div class="col-lg-7" id="checkoutStepContent"></div>
              <div class="col-lg-5" id="checkoutSummaryPanel"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    App.renderCheckoutStepContent();
  },

  renderCheckoutStepContent() {
    const wiz = App.checkoutWizard;
    const stepContainer = document.getElementById('checkoutStepContent');
    const summaryContainer = document.getElementById('checkoutSummaryPanel');
    if (!stepContainer) return;

    if (wiz.step === 4) {
      summaryContainer.innerHTML = '';
      stepContainer.className = 'col-12';
      stepContainer.innerHTML = App.renderConfirmationStep();
      App.bindConfirmationStep();
      return;
    }

    stepContainer.className = 'col-lg-7';
    summaryContainer.innerHTML = App.renderOrderSummaryPanel();

    if (wiz.step === 1) {
      stepContainer.innerHTML = App.renderCartStep();
      App.bindCartStep();
    } else if (wiz.step === 2) {
      stepContainer.innerHTML = App.renderDetailsStep();
      App.bindDetailsStep();
    } else if (wiz.step === 3) {
      stepContainer.innerHTML = App.renderPaymentStep();
      App.bindPaymentStep();
    }
  },

  
  renderCartStep() {
    const cart = window.AppState.cart || [];
    if (!cart.length) {
      return `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-bag-x fs-1 d-block mb-2 text-peach"></i>
          <strong>Your basket is empty</strong>
        </div>
        <button type="button" class="btn btn-outline-peach w-100" data-bs-dismiss="modal">Keep Browsing</button>
      `;
    }

    return `
      <h6 class="fw-bold text-brown mb-3"><i class="bi bi-bag-heart-fill me-1"></i> Your Care Basket</h6>
      <div id="wizardCartItems" class="mb-3">
        ${cart.map((item, idx) => `
          <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
              <strong class="d-block text-brown" style="font-size: 0.9rem;">${App.escape(item.name)}</strong>
              <small class="text-muted">Standard 2-Day Dispatch</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-peach">$${(parseFloat(item.price) || 0).toFixed(2)}</span>
              <button class="btn btn-sm text-danger p-0 ms-1 btn-wizard-remove" data-index="${idx}" title="Remove item">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="d-flex gap-2 mt-4">
        <button type="button" class="btn btn-outline-peach" data-bs-dismiss="modal">Keep Browsing</button>
        <button type="button" class="btn btn-peach flex-grow-1" id="btnGoToDetails">
          Continue to Details <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    `;
  },

  bindCartStep() {
    document.querySelectorAll('.btn-wizard-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        window.AppState.cart.splice(idx, 1);
        localStorage.setItem('furever_cart', JSON.stringify(window.AppState.cart));
        App.updateCartBadge();
        if (!window.AppState.cart.length) {
          bootstrap.Modal.getInstance(document.getElementById('checkoutWizardModal'))?.hide();
          App.toast('Your care cart is currently empty.', 'Cart Empty', 'warning');
          return;
        }
        App.renderCheckoutStepContent();
      });
    });

    document.getElementById('btnGoToDetails')?.addEventListener('click', () => {
      if (!window.AppState.cart.length) return;
      App.checkoutWizard.step = 2;
      App.renderCheckoutWizard();
    });
  },

  
  renderDetailsStep() {
    const d = App.checkoutWizard.details;
    return `
      <h6 class="fw-bold text-brown mb-3"><i class="bi bi-person-vcard-fill me-1"></i> Customer Details</h6>
      <form id="wizardDetailsForm">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-bold">Full Name *</label>
            <input type="text" class="form-control" id="dtFullName" placeholder="Enter your full name" required value="${App.escape(d.fullName)}">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Contact Number *</label>
            <input type="tel" class="form-control" id="dtPhone" placeholder="+92 300 0000000" required value="${App.escape(d.phone)}">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Email Address *</label>
            <input type="email" class="form-control" id="dtEmail" placeholder="you@example.com" required value="${App.escape(d.email)}">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">City *</label>
            <input type="text" class="form-control" id="dtCity" placeholder="Karachi" required value="${App.escape(d.city)}">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Delivery Address *</label>
            <textarea class="form-control" id="dtAddress" rows="3" placeholder="House number, street, area, city" required>${App.escape(d.address)}</textarea>
          </div>
        </div>
        <div class="d-flex gap-2 mt-4">
          <button type="button" class="btn btn-outline-peach" id="btnBackToCart">Back to Cart</button>
          <button type="submit" class="btn btn-peach flex-grow-1">
            Continue to Payment <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </form>
    `;
  },

  bindDetailsStep() {
    document.getElementById('btnBackToCart')?.addEventListener('click', () => {
      App.checkoutWizard.step = 1;
      App.renderCheckoutWizard();
    });

    document.getElementById('wizardDetailsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      if (!App.validateForm(form)) {
        App.toast('Please fill in all required fields correctly.', 'Missing Details', 'warning');
        return;
      }
      App.checkoutWizard.details = {
        fullName: document.getElementById('dtFullName').value.trim(),
        phone: document.getElementById('dtPhone').value.trim(),
        email: document.getElementById('dtEmail').value.trim(),
        city: document.getElementById('dtCity').value.trim(),
        address: document.getElementById('dtAddress').value.trim()
      };
      App.checkoutWizard.step = 3;
      App.renderCheckoutWizard();
    });
  },

  
  renderPaymentStep() {
    const wiz = App.checkoutWizard;
    const methods = [
      { id: 'card', label: 'Card', icon: 'bi-credit-card-2-front-fill' },
      { id: 'cod', label: 'Cash on Delivery', icon: 'bi-cash-coin' },
      { id: 'bank', label: 'Bank Transfer', icon: 'bi-bank' }
    ];

    let fieldsHtml = '';
    if (wiz.payMethod === 'card') {
      fieldsHtml = `
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label small fw-bold">Card Holder Name</label>
            <input type="text" class="form-control" id="pmCardHolder" placeholder="Name on card" value="${App.escape(wiz.card.holder)}">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Card Number</label>
            <input type="text" class="form-control" id="pmCardNumber" placeholder="1234 5678 9012 3456" maxlength="19" value="${App.escape(wiz.card.number)}">
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold">Expiry Date</label>
            <input type="text" class="form-control" id="pmCardExpiry" placeholder="MM/YY" maxlength="5" value="${App.escape(wiz.card.expiry)}">
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold">CVV</label>
            <input type="password" class="form-control" id="pmCardCvv" placeholder="123" maxlength="4" value="${App.escape(wiz.card.cvv)}">
          </div>
        </div>
      `;
    } else if (wiz.payMethod === 'cod') {
      fieldsHtml = `
        <div class="p-3 bg-light rounded-3 border small">
          <i class="bi bi-info-circle-fill text-peach me-1"></i>
          You'll pay in cash when your pet supplies arrive at your doorstep. Please keep exact change ready for our delivery partner.
        </div>
      `;
    } else if (wiz.payMethod === 'bank') {
      fieldsHtml = `
        <div class="p-3 bg-light rounded-3 border small">
          <i class="bi bi-info-circle-fill text-peach me-1"></i> Transfer the total amount to:
          <div class="mt-2">
            <strong class="d-block text-brown">Account Title:</strong> FurEver Care Pvt Ltd<br>
            <strong class="d-block text-brown mt-1">Account Number:</strong> 1234-5678-9012<br>
            <strong class="d-block text-brown mt-1">Bank:</strong> Meezan Bank, Karachi
          </div>
        </div>
      `;
    }

    return `
      <h6 class="fw-bold text-brown mb-3"><i class="bi bi-credit-card-2-front-fill me-1"></i> Payment Method</h6>
      <div class="row g-2 mb-3">
        ${methods.map(m => `
          <div class="col-4">
            <button type="button" class="btn w-100 py-3 payment-method-tile ${wiz.payMethod === m.id ? 'is-selected' : ''}" data-method="${m.id}">
              <i class="bi ${m.icon} d-block fs-4 mb-1"></i>
              <span class="small fw-bold">${m.label}</span>
            </button>
          </div>
        `).join('')}
      </div>
      <div id="paymentFieldsArea">${fieldsHtml}</div>
      <div class="d-flex gap-2 mt-4">
        <button type="button" class="btn btn-outline-peach" id="btnBackToDetails">Back to Details</button>
        <button type="button" class="btn btn-peach flex-grow-1" id="btnPlaceOrder">
          <i class="bi bi-lock-fill me-1"></i> Place Order
        </button>
      </div>
    `;
  },

  bindPaymentStep() {
    document.querySelectorAll('.payment-method-tile').forEach(btn => {
      btn.addEventListener('click', () => {
        App.checkoutWizard.payMethod = btn.dataset.method;
        const stepContainer = document.getElementById('checkoutStepContent');
        stepContainer.innerHTML = App.renderPaymentStep();
        App.bindPaymentStep();
      });
    });

    document.getElementById('btnBackToDetails')?.addEventListener('click', () => {
      App.checkoutWizard.step = 2;
      App.renderCheckoutWizard();
    });

    document.getElementById('btnPlaceOrder')?.addEventListener('click', () => {
      const wiz = App.checkoutWizard;
      if (wiz.payMethod === 'card') {
        const holder = document.getElementById('pmCardHolder')?.value.trim() || '';
        const number = document.getElementById('pmCardNumber')?.value.trim() || '';
        const expiry = document.getElementById('pmCardExpiry')?.value.trim() || '';
        const cvv = document.getElementById('pmCardCvv')?.value.trim() || '';
        if (!holder || !number || !expiry || !cvv) {
          App.toast('Please fill in all card details to continue.', 'Missing Card Info', 'warning');
          return;
        }
        wiz.card = { holder, number, expiry, cvv };
      }

      
      const cart = window.AppState.cart || [];
      const subtotal = cart.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
      const orderId = 'FC-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      wiz.orderSnapshot = {
        orderId,
        orderDate,
        items: cart.map(i => ({ name: i.name, price: parseFloat(i.price) || 0 })),
        subtotal,
        total: subtotal,
        details: { ...wiz.details },
        payMethod: wiz.payMethod
      };

      
      window.AppState.cart = [];
      localStorage.removeItem('furever_cart');
      App.updateCartBadge();

      wiz.step = 4;
      App.renderCheckoutWizard();
      App.confetti();
    });
  },

  
  renderConfirmationStep() {
    const snap = App.checkoutWizard.orderSnapshot;
    if (!snap) return '<div class="text-center py-5 text-muted">No order found.</div>';

    const payLabel = { card: 'Card', cod: 'Cash on Delivery', bank: 'Bank Transfer' }[snap.payMethod] || snap.payMethod;

    return `
      <div class="text-center py-3">
        <div class="confirm-check-circle mx-auto mb-3">
          <i class="bi bi-check-lg"></i>
        </div>
        <h4 class="fw-bold text-brown mb-1">Order Confirmed</h4>
        <p class="text-muted mb-4">Your FurEver Care order has been placed successfully.</p>

        <div class="text-start p-3 rounded-3 border checkout-summary-box mx-auto" style="max-width: 520px;">
          <div class="small mb-1"><strong class="text-brown">Order ID:</strong> ${App.escape(snap.orderId)}</div>
          <div class="small mb-1"><strong class="text-brown">Name:</strong> ${App.escape(snap.details.fullName)}</div>
          <div class="small mb-1"><strong class="text-brown">Phone:</strong> ${App.escape(snap.details.phone)}</div>
          <div class="small mb-1"><strong class="text-brown">Email:</strong> ${App.escape(snap.details.email)}</div>
          <div class="small mb-2"><strong class="text-brown">Address:</strong> ${App.escape(snap.details.address)}, ${App.escape(snap.details.city)}</div>
          <div class="small mb-3"><strong class="text-brown">Payment:</strong> ${App.escape(payLabel)}</div>
          <hr>
          ${snap.items.map(item => `
            <div class="d-flex justify-content-between small py-1">
              <span>${App.escape(item.name)}</span>
              <span class="fw-bold text-peach">$${item.price.toFixed(2)}</span>
            </div>
          `).join('')}
          <hr>
          <div class="d-flex justify-content-between fw-bold text-brown">
            <span>Total Paid:</span><span class="text-peach">$${snap.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="d-flex gap-2 justify-content-center mt-4">
          <button type="button" class="btn btn-peach" id="btnDownloadReceipt">
            <i class="bi bi-download me-1"></i> Download Receipt
          </button>
          <button type="button" class="btn btn-outline-peach" id="btnBackToStore" data-bs-dismiss="modal">
            Back to Store
          </button>
        </div>
      </div>
    `;
  },

  bindConfirmationStep() {
    document.getElementById('btnDownloadReceipt')?.addEventListener('click', () => {
      const snap = App.checkoutWizard.orderSnapshot;
      if (!snap) return;
      const payLabel = { card: 'Card', cod: 'Cash on Delivery', bank: 'Bank Transfer' }[snap.payMethod] || snap.payMethod;

      const lines = [
        'FurEver Care - Order Receipt',
        '================================',
        `Order ID: ${snap.orderId}`,
        `Date: ${snap.orderDate}`,
        '',
        `Name: ${snap.details.fullName}`,
        `Phone: ${snap.details.phone}`,
        `Email: ${snap.details.email}`,
        `Address: ${snap.details.address}, ${snap.details.city}`,
        `Payment Method: ${payLabel}`,
        '',
        'Items:',
        ...snap.items.map(i => `  - ${i.name} .......... $${i.price.toFixed(2)}`),
        '',
        `Total Paid: $${snap.total.toFixed(2)}`,
        '',
        'Thank you for caring for your beloved companion!'
      ];

      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FurEverCare_Receipt_${snap.orderId}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  },

  
  initTheme() {
    const savedTheme = localStorage.getItem('furever_theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="bi bi-sun-fill text-warning"></i>' 
        : '<i class="bi bi-moon-stars-fill"></i>';

      btn.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('furever_theme', isDark ? 'dark' : 'light');
        document.querySelectorAll('.theme-toggle-btn').forEach(b => {
          b.innerHTML = isDark 
            ? '<i class="bi bi-sun-fill text-warning"></i>' 
            : '<i class="bi bi-moon-stars-fill"></i>';
        });
        App.toast(`Theme switched to ${isDark ? 'Dark Mode' : 'Light Mode'}`, 'Appearance Updated', 'info', isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill');
      };
    });
  },

  
  initSpotlightSearch() {
    
    if (!document.getElementById('spotlightModal')) {
      const modal = document.createElement('div');
      modal.id = 'spotlightModal';
      modal.className = 'modal fade spotlight-backdrop';
      modal.setAttribute('tabindex', '-1');
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content spotlight-card">
            <div class="spotlight-input-wrap">
              <i class="bi bi-search spotlight-input-icon"></i>
              <input type="text" id="spotlightSearchInput" class="spotlight-input" placeholder="Quick Search: Products, Doctors, Pets, Health Tips, or Pages (Ctrl + K)..." autocomplete="off">
            </div>
            <div class="spotlight-results" id="spotlightResultsList">
              <small class="text-muted d-block p-3 text-center">Type keywords above to search across the entire FurEver Care platform...</small>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const input = document.getElementById('spotlightSearchInput');
    const resultsContainer = document.getElementById('spotlightResultsList');

    const doSearch = (query) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `<small class="text-muted d-block p-3 text-center">Type keywords above to search across FurEver Care...</small>`;
        return;
      }

      const products = (window.DEFAULT_DATA?.products || []).filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      const pets = (window.DEFAULT_DATA?.pets || []).filter(p => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
      const tips = (window.DEFAULT_DATA?.healthTips || []).filter(t => t.title.toLowerCase().includes(q) || t.text.toLowerCase().includes(q));

      let html = '';

      if (products.length) {
        html += `<small class="fw-bold text-peach text-uppercase d-block px-2 mb-1" style="font-size: 0.72rem;">🛍️ Products (${products.length})</small>`;
        html += products.slice(0, 3).map(p => `
          <a href="${location.pathname.includes('/pages/') ? 'products.html' : 'pages/products.html'}" class="spotlight-item">
            <img src="${p.image}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 6px;">
            <div class="flex-grow-1">
              <strong class="d-block small text-brown">${App.escape(p.name)}</strong>
              <small class="text-muted">${App.escape(p.category)} • $${p.price.toFixed(2)}</small>
            </div>
            <span class="badge badge-soft">Shop</span>
          </a>
        `).join('');
      }

      if (pets.length) {
        html += `<small class="fw-bold text-peach text-uppercase d-block px-2 mt-2 mb-1" style="font-size: 0.72rem;">🐾 Adoptable Companions (${pets.length})</small>`;
        html += pets.slice(0, 3).map(p => `
          <a href="${location.pathname.includes('/pages/') ? 'shelter.html' : 'pages/shelter.html'}" class="spotlight-item">
            <img src="${p.image}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 6px;">
            <div class="flex-grow-1">
              <strong class="d-block small text-brown">${App.escape(p.name)} (${App.escape(p.breed)})</strong>
              <small class="text-muted">${p.age} • ${p.gender} • ${p.city || 'Karachi'}</small>
            </div>
            <span class="badge badge-soft">Adopt</span>
          </a>
        `).join('');
      }

      if (tips.length) {
        html += `<small class="fw-bold text-peach text-uppercase d-block px-2 mt-2 mb-1" style="font-size: 0.72rem;">🩺 Health & Care Tips (${tips.length})</small>`;
        html += tips.slice(0, 3).map(t => `
          <a href="${location.pathname.includes('/pages/') ? 'pet-care.html' : 'pages/pet-care.html'}" class="spotlight-item">
            <i class="bi ${t.icon || 'bi-heart-pulse-fill'} text-peach fs-5"></i>
            <div class="flex-grow-1">
              <strong class="d-block small text-brown">${App.escape(t.title)}</strong>
              <small class="text-muted text-truncate d-block" style="max-width: 450px;">${App.escape(t.text)}</small>
            </div>
          </a>
        `).join('');
      }

      if (!products.length && !pets.length && !tips.length) {
        html = `<div class="p-4 text-center text-muted small"><i class="bi bi-search fs-4 d-block mb-2"></i>No direct match found for "${App.escape(query)}". Try searching for "Food", "Dog", "Vaccine", or "Cat".</div>`;
      }

      resultsContainer.innerHTML = html;
    };

    input?.addEventListener('input', (e) => doSearch(e.target.value));

    // Keyboard shortcut Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const modalEl = document.getElementById('spotlightModal');
        if (modalEl) {
          const bsModal = new bootstrap.Modal(modalEl);
          bsModal.show();
          setTimeout(() => input?.focus(), 300);
        }
      }
    });

    // Trigger buttons
    document.querySelectorAll('.btn-spotlight-search').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalEl = document.getElementById('spotlightModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
          setTimeout(() => input?.focus(), 300);
        }
      });
    });
  }
};

window.App = App;

// Global Init on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations
  document.querySelectorAll('.reveal').forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 70));

  // Theme Controller
  App.initTheme();

  // Spotlight Search
  App.initSpotlightSearch();

  // Scroll to Top Button
  const top = document.querySelector('#topBtn');
  if (top) {
    addEventListener('scroll', () => top.classList.toggle('show', scrollY > 450));
    top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Role Pathway Selector on Home
  document.querySelectorAll('.role-btn').forEach(b => {
    b.onclick = () => {
      const role = b.closest('.role-card').dataset.role;
      const area = document.querySelector('#roleArea');
      const data = {
        owner: ['Pet Owner', 'Create digital pet passport, nutrition & care resources.', 'pages/pet-owner.html'],
        vet: ['Veterinarian', 'View professional tools, appointments and dosage tools.', 'pages/veterinarian.html'],
        shelter: ['Animal Shelter', 'Explore adoption listings, events and donation drives.', 'pages/shelter.html']
      }[role];
      if (area && data) {
        area.innerHTML = `
          <div class="role-panel text-center reveal visible">
            <h3>${data[0]} pathway selected</h3>
            <p>${data[1]}</p>
            <a class="btn btn-peach" href="${data[2]}">Open ${data[0]} Portal <i class="bi bi-arrow-right"></i></a>
          </div>
        `;
        area.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  });

  
  const counterEl = document.getElementById('visitorCounter');
  if (counterEl) {
    counterEl.textContent = window.AppState.visitorCount.toLocaleString();
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      window.AppState.visitorCount = Math.max(12000, window.AppState.visitorCount + delta);
      counterEl.textContent = window.AppState.visitorCount.toLocaleString();
    }, 6000);
  }

  
  App.updateCartBadge();

  
  document.querySelectorAll('.btn-view-cart, #btnViewCart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      App.renderCartModal();
      const modalEl = document.getElementById('cartModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    });
  });
});

