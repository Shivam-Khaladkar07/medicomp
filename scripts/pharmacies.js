const mockPharmacies = [
  {
    id: 1,
    name: "MedPlus Pharmacy",
    logo: "https://images.unsplash.com/photo-1585435557343-3b092031ee4b?w=100&h=100&fit=crop&crop=center",
    type: "retail",
    location: "mumbai",
    address: "Multiple locations across Mumbai",
    phone: "+91-9876543210",
    rating: 4.5,
    reviewCount: 1250,
    features: ["Home Delivery", "24/7 Service", "Insurance Accepted"],
    website: "https://www.medplus.in",
    description: "Leading pharmacy chain with competitive prices and excellent service."
  },
  {
    id: 2,
    name: "Apollo Pharmacy",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center",
    type: "retail",
    location: "delhi",
    address: "Pan India presence",
    phone: "+91-1800-123-1000",
    rating: 4.3,
    reviewCount: 2100,
    features: ["Express Delivery", "Online Consultation", "Health Checkups"],
    website: "https://www.apollopharmacy.in",
    description: "Trusted healthcare partner with wide range of medicines and health products."
  },
  {
    id: 3,
    name: "Netmeds",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center",
    type: "online",
    location: "bangalore",
    address: "Online nationwide delivery",
    phone: "+91-1800-123-2000",
    rating: 4.2,
    reviewCount: 3500,
    features: ["Online Only", "Prescription Upload", "Cash on Delivery"],
    website: "https://www.netmeds.com",
    description: "India's leading online pharmacy with doorstep delivery across the country."
  },
  {
    id: 4,
    name: "PharmEasy",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=center",
    type: "online",
    location: "mumbai",
    address: "Online pharmacy platform",
    phone: "+91-1800-123-3000",
    rating: 4.4,
    reviewCount: 4200,
    features: ["Lab Tests", "Digital Prescriptions", "Health Articles"],
    website: "https://www.pharmeasy.in",
    description: "Complete healthcare platform offering medicines, lab tests, and consultations."
  },
  {
    id: 5,
    name: "1mg",
    logo: "https://images.unsplash.com/photo-1586880244386-8b3345c7b456?w=100&h=100&fit=crop&crop=center",
    type: "online",
    location: "delhi",
    address: "Online medicine delivery",
    phone: "+91-1800-123-4000",
    rating: 4.1,
    reviewCount: 2800,
    features: ["Medicine Reminder", "Health Tips", "Doctor Consultation"],
    website: "https://www.1mg.com",
    description: "Your trusted health companion with comprehensive healthcare solutions."
  },
  {
    id: 6,
    name: "Wellness Forever",
    logo: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop&crop=center",
    type: "retail",
    location: "mumbai",
    address: "Maharashtra and Gujarat",
    phone: "+91-9876543211",
    rating: 4.3,
    reviewCount: 890,
    features: ["Health Screening", "Wellness Products", "Expert Advice"],
    website: "https://www.wellnessforever.in",
    description: "Your neighborhood pharmacy focusing on wellness and preventive healthcare."
  }
];

let filteredPharmacies = [...mockPharmacies];

export function initPharmacies() {
  const locationFilter = document.getElementById('location-filter');
  const typeFilter = document.getElementById('type-filter');
  const pharmaciesGrid = document.getElementById('pharmacies-grid');
  const countNumber = document.getElementById('pharmacy-count-number');

  // Render pharmacies
  function renderPharmacies() {
    if (!pharmaciesGrid) return;

    pharmaciesGrid.innerHTML = filteredPharmacies.map(pharmacy => `
      <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6" data-id="pharmacy-${pharmacy.id}">
        <div class="flex items-start space-x-4 mb-4">
          <img src="${pharmacy.logo}" alt="${pharmacy.name}" class="w-16 h-16 rounded-full">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-1">${pharmacy.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${pharmacy.address}</p>
            <div class="flex items-center space-x-4 text-sm">
              <div class="flex items-center space-x-1">
                <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                <span class="font-medium">${pharmacy.rating}</span>
                <span class="text-gray-500">(${pharmacy.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-gray-600 mb-4">${pharmacy.description}</p>

        <div class="mb-4">
          <h4 class="font-medium text-gray-900 mb-2">Features:</h4>
          <div class="flex flex-wrap gap-2">
            ${pharmacy.features.map(feature => `
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${feature}</span>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <i data-lucide="phone" class="w-4 h-4"></i>
              <span>${pharmacy.phone}</span>
            </div>
          </div>
          <a href="${pharmacy.website}" target="_blank" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Visit Store
          </a>
        </div>
      </div>
    `).join('');

    if (countNumber) {
      countNumber.textContent = filteredPharmacies.length;
    }

    // Re-initialize icons
    lucide.createIcons();
  }

  // Filter pharmacies
  function filterPharmacies() {
    const location = locationFilter?.value || '';
    const type = typeFilter?.value || '';

    filteredPharmacies = mockPharmacies.filter(pharmacy => {
      const matchesLocation = !location || pharmacy.location === location;
      const matchesType = !type || pharmacy.type === type;
      return matchesLocation && matchesType;
    });

    renderPharmacies();
  }

  // Event listeners
  if (locationFilter) {
    locationFilter.addEventListener('change', filterPharmacies);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', filterPharmacies);
  }

  // Initial render
  renderPharmacies();
}