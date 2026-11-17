
window.ProductsController = {
  products: [],
  filteredProducts: [],
  currentCategory: 'all',
  searchQuery: '',
  sortOrder: 'default',

  async init() {
    await this.loadProducts();
    this.bindFilters();
  },

  async loadProducts() {
    try {
      this.products = await App.fetchJSON('../data/products.json', 'products');
      this.filteredProducts = [...this.products];
      this.render();
    } catch (e) {
      console.error('Error loading products:', e);
      this.products = window.DEFAULT_DATA?.products || [];
      this.filteredProducts = [...this.products];
      this.render();
    }
  },

  bindFilters() {
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.applyFilters();
      });
    }

    const sortSelect = document.getElementById('productSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortOrder = e.target.value;
        this.applyFilters();
      });
    }
  },

  applyFilters() {
    let list = this.products.filter(item => {
      const matchesCat = this.currentCategory === 'all' ||
        item.category.toLowerCase().includes(this.currentCategory.toLowerCase()) ||
        (this.currentCategory === 'Food' && (item.category.includes('Food') || item.category.includes('Diet')));

      const q = this.searchQuery;
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.species && item.species.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });

    if (this.sortOrder === 'low') {
      list.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'high') {
      list.sort((a, b) => b.price - a.price);
    } else if (this.sortOrder === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.sortOrder === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts = list;
    this.render();
  },

  render() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (!this.filteredProducts.length) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="empty-state py-5">
            <i class="bi bi-search fs-1 d-block mb-2 text-peach"></i>
            <h4>No matching pet essentials found</h4>
            <p class="small text-muted mb-0">Try clearing your search keyword or switching category.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredProducts.map(p => `
      <div class="col-md-6 col-lg-4 reveal visible">
        <div class="product-card">
          <div class="position-relative">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'">
            ${p.badge ? `<span class="badge position-absolute top-0 start-0 m-3" style="background: var(--peach); color: #fff;">${p.badge}</span>` : ''}
            ${p.species ? `<span class="badge position-absolute top-0 end-0 m-3" style="background: var(--dark); color: #fff;">${p.species}</span>` : ''}
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="small text-muted fw-semibold">${p.category}</span>
              <span class="small text-warning">
                <i class="bi bi-star-fill"></i> <strong>${p.rating || '4.8'}</strong> <small class="text-muted">(${p.reviewsCount || 100}+)</small>
              </span>
            </div>
            <h3 class="h6 fw-bold text-brown mb-2" style="min-height: 40px;">${App.escape(p.name)}</h3>
            <p class="small text-muted mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${App.escape(p.description)}
            </p>
            <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
              <span class="price">$${p.price.toFixed(2)}</span>
              <button class="btn btn-peach btn-sm px-3 btn-buy-item" data-id="${p.id}" data-name="${App.escape(p.name)}" data-price="${p.price}">
                <i class="bi bi-bag-plus-fill me-1"></i> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-buy-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price)
        };
        App.addToCart(item);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ProductsController.init();
});
