import { DatabaseService } from './database/db_service.js';

export function initSearch() {
  const searchInput = document.getElementById('medicine-search');
  const searchBtn = document.getElementById('search-btn');
  const resultsSection = document.getElementById('results-section');
  const resultsContainer = document.getElementById('medicine-results');
  const resultsTitle = document.querySelector('[data-id="results-title"]');
  const sortSelect = document.getElementById('sort-select');

  // Initialize database service only
  const dbService = new DatabaseService();
  console.log('Database service initialized:', dbService);

  if (!searchInput || !searchBtn || !resultsSection) return;

  // Search functionality
  async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    console.log('Performing search for:', query);

    // Show results section
    resultsSection.classList.remove('hidden');
    resultsTitle.textContent = `Results for "${query}"`;

    // Show loading state
    resultsContainer.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p class="mt-4 text-gray-600">Searching medicines...</p></div>';

    try {
      // Search medicines with prices from database
      console.log('Calling searchMedicinesWithPrices...');
      const results = await dbService.searchMedicinesWithPrices(query);
      console.log('Search results received:', results);
      displayResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      resultsContainer.innerHTML = '<div class="text-center py-8 text-red-600">Search failed. Please try again.</div>';
    }

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Display search results
  function displayResults(results) {
    if (!resultsContainer) return;

    console.log('Displaying search results:', results);

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <i data-lucide="search" class="w-16 h-16 mx-auto"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No medicines found</h3>
          <p class="text-gray-600">Try searching with different keywords or check the spelling.</p>
        </div>
      `;
      return;
    }

    // Log the first result to see the data structure
    if (results.length > 0) {
      console.log('First result structure:', results[0]);
      console.log('First result prices:', results[0].prices);
    }

    resultsContainer.innerHTML = results.map(medicine => `
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow" data-id="result-${medicine.id}">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">${medicine.name}</h3>
            <p class="text-gray-600">${medicine.generic_name} • ${medicine.strength} • ${medicine.dosage_form}</p>
            <p class="text-sm text-gray-500">${medicine.manufacturer} • ${medicine.category}</p>
            ${medicine.prescription_required ? '<span class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">Prescription Required</span>' : ''}
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">₹${medicine.bestPrice}</div>
            <div class="text-sm text-gray-500">Best price</div>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-medium text-gray-900 mb-3">Available at:</h4>
          <div class="space-y-2">
            ${medicine.prices.map(price => `
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i data-lucide="building-2" class="w-4 h-4 text-blue-600"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">${price.pharmacy.name}</div>
                    <div class="text-sm text-gray-500">${price.pharmacy.city} • ${price.pharmacy.rating}★ • ${price.quantity} ${price.unit}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">₹${price.price}</div>
                  <div class="flex items-center space-x-2 mt-1">
                    <button class="add-to-cart-btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors" 
                            data-medicine='${JSON.stringify(medicine)}' 
                            data-pharmacy='${JSON.stringify(price.pharmacy)}' 
                            data-price='${price.price}'>
                      <i data-lucide="shopping-cart" class="w-3 h-3 mr-1"></i>
                      Add to Cart
                    </button>
                    <a href="pharmacy-detail.html?name=${encodeURIComponent(price.pharmacy.name)}&price=${price.price}&distance=2.1&rating=${price.pharmacy.rating}" class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-all duration-200">
                      View Store →
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Category: ${medicine.category}</span>
            <span>Form: ${medicine.dosage_form}</span>
          </div>
        </div>
      </div>
    `);

    // Initialize icons after rendering
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Event listeners
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  console.log('Search event listeners attached');

  // Handle pharmacy navigation
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href*="pharmacy-detail.html"]')) {
      e.preventDefault();
      const link = e.target.closest('a');
      const url = link.getAttribute('href');
      
      // Navigate to pharmacy detail page
      window.location.href = url;
    }
  });

  // Handle add to cart functionality
  document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
      console.log('Add to cart button clicked!');
      const btn = e.target.closest('.add-to-cart-btn');
      const medicine = JSON.parse(btn.dataset.medicine);
      const pharmacy = JSON.parse(btn.dataset.pharmacy);
      const price = parseFloat(btn.dataset.price);
      
      console.log('Parsed data:', { medicine, pharmacy, price });
      
      // Add to cart using global cart service
      if (window.cartService) {
        console.log('Cart service found, adding to cart...');
        window.cartService.addToCart(medicine, pharmacy, price);
        
        // Update button state
        btn.innerHTML = '<i data-lucide="check" class="w-3 h-3 mr-1"></i>Added!';
        btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        btn.disabled = true;
        
        // Reinitialize icons
        if (window.lucide) {
          lucide.createIcons();
        }
      } else {
        console.error('Cart service not available');
        alert('Cart service not available. Please refresh the page.');
      }
    }
  });

  console.log('Add to cart event listener attached');

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      // Here you would implement sorting logic
      console.log('Sorting by:', sortBy);
    });
  }
}