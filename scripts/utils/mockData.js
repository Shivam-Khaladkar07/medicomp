// Mock data for demonstration purposes
const pharmacyLogos = [
  'https://images.unsplash.com/photo-1585435557343-3b092031ee4b?w=100&h=100&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1586880244386-8b3345c7b456?w=100&h=100&fit=crop&crop=center'
];

const pharmacyNames = [
  'MedPlus Pharmacy',
  'Apollo Pharmacy',
  'Netmeds Online',
  'PharmEasy',
  '1mg Store',
  'Wellness Forever',
  'Guardian Pharmacy',
  'HealthKart Pharmacy'
];

export function generateMockResults(query) {
  // Mock medicine database
  const medicines = {
    'paracetamol': {
      name: 'Paracetamol 500mg',
      generic: 'Acetaminophen',
      strength: '500mg Tablets',
      manufacturer: 'Cipla Ltd'
    },
    'aspirin': {
      name: 'Aspirin 75mg',
      generic: 'Acetylsalicylic Acid',
      strength: '75mg Tablets',
      manufacturer: 'Bayer Healthcare'
    },
    'ibuprofen': {
      name: 'Ibuprofen 400mg',
      generic: 'Ibuprofen',
      strength: '400mg Tablets',
      manufacturer: 'Sun Pharma'
    },
    'amoxicillin': {
      name: 'Amoxicillin 500mg',
      generic: 'Amoxicillin',
      strength: '500mg Capsules',
      manufacturer: 'Aurobindo Pharma'
    },
    'metformin': {
      name: 'Metformin 500mg',
      generic: 'Metformin HCl',
      strength: '500mg Tablets',
      manufacturer: 'Dr. Reddy\'s'
    },
    'omeprazole': {
      name: 'Omeprazole 20mg',
      generic: 'Omeprazole',
      strength: '20mg Capsules',
      manufacturer: 'Ranbaxy'
    }
  };

  const queryLower = query.toLowerCase();
  const medicine = medicines[queryLower] || {
    name: `${query} 500mg`,
    generic: query,
    strength: '500mg Tablets',
    manufacturer: 'Generic Manufacturer'
  };

  // Generate 1-3 results
  const numResults = Math.floor(Math.random() * 3) + 1;
  const results = [];

  for (let i = 0; i < numResults; i++) {
    const basePrice = 50 + Math.random() * 200;
    const pharmacies = generatePharmacyPrices(basePrice);
    const bestPrice = Math.min(...pharmacies.map(p => p.price));

    results.push({
      id: `${queryLower}-${i}`,
      name: medicine.name + (i > 0 ? ` (${i + 1}0 tablets)` : ' (10 tablets)'),
      generic: medicine.generic,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
      bestPrice: bestPrice.toFixed(2),
      pharmacies: pharmacies,
      inStock: Math.random() > 0.1,
      lastUpdated: '2 hours ago'
    });
  }

  return results;
}

function generatePharmacyPrices(basePrice) {
  const numPharmacies = Math.floor(Math.random() * 3) + 3; // 3-5 pharmacies
  const pharmacies = [];

  for (let i = 0; i < numPharmacies; i++) {
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const price = basePrice * (1 + variation);
    
    pharmacies.push({
      name: pharmacyNames[i % pharmacyNames.length],
      price: price.toFixed(2),
      logo: pharmacyLogos[i % pharmacyLogos.length],
      distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
      rating: (4 + Math.random()).toFixed(1),
      url: `pharmacy-detail.html?name=${encodeURIComponent(pharmacyNames[i % pharmacyNames.length])}&price=${price.toFixed(2)}&distance=${(Math.random() * 5 + 0.5).toFixed(1)}&rating=${(4 + Math.random()).toFixed(1)}`
    });
  }

  // Sort by price
  pharmacies.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  
  return pharmacies;
}