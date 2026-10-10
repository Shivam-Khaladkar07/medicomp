/**
 * MediComp Database Service
 * Handles database operations for medicines, pharmacies, and prices
 */

class DatabaseService {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    try {
      // Try to connect to MySQL backend API first
      const response = await fetch('/api/health');
      if (response.ok) {
        console.log('Connected to MySQL backend API');
        this.useMySQLAPI = true;
      } else {
        throw new Error('Backend API not available');
      }
    } catch (error) {
      console.log('MySQL backend not available, using mock data');
      // Fallback to mock data
      this.useMySQLAPI = false;
      this.db = this.getFallbackData();
    }
  }

  async loadMockData() {
    // Simulate loading data from database
    // In production, this would be an API call to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getFallbackData());
      }, 100);
    });
  }

  getFallbackData() {
    return {
      medicines: [
        {
          id: 1,
          name: 'Paracetamol 500mg',
          generic_name: 'Acetaminophen',
          brand_name: 'Crocin',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'GSK Consumer Healthcare',
          category: 'Analgesics',
          prescription_required: false,
          description: 'Pain reliever and fever reducer',
          side_effects: 'Nausea, stomach upset, allergic reactions',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 2,
          name: 'Aspirin 75mg',
          generic_name: 'Acetylsalicylic Acid',
          brand_name: 'Ecosprin',
          strength: '75mg',
          dosage_form: 'Tablet',
          manufacturer: 'USV Limited',
          category: 'Analgesics',
          prescription_required: false,
          description: 'Pain reliever and blood thinner',
          side_effects: 'Stomach irritation, bleeding risk',
          interactions: 'Interacts with blood thinners and alcohol'
        },
        {
          id: 3,
          name: 'Ibuprofen 400mg',
          generic_name: 'Ibuprofen',
          brand_name: 'Brufen',
          strength: '400mg',
          dosage_form: 'Tablet',
          manufacturer: 'Abbott Healthcare',
          category: 'Analgesics',
          prescription_required: false,
          description: 'Anti-inflammatory pain reliever',
          side_effects: 'Stomach upset, dizziness, headache',
          interactions: 'May interact with blood pressure medications'
        },
        {
          id: 4,
          name: 'Amoxicillin 500mg',
          generic_name: 'Amoxicillin',
          brand_name: 'Novamox',
          strength: '500mg',
          dosage_form: 'Capsule',
          manufacturer: 'Cipla Limited',
          category: 'Antibiotics',
          prescription_required: true,
          description: 'Broad-spectrum antibiotic',
          side_effects: 'Diarrhea, nausea, allergic reactions',
          interactions: 'Interacts with birth control pills'
        },
        {
          id: 5,
          name: 'Metformin 500mg',
          generic_name: 'Metformin HCl',
          brand_name: 'Glycomet',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'USV Limited',
          category: 'Antidiabetics',
          prescription_required: true,
          description: 'Oral diabetes medication',
          side_effects: 'Nausea, diarrhea, lactic acidosis risk',
          interactions: 'Interacts with alcohol and certain heart medications'
        },
        {
          id: 6,
          name: 'Omeprazole 20mg',
          generic_name: 'Omeprazole',
          brand_name: 'Omez',
          strength: '20mg',
          dosage_form: 'Capsule',
          manufacturer: 'Dr. Reddy\'s Laboratories',
          category: 'Antacids',
          prescription_required: true,
          description: 'Proton pump inhibitor for acid reflux',
          side_effects: 'Headache, diarrhea, abdominal pain',
          interactions: 'May reduce absorption of other medications'
        },
        {
          id: 7,
          name: 'Cetirizine 10mg',
          generic_name: 'Cetirizine',
          brand_name: 'Alerid',
          strength: '10mg',
          dosage_form: 'Tablet',
          manufacturer: 'Cipla Limited',
          category: 'Cough & Cold',
          prescription_required: false,
          description: 'Antihistamine for allergies',
          side_effects: 'Drowsiness, dry mouth, headache',
          interactions: 'May interact with sedatives'
        },
        {
          id: 8,
          name: 'Vitamin D3 1000IU',
          generic_name: 'Cholecalciferol',
          brand_name: 'Calcirol',
          strength: '1000IU',
          dosage_form: 'Softgel',
          manufacturer: 'Cadila Healthcare',
          category: 'Vitamins',
          prescription_required: false,
          description: 'Vitamin D supplement for bone health',
          side_effects: 'Nausea, constipation, kidney stones',
          interactions: 'May interact with certain heart medications'
        },
        {
          id: 9,
          name: 'Atorvastatin 10mg',
          generic_name: 'Atorvastatin',
          brand_name: 'Atorva',
          strength: '10mg',
          dosage_form: 'Tablet',
          manufacturer: 'Sun Pharmaceutical',
          category: 'Cardiovascular',
          prescription_required: true,
          description: 'Cholesterol-lowering medication',
          side_effects: 'Muscle pain, liver problems, diabetes risk',
          interactions: 'Interacts with grapefruit and certain antibiotics'
        },
        {
          id: 10,
          name: 'Lisinopril 5mg',
          generic_name: 'Lisinopril',
          brand_name: 'Zestril',
          strength: '5mg',
          dosage_form: 'Tablet',
          manufacturer: 'AstraZeneca',
          category: 'Antihypertensives',
          prescription_required: true,
          description: 'ACE inhibitor for blood pressure',
          side_effects: 'Dry cough, dizziness, high potassium',
          interactions: 'Interacts with potassium supplements and diuretics'
        },
        {
          id: 11,
          name: 'Dolo 650mg',
          generic_name: 'Paracetamol',
          brand_name: 'Dolo',
          strength: '650mg',
          dosage_form: 'Tablet',
          manufacturer: 'Micro Labs',
          category: 'Analgesics',
          prescription_required: false,
          description: 'High strength pain reliever and fever reducer',
          side_effects: 'Rare side effects, generally well tolerated',
          interactions: 'Minimal drug interactions'
        },
        {
          id: 12,
          name: 'Combiflam',
          generic_name: 'Ibuprofen + Paracetamol',
          brand_name: 'Combiflam',
          strength: '400mg + 325mg',
          dosage_form: 'Tablet',
          manufacturer: 'Sanofi India',
          category: 'Analgesics',
          prescription_required: false,
          description: 'Combination pain reliever for severe pain',
          side_effects: 'Stomach upset, nausea, dizziness',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 13,
          name: 'Azithromycin 500mg',
          generic_name: 'Azithromycin',
          brand_name: 'Zithromax',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'Pfizer',
          category: 'Antibiotics',
          prescription_required: true,
          description: 'Macrolide antibiotic for bacterial infections',
          side_effects: 'Nausea, diarrhea, stomach pain',
          interactions: 'Interacts with antacids and certain medications'
        },
        {
          id: 14,
          name: 'Ciprofloxacin 500mg',
          generic_name: 'Ciprofloxacin',
          brand_name: 'Ciplox',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'Cipla Limited',
          category: 'Antibiotics',
          prescription_required: true,
          description: 'Fluoroquinolone antibiotic',
          side_effects: 'Nausea, diarrhea, tendon rupture risk',
          interactions: 'Interacts with dairy products and antacids'
        },
        {
          id: 15,
          name: 'Glimepiride 1mg',
          generic_name: 'Glimepiride',
          brand_name: 'Amaryl',
          strength: '1mg',
          dosage_form: 'Tablet',
          manufacturer: 'Sanofi Aventis',
          category: 'Antidiabetics',
          prescription_required: true,
          description: 'Sulfonylurea for diabetes control',
          side_effects: 'Hypoglycemia, weight gain, skin reactions',
          interactions: 'Interacts with alcohol and certain antibiotics'
        },
        {
          id: 16,
          name: 'Sitagliptin 50mg',
          generic_name: 'Sitagliptin',
          brand_name: 'Januvia',
          strength: '50mg',
          dosage_form: 'Tablet',
          manufacturer: 'Merck Sharp & Dohme',
          category: 'Antidiabetics',
          prescription_required: true,
          description: 'DPP-4 inhibitor for diabetes',
          side_effects: 'Upper respiratory infection, headache',
          interactions: 'Generally well tolerated with few interactions'
        },
        {
          id: 17,
          name: 'Pantoprazole 40mg',
          generic_name: 'Pantoprazole',
          brand_name: 'Pan 40',
          strength: '40mg',
          dosage_form: 'Tablet',
          manufacturer: 'Alkem Laboratories',
          category: 'Antacids',
          prescription_required: true,
          description: 'Proton pump inhibitor for acid control',
          side_effects: 'Headache, diarrhea, abdominal pain',
          interactions: 'May reduce absorption of other medications'
        },
        {
          id: 18,
          name: 'Ranitidine 150mg',
          generic_name: 'Ranitidine',
          brand_name: 'Zantac',
          strength: '150mg',
          dosage_form: 'Tablet',
          manufacturer: 'GlaxoSmithKline',
          category: 'Antacids',
          prescription_required: false,
          description: 'H2 blocker for acid reflux',
          side_effects: 'Headache, constipation, diarrhea',
          interactions: 'May interact with certain medications'
        },
        {
          id: 19,
          name: 'Montelukast 10mg',
          generic_name: 'Montelukast',
          brand_name: 'Singulair',
          strength: '10mg',
          dosage_form: 'Tablet',
          manufacturer: 'Merck Sharp & Dohme',
          category: 'Respiratory',
          prescription_required: true,
          description: 'Leukotriene receptor antagonist for asthma',
          side_effects: 'Headache, stomach pain, mood changes',
          interactions: 'Generally well tolerated'
        },
        {
          id: 20,
          name: 'Salbutamol 100mcg',
          generic_name: 'Salbutamol',
          brand_name: 'Asthalin',
          strength: '100mcg',
          dosage_form: 'Inhaler',
          manufacturer: 'Cipla Limited',
          category: 'Respiratory',
          prescription_required: true,
          description: 'Bronchodilator for asthma and COPD',
          side_effects: 'Tremors, increased heart rate, nervousness',
          interactions: 'May interact with beta-blockers'
        },
        {
          id: 21,
          name: 'Levothyroxine 50mcg',
          generic_name: 'Levothyroxine',
          brand_name: 'Euthyrox',
          strength: '50mcg',
          dosage_form: 'Tablet',
          manufacturer: 'Merck KGaA',
          category: 'Hormones',
          prescription_required: true,
          description: 'Thyroid hormone replacement',
          side_effects: 'Palpitations, insomnia, weight loss',
          interactions: 'Interacts with iron and calcium supplements'
        },
        {
          id: 22,
          name: 'Metronidazole 400mg',
          generic_name: 'Metronidazole',
          brand_name: 'Flagyl',
          strength: '400mg',
          dosage_form: 'Tablet',
          manufacturer: 'Janssen Pharmaceuticals',
          category: 'Antibiotics',
          prescription_required: true,
          description: 'Antibiotic for anaerobic infections',
          side_effects: 'Metallic taste, nausea, dark urine',
          interactions: 'Interacts with alcohol and warfarin'
        },
        {
          id: 23,
          name: 'Diclofenac 50mg',
          generic_name: 'Diclofenac',
          brand_name: 'Voveran',
          strength: '50mg',
          dosage_form: 'Tablet',
          manufacturer: 'Novartis',
          category: 'Analgesics',
          prescription_required: false,
          description: 'NSAID for pain and inflammation',
          side_effects: 'Stomach upset, ulcers, kidney problems',
          interactions: 'Interacts with blood thinners and diuretics'
        },
        {
          id: 24,
          name: 'Amlodipine 5mg',
          generic_name: 'Amlodipine',
          brand_name: 'Amlong',
          strength: '5mg',
          dosage_form: 'Tablet',
          manufacturer: 'Micro Labs',
          category: 'Antihypertensives',
          prescription_required: true,
          description: 'Calcium channel blocker for blood pressure',
          side_effects: 'Ankle swelling, dizziness, flushing',
          interactions: 'May interact with grapefruit juice'
        },
        {
          id: 25,
          name: 'Losartan 50mg',
          generic_name: 'Losartan',
          brand_name: 'Cozaar',
          strength: '50mg',
          dosage_form: 'Tablet',
          manufacturer: 'Merck Sharp & Dohme',
          category: 'Antihypertensives',
          prescription_required: true,
          description: 'ARB for blood pressure control',
          side_effects: 'Dizziness, fatigue, high potassium',
          interactions: 'Interacts with potassium supplements'
        },
        {
          id: 26,
          name: 'Simvastatin 20mg',
          generic_name: 'Simvastatin',
          brand_name: 'Zocor',
          strength: '20mg',
          dosage_form: 'Tablet',
          manufacturer: 'Merck Sharp & Dohme',
          category: 'Cardiovascular',
          prescription_required: true,
          description: 'Statin for cholesterol reduction',
          side_effects: 'Muscle pain, liver problems, diabetes risk',
          interactions: 'Interacts with grapefruit and certain antibiotics'
        },
        {
          id: 27,
          name: 'Clopidogrel 75mg',
          generic_name: 'Clopidogrel',
          brand_name: 'Plavix',
          strength: '75mg',
          dosage_form: 'Tablet',
          manufacturer: 'Sanofi Aventis',
          category: 'Cardiovascular',
          prescription_required: true,
          description: 'Antiplatelet for heart disease',
          side_effects: 'Bleeding risk, stomach upset, rash',
          interactions: 'Interacts with blood thinners and NSAIDs'
        },
        {
          id: 28,
          name: 'Furosemide 40mg',
          generic_name: 'Furosemide',
          brand_name: 'Lasix',
          strength: '40mg',
          dosage_form: 'Tablet',
          manufacturer: 'Sanofi Aventis',
          category: 'Diuretics',
          prescription_required: true,
          description: 'Loop diuretic for fluid retention',
          side_effects: 'Frequent urination, dehydration, electrolyte imbalance',
          interactions: 'Interacts with digoxin and lithium'
        },
        {
          id: 29,
          name: 'Spironolactone 25mg',
          generic_name: 'Spironolactone',
          brand_name: 'Aldactone',
          strength: '25mg',
          dosage_form: 'Tablet',
          manufacturer: 'Pfizer',
          category: 'Diuretics',
          prescription_required: true,
          description: 'Potassium-sparing diuretic',
          side_effects: 'Breast tenderness, irregular periods, high potassium',
          interactions: 'Interacts with ACE inhibitors and potassium'
        },
        {
          id: 30,
          name: 'Warfarin 5mg',
          generic_name: 'Warfarin',
          brand_name: 'Coumadin',
          strength: '5mg',
          dosage_form: 'Tablet',
          manufacturer: 'Bristol-Myers Squibb',
          category: 'Anticoagulants',
          prescription_required: true,
          description: 'Blood thinner for clot prevention',
          side_effects: 'Bleeding risk, bruising, hair loss',
          interactions: 'Many drug and food interactions'
        },
        {
          id: 31,
          name: 'Digoxin 0.25mg',
          generic_name: 'Digoxin',
          brand_name: 'Lanoxin',
          strength: '0.25mg',
          dosage_form: 'Tablet',
          manufacturer: 'GlaxoSmithKline',
          category: 'Cardiovascular',
          prescription_required: true,
          description: 'Digitalis for heart failure',
          side_effects: 'Nausea, vision changes, irregular heartbeat',
          interactions: 'Interacts with many medications'
        },
        {
          id: 32,
          name: 'Propranolol 40mg',
          generic_name: 'Propranolol',
          brand_name: 'Inderal',
          strength: '40mg',
          dosage_form: 'Tablet',
          manufacturer: 'AstraZeneca',
          category: 'Antihypertensives',
          prescription_required: true,
          description: 'Beta-blocker for blood pressure and anxiety',
          side_effects: 'Fatigue, cold hands, depression',
          interactions: 'Interacts with calcium channel blockers'
        },
        {
          id: 33,
          name: 'Hydrochlorothiazide 25mg',
          generic_name: 'Hydrochlorothiazide',
          brand_name: 'Esidrix',
          strength: '25mg',
          dosage_form: 'Tablet',
          manufacturer: 'Novartis',
          category: 'Diuretics',
          prescription_required: true,
          description: 'Thiazide diuretic for blood pressure',
          side_effects: 'Frequent urination, dehydration, gout',
          interactions: 'Interacts with lithium and NSAIDs'
        },
        {
          id: 34,
          name: 'Loratadine 10mg',
          generic_name: 'Loratadine',
          brand_name: 'Claritin',
          strength: '10mg',
          dosage_form: 'Tablet',
          manufacturer: 'Bayer Healthcare',
          category: 'Cough & Cold',
          prescription_required: false,
          description: 'Non-drowsy antihistamine',
          side_effects: 'Headache, dry mouth, nervousness',
          interactions: 'Generally well tolerated'
        },
        {
          id: 35,
          name: 'Dextromethorphan 15mg',
          generic_name: 'Dextromethorphan',
          brand_name: 'Robitussin',
          strength: '15mg',
          dosage_form: 'Syrup',
          manufacturer: 'Johnson & Johnson',
          category: 'Cough & Cold',
          prescription_required: false,
          description: 'Cough suppressant',
          side_effects: 'Drowsiness, dizziness, nausea',
          interactions: 'May interact with antidepressants'
        },
        {
          id: 36,
          name: 'Guaifenesin 400mg',
          generic_name: 'Guaifenesin',
          brand_name: 'Mucinex',
          strength: '400mg',
          dosage_form: 'Tablet',
          manufacturer: 'Reckitt Benckiser',
          category: 'Cough & Cold',
          prescription_required: false,
          description: 'Expectorant for chest congestion',
          side_effects: 'Nausea, vomiting, dizziness',
          interactions: 'Generally well tolerated'
        },
        {
          id: 37,
          name: 'Pseudoephedrine 30mg',
          generic_name: 'Pseudoephedrine',
          brand_name: 'Sudafed',
          strength: '30mg',
          dosage_form: 'Tablet',
          manufacturer: 'Johnson & Johnson',
          category: 'Cough & Cold',
          prescription_required: false,
          description: 'Decongestant for nasal congestion',
          side_effects: 'Insomnia, nervousness, increased blood pressure',
          interactions: 'Interacts with MAO inhibitors'
        },
        {
          id: 38,
          name: 'Calcium Carbonate 500mg',
          generic_name: 'Calcium Carbonate',
          brand_name: 'Caltrate',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'Pfizer',
          category: 'Vitamins',
          prescription_required: false,
          description: 'Calcium supplement for bone health',
          side_effects: 'Constipation, gas, stomach upset',
          interactions: 'Interacts with certain antibiotics and iron'
        },
        {
          id: 39,
          name: 'Iron Sulfate 325mg',
          generic_name: 'Ferrous Sulfate',
          brand_name: 'Fer-In-Sol',
          strength: '325mg',
          dosage_form: 'Tablet',
          manufacturer: 'Mead Johnson',
          category: 'Vitamins',
          prescription_required: false,
          description: 'Iron supplement for anemia',
          side_effects: 'Constipation, black stools, stomach upset',
          interactions: 'Interacts with calcium and antacids'
        },
        {
          id: 40,
          name: 'Folic Acid 5mg',
          generic_name: 'Folic Acid',
          brand_name: 'Folvite',
          strength: '5mg',
          dosage_form: 'Tablet',
          manufacturer: 'Teva Pharmaceuticals',
          category: 'Vitamins',
          prescription_required: false,
          description: 'B vitamin for cell growth',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with certain medications'
        },
        {
          id: 41,
          name: 'Vitamin B12 1000mcg',
          generic_name: 'Cyanocobalamin',
          brand_name: 'Cyanocobalamin',
          strength: '1000mcg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Vitamins',
          prescription_required: false,
          description: 'B12 supplement for energy and nerve health',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with certain medications'
        },
        {
          id: 42,
          name: 'Vitamin C 1000mg',
          generic_name: 'Ascorbic Acid',
          brand_name: 'Cenolate',
          strength: '1000mg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Vitamins',
          prescription_required: false,
          description: 'Vitamin C for immune support',
          side_effects: 'Diarrhea, stomach upset in high doses',
          interactions: 'May interact with certain medications'
        },
        {
          id: 43,
          name: 'Omega-3 1000mg',
          generic_name: 'Fish Oil',
          brand_name: 'Lovaza',
          strength: '1000mg',
          dosage_form: 'Softgel',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Omega-3 fatty acids for heart health',
          side_effects: 'Fishy burps, upset stomach',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 44,
          name: 'Probiotics 10 Billion CFU',
          generic_name: 'Lactobacillus',
          brand_name: 'Culturelle',
          strength: '10 Billion CFU',
          dosage_form: 'Capsule',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Probiotic for gut health',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with antibiotics'
        },
        {
          id: 45,
          name: 'Melatonin 3mg',
          generic_name: 'Melatonin',
          brand_name: 'Circadin',
          strength: '3mg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Natural sleep hormone',
          side_effects: 'Drowsiness, headache, dizziness',
          interactions: 'May interact with sedatives'
        },
        {
          id: 46,
          name: 'Glucosamine 500mg',
          generic_name: 'Glucosamine Sulfate',
          brand_name: 'Move Free',
          strength: '500mg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Joint health supplement',
          side_effects: 'Nausea, heartburn, diarrhea',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 47,
          name: 'Chondroitin 400mg',
          generic_name: 'Chondroitin Sulfate',
          brand_name: 'Move Free',
          strength: '400mg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Joint cartilage support',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 48,
          name: 'Coenzyme Q10 100mg',
          generic_name: 'Ubiquinone',
          brand_name: 'CoQ10',
          strength: '100mg',
          dosage_form: 'Softgel',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Antioxidant for heart health',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with blood thinners'
        },
        {
          id: 49,
          name: 'Biotin 5000mcg',
          generic_name: 'Biotin',
          brand_name: 'Biotin',
          strength: '5000mcg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'B vitamin for hair and nail health',
          side_effects: 'Generally well tolerated',
          interactions: 'May interact with certain medications'
        },
        {
          id: 50,
          name: 'Zinc 50mg',
          generic_name: 'Zinc Sulfate',
          brand_name: 'Zinc',
          strength: '50mg',
          dosage_form: 'Tablet',
          manufacturer: 'Various',
          category: 'Supplements',
          prescription_required: false,
          description: 'Zinc for immune support',
          side_effects: 'Nausea, stomach upset, metallic taste',
          interactions: 'May interact with certain medications'
        }
      ],
      pharmacies: [
        {
          id: 1,
          name: 'MedPlus Pharmacy',
          type: 'Retail Chain',
          address: '123 Healthcare Street, Medical District',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 98765 43210',
          email: 'info@medplus.com',
          website: 'https://medplus.com',
          rating: 4.5,
          verified: true,
          operating_hours: '8:00 AM - 10:00 PM',
          delivery_available: true
        },
        {
          id: 2,
          name: 'Apollo Pharmacy',
          type: 'Retail Chain',
          address: '456 Wellness Avenue, Health Zone',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          phone: '+91 98765 43211',
          email: 'info@apollo.com',
          website: 'https://apollo.com',
          rating: 4.7,
          verified: true,
          operating_hours: '7:00 AM - 11:00 PM',
          delivery_available: true
        },
        {
          id: 3,
          name: 'Netmeds Online',
          type: 'Online Pharmacy',
          address: '789 Digital Plaza, E-commerce Hub',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          phone: '+91 98765 43212',
          email: 'support@netmeds.com',
          website: 'https://netmeds.com',
          rating: 4.3,
          verified: true,
          operating_hours: '24/7 Online',
          delivery_available: true
        },
        {
          id: 4,
          name: 'PharmEasy',
          type: 'Online Pharmacy',
          address: '321 Easy Street, Tech Park',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          phone: '+91 98765 43213',
          email: 'help@pharmeasy.com',
          website: 'https://pharmeasy.com',
          rating: 4.6,
          verified: true,
          operating_hours: '24/7 Online',
          delivery_available: true
        },
        {
          id: 5,
          name: '1mg Store',
          type: 'Online Pharmacy',
          address: '654 Health Lane, Digital City',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700001',
          phone: '+91 98765 43214',
          email: 'support@1mg.com',
          website: 'https://1mg.com',
          rating: 4.4,
          verified: true,
          operating_hours: '24/7 Online',
          delivery_available: true
        },
        {
          id: 6,
          name: 'HealthCare Pharmacy',
          type: 'Independent',
          address: '987 Medical Center Road, Health District',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          phone: '+91 98765 43215',
          email: 'info@healthcarepharmacy.com',
          website: 'https://healthcarepharmacy.com',
          rating: 4.2,
          verified: true,
          operating_hours: '9:00 AM - 9:00 PM',
          delivery_available: true
        },
        {
          id: 7,
          name: 'Wellness Corner',
          type: 'Independent',
          address: '456 Wellness Street, Downtown',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          phone: '+91 98765 43216',
          email: 'contact@wellnesscorner.com',
          website: 'https://wellnesscorner.com',
          rating: 4.1,
          verified: true,
          operating_hours: '8:00 AM - 8:00 PM',
          delivery_available: false
        },
        {
          id: 8,
          name: 'MediCare Plus',
          type: 'Retail Chain',
          address: '789 Healthcare Boulevard, Medical Zone',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
          phone: '+91 98765 43217',
          email: 'info@medicareplus.com',
          website: 'https://medicareplus.com',
          rating: 4.3,
          verified: true,
          operating_hours: '7:00 AM - 10:00 PM',
          delivery_available: true
        },
        {
          id: 9,
          name: 'QuickMed Express',
          type: 'Online Pharmacy',
          address: '123 Fast Lane, Digital Hub',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302001',
          phone: '+91 98765 43218',
          email: 'support@quickmed.com',
          website: 'https://quickmed.com',
          rating: 4.0,
          verified: true,
          operating_hours: '24/7 Online',
          delivery_available: true
        },
        {
          id: 10,
          name: 'Trust Pharmacy',
          type: 'Independent',
          address: '456 Trust Street, Community Center',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001',
          phone: '+91 98765 43219',
          email: 'info@trustpharmacy.com',
          website: 'https://trustpharmacy.com',
          rating: 4.4,
          verified: true,
          operating_hours: '8:00 AM - 9:00 PM',
          delivery_available: true
        }
      ],
      prices: [
        { medicine_id: 1, pharmacy_id: 1, price: 25.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 2, price: 28.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 3, price: 22.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 4, price: 24.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 5, price: 26.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 1, price: 15.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 2, price: 18.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 3, price: 14.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 5, price: 16.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 1, price: 35.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 2, price: 38.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 4, price: 32.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 4, pharmacy_id: 1, price: 120.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 2, price: 125.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 3, price: 118.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 5, pharmacy_id: 1, price: 85.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 2, price: 88.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 4, price: 82.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 6, pharmacy_id: 1, price: 95.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 2, price: 98.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 3, price: 92.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 7, pharmacy_id: 1, price: 45.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 2, price: 48.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 4, price: 42.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 8, pharmacy_id: 1, price: 180.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 2, price: 185.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 3, price: 175.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 9, pharmacy_id: 1, price: 150.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 2, price: 155.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 4, price: 148.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 1, price: 75.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 2, price: 78.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 3, price: 72.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 11, pharmacy_id: 1, price: 30.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 11, pharmacy_id: 2, price: 32.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 11, pharmacy_id: 3, price: 28.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 12, pharmacy_id: 1, price: 55.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 12, pharmacy_id: 2, price: 58.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 12, pharmacy_id: 4, price: 52.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 13, pharmacy_id: 1, price: 180.00, quantity: 6, unit: 'tablets', in_stock: true },
        { medicine_id: 13, pharmacy_id: 2, price: 185.00, quantity: 6, unit: 'tablets', in_stock: true },
        { medicine_id: 13, pharmacy_id: 3, price: 175.00, quantity: 6, unit: 'tablets', in_stock: true },
        { medicine_id: 14, pharmacy_id: 1, price: 95.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 14, pharmacy_id: 2, price: 98.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 14, pharmacy_id: 4, price: 92.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 15, pharmacy_id: 1, price: 65.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 15, pharmacy_id: 2, price: 68.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 15, pharmacy_id: 3, price: 62.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 16, pharmacy_id: 1, price: 220.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 16, pharmacy_id: 2, price: 225.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 16, pharmacy_id: 4, price: 218.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 17, pharmacy_id: 1, price: 110.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 17, pharmacy_id: 2, price: 115.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 17, pharmacy_id: 3, price: 108.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 18, pharmacy_id: 1, price: 35.00, quantity: 20, unit: 'tablets', in_stock: true },
        { medicine_id: 18, pharmacy_id: 2, price: 38.00, quantity: 20, unit: 'tablets', in_stock: true },
        { medicine_id: 18, pharmacy_id: 4, price: 32.00, quantity: 20, unit: 'tablets', in_stock: true },
        { medicine_id: 19, pharmacy_id: 1, price: 280.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 19, pharmacy_id: 2, price: 285.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 19, pharmacy_id: 3, price: 275.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 20, pharmacy_id: 1, price: 120.00, quantity: 1, unit: 'inhaler', in_stock: true },
        { medicine_id: 20, pharmacy_id: 2, price: 125.00, quantity: 1, unit: 'inhaler', in_stock: true },
        { medicine_id: 20, pharmacy_id: 4, price: 118.00, quantity: 1, unit: 'inhaler', in_stock: true },
        { medicine_id: 21, pharmacy_id: 1, price: 85.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 21, pharmacy_id: 2, price: 88.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 21, pharmacy_id: 3, price: 82.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 22, pharmacy_id: 1, price: 75.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 22, pharmacy_id: 2, price: 78.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 22, pharmacy_id: 4, price: 72.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 23, pharmacy_id: 1, price: 45.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 23, pharmacy_id: 2, price: 48.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 23, pharmacy_id: 3, price: 42.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 24, pharmacy_id: 1, price: 65.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 24, pharmacy_id: 2, price: 68.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 24, pharmacy_id: 4, price: 62.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 25, pharmacy_id: 1, price: 95.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 25, pharmacy_id: 2, price: 98.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 25, pharmacy_id: 3, price: 92.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 26, pharmacy_id: 1, price: 120.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 26, pharmacy_id: 2, price: 125.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 26, pharmacy_id: 4, price: 118.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 27, pharmacy_id: 1, price: 180.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 27, pharmacy_id: 2, price: 185.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 27, pharmacy_id: 3, price: 175.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 28, pharmacy_id: 1, price: 45.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 28, pharmacy_id: 2, price: 48.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 28, pharmacy_id: 4, price: 42.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 29, pharmacy_id: 1, price: 65.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 29, pharmacy_id: 2, price: 68.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 29, pharmacy_id: 3, price: 62.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 30, pharmacy_id: 1, price: 35.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 30, pharmacy_id: 2, price: 38.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 30, pharmacy_id: 4, price: 32.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 31, pharmacy_id: 1, price: 55.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 31, pharmacy_id: 2, price: 58.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 31, pharmacy_id: 3, price: 52.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 32, pharmacy_id: 1, price: 75.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 32, pharmacy_id: 2, price: 78.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 32, pharmacy_id: 4, price: 72.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 33, pharmacy_id: 1, price: 25.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 33, pharmacy_id: 2, price: 28.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 33, pharmacy_id: 3, price: 22.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 34, pharmacy_id: 1, price: 85.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 34, pharmacy_id: 2, price: 88.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 34, pharmacy_id: 4, price: 82.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 35, pharmacy_id: 1, price: 95.00, quantity: 100, unit: 'ml', in_stock: true },
        { medicine_id: 35, pharmacy_id: 2, price: 98.00, quantity: 100, unit: 'ml', in_stock: true },
        { medicine_id: 35, pharmacy_id: 3, price: 92.00, quantity: 100, unit: 'ml', in_stock: true },
        { medicine_id: 36, pharmacy_id: 1, price: 65.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 36, pharmacy_id: 2, price: 68.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 36, pharmacy_id: 4, price: 62.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 37, pharmacy_id: 1, price: 45.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 37, pharmacy_id: 2, price: 48.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 37, pharmacy_id: 3, price: 42.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 38, pharmacy_id: 1, price: 120.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 38, pharmacy_id: 2, price: 125.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 38, pharmacy_id: 3, price: 118.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 39, pharmacy_id: 1, price: 85.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 39, pharmacy_id: 2, price: 88.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 39, pharmacy_id: 4, price: 82.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 40, pharmacy_id: 1, price: 25.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 40, pharmacy_id: 2, price: 28.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 40, pharmacy_id: 3, price: 22.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 41, pharmacy_id: 1, price: 95.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 41, pharmacy_id: 2, price: 98.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 41, pharmacy_id: 4, price: 92.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 42, pharmacy_id: 1, price: 65.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 42, pharmacy_id: 2, price: 68.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 42, pharmacy_id: 3, price: 62.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 43, pharmacy_id: 1, price: 180.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 43, pharmacy_id: 2, price: 185.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 43, pharmacy_id: 4, price: 175.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 44, pharmacy_id: 1, price: 220.00, quantity: 30, unit: 'capsules', in_stock: true },
        { medicine_id: 44, pharmacy_id: 2, price: 225.00, quantity: 30, unit: 'capsules', in_stock: true },
        { medicine_id: 44, pharmacy_id: 3, price: 218.00, quantity: 30, unit: 'capsules', in_stock: true },
        { medicine_id: 45, pharmacy_id: 1, price: 150.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 45, pharmacy_id: 2, price: 155.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 45, pharmacy_id: 4, price: 148.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 46, pharmacy_id: 1, price: 280.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 46, pharmacy_id: 2, price: 285.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 46, pharmacy_id: 3, price: 275.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 47, pharmacy_id: 1, price: 320.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 47, pharmacy_id: 2, price: 325.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 47, pharmacy_id: 4, price: 318.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 48, pharmacy_id: 1, price: 180.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 48, pharmacy_id: 2, price: 185.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 48, pharmacy_id: 3, price: 175.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 49, pharmacy_id: 1, price: 120.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 49, pharmacy_id: 2, price: 125.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 49, pharmacy_id: 4, price: 118.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 50, pharmacy_id: 1, price: 85.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 50, pharmacy_id: 2, price: 88.00, quantity: 30, unit: 'tablets', in_stock: true },
        { medicine_id: 50, pharmacy_id: 4, price: 82.00, quantity: 30, unit: 'tablets', in_stock: true },
        // Additional pharmacy prices for better coverage
        { medicine_id: 1, pharmacy_id: 6, price: 26.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 7, price: 27.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 8, price: 25.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 9, price: 26.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 1, pharmacy_id: 10, price: 25.75, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 6, price: 16.50, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 7, price: 17.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 8, price: 15.50, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 9, price: 16.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 2, pharmacy_id: 10, price: 15.75, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 5, price: 34.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 6, price: 36.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 7, price: 37.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 8, price: 33.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 9, price: 34.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 3, pharmacy_id: 10, price: 33.75, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 4, pharmacy_id: 5, price: 122.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 6, price: 123.50, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 7, price: 124.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 8, price: 119.50, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 9, price: 120.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 4, pharmacy_id: 10, price: 119.75, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 5, pharmacy_id: 5, price: 87.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 6, price: 86.50, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 7, price: 87.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 8, price: 83.50, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 9, price: 84.00, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 5, pharmacy_id: 10, price: 83.75, quantity: 15, unit: 'tablets', in_stock: true },
        { medicine_id: 6, pharmacy_id: 5, price: 97.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 6, price: 96.50, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 7, price: 97.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 8, price: 93.50, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 9, price: 94.00, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 6, pharmacy_id: 10, price: 93.75, quantity: 10, unit: 'capsules', in_stock: true },
        { medicine_id: 7, pharmacy_id: 5, price: 47.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 6, price: 46.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 7, price: 47.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 8, price: 43.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 9, price: 44.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 7, pharmacy_id: 10, price: 43.75, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 8, pharmacy_id: 5, price: 182.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 6, price: 181.50, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 7, price: 182.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 8, price: 178.50, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 9, price: 179.00, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 8, pharmacy_id: 10, price: 178.75, quantity: 30, unit: 'softgels', in_stock: true },
        { medicine_id: 9, pharmacy_id: 5, price: 152.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 6, price: 151.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 7, price: 152.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 8, price: 148.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 9, price: 149.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 9, pharmacy_id: 10, price: 148.75, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 5, price: 77.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 6, price: 76.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 7, price: 77.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 8, price: 73.50, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 9, price: 74.00, quantity: 10, unit: 'tablets', in_stock: true },
        { medicine_id: 10, pharmacy_id: 10, price: 73.75, quantity: 10, unit: 'tablets', in_stock: true }
      ]
    };
  }

  // Search medicines by name, generic name, or category
  async searchMedicines(query, filters = {}) {
    try {
      if (this.useMySQLAPI) {
        // Use MySQL backend API
        const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            let results = result.data;
            
            // Apply filters
            if (filters.category) {
              results = results.filter(medicine => medicine.category === filters.category);
            }
            if (filters.prescription_required !== undefined) {
              results = results.filter(medicine => medicine.prescription_required === filters.prescription_required);
            }
            
            return results;
          }
        }
      }
      
      // Fallback to mock data
      if (!this.db) return [];
      
      const queryLower = query.toLowerCase();
      let results = this.db.medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(queryLower) ||
        medicine.generic_name.toLowerCase().includes(queryLower) ||
        medicine.category.toLowerCase().includes(queryLower)
      );

      // Apply filters
      if (filters.category) {
        results = results.filter(medicine => medicine.category === filters.category);
      }
      if (filters.prescription_required !== undefined) {
        results = results.filter(medicine => medicine.prescription_required === filters.prescription_required);
      }

      return results;
    } catch (error) {
      console.error('Error searching medicines:', error);
      return [];
    }
  }

  // Get medicine details by ID
  async getMedicineById(id) {
    if (!this.db) return null;
    return this.db.medicines.find(medicine => medicine.id === parseInt(id));
  }

  // Get medicine prices across pharmacies
  async getMedicinePrices(medicineId) {
    try {
      if (this.useMySQLAPI) {
        // Use MySQL backend API
        const response = await fetch(`/api/medicines/${medicineId}/prices`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            return result.data.sort((a, b) => a.price - b.price); // Sort by price
          }
        }
      }
      
      // Fallback to mock data
      if (!this.db) return [];
      
      const prices = this.db.prices.filter(price => price.medicine_id === parseInt(medicineId));
      
      return prices.map(price => {
        const pharmacy = this.db.pharmacies.find(p => p.id === price.pharmacy_id);
        return {
          ...price,
          pharmacy: pharmacy
        };
      }).sort((a, b) => a.price - b.price); // Sort by price
    } catch (error) {
      console.error('Error getting medicine prices:', error);
      return [];
    }
  }

  // Get all pharmacies
  async getPharmacies(filters = {}) {
    if (!this.db) return [];
    
    let results = [...this.db.pharmacies];

    // Apply filters
    if (filters.city) {
      results = results.filter(pharmacy => pharmacy.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.type) {
      results = results.filter(pharmacy => pharmacy.type === filters.type);
    }
    if (filters.verified !== undefined) {
      results = results.filter(pharmacy => pharmacy.verified === filters.verified);
    }

    return results;
  }

  // Get pharmacy details by ID
  async getPharmacyById(id) {
    if (!this.db) return null;
    return this.db.pharmacies.find(pharmacy => pharmacy.id === parseInt(id));
  }

  // Get medicine categories
  async getMedicineCategories() {
    if (!this.db) return [];
    
    const categories = [...new Set(this.db.medicines.map(medicine => medicine.category))];
    return categories.map(category => ({
      name: category,
      icon: this.getCategoryIcon(category),
      description: this.getCategoryDescription(category)
    }));
  }

  // Get category icon
  getCategoryIcon(category) {
    const iconMap = {
      'Analgesics': '💊',
      'Antibiotics': '🦠',
      'Antihypertensives': '❤️',
      'Antidiabetics': '🩸',
      'Antacids': '🔥',
      'Vitamins': '🌟',
      'Cough & Cold': '🤧',
      'Dermatological': '🧴',
      'Ophthalmic': '👁️',
      'Dental': '🦷',
      'Cardiovascular': '❤️'
    };
    return iconMap[category] || '💊';
  }

  // Get category description
  getCategoryDescription(category) {
    const descriptionMap = {
      'Analgesics': 'Pain relief medications',
      'Antibiotics': 'Medications that fight bacterial infections',
      'Antihypertensives': 'Medications for high blood pressure',
      'Antidiabetics': 'Medications for diabetes management',
      'Antacids': 'Medications for acid reflux and heartburn',
      'Vitamins': 'Essential nutrients and supplements',
      'Cough & Cold': 'Medications for respiratory symptoms',
      'Dermatological': 'Skin-related medications',
      'Ophthalmic': 'Eye-related medications',
      'Dental': 'Oral health medications',
      'Cardiovascular': 'Heart and blood vessel medications'
    };
    return descriptionMap[category] || 'General medications';
  }

  // Search medicines with prices
  async searchMedicinesWithPrices(query, filters = {}) {
    const medicines = await this.searchMedicines(query, filters);
    
    const results = [];
    for (const medicine of medicines) {
      const prices = await this.getMedicinePrices(medicine.id);
      if (prices.length > 0) {
        results.push({
          ...medicine,
          prices: prices,
          bestPrice: Math.min(...prices.map(p => p.price))
        });
      }
    }
    
    return results.sort((a, b) => a.bestPrice - b.bestPrice);
  }
}

// Export the service
export { DatabaseService };
