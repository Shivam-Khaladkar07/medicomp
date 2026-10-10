/**
 * MySQL Database Service for MediComp
 * Handles all database operations for medicines, pharmacies, and prices
 */

class MySQLService {
  constructor() {
    this.connection = null;
    this.config = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      // Import configuration
      const { MySQLConfig } = await import('./mysql_config.js');
      this.config = new MySQLConfig();
      
      // Try to connect to MySQL
      await this.connect();
    } catch (error) {
      console.error('Failed to initialize MySQL service:', error);
      // Fallback to mock data if MySQL is not available
      this.useMockData();
    }
  }

  async connect() {
    try {
      // Check if MySQL is available in the environment
      if (typeof window !== 'undefined') {
        // Browser environment - we'll need a backend API
        console.log('Running in browser - MySQL connection requires backend API');
        this.isConnected = false;
        return;
      }

      // Node.js environment - try to connect to MySQL
      const mysql = require('mysql2/promise');
      
      this.connection = await mysql.createConnection(this.config.getConfig());
      this.isConnected = true;
      console.log('Connected to MySQL database successfully');
      
      // Initialize database schema
      await this.initializeSchema();
      
    } catch (error) {
      console.error('MySQL connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async initializeSchema() {
    if (!this.isConnected) return;
    
    try {
      const schema = this.config.getSchema();
      
      // Create tables
      for (const [tableName, createSQL] of Object.entries(schema)) {
        await this.connection.execute(createSQL);
        console.log(`Table ${tableName} initialized`);
      }
      
      // Insert sample data
      await this.insertSampleData();
      
    } catch (error) {
      console.error('Failed to initialize schema:', error);
    }
  }

  async insertSampleData() {
    if (!this.isConnected) return;
    
    try {
      // Insert categories
      const categories = this.config.getSampleData().categories;
      for (const category of categories) {
        await this.connection.execute(
          'INSERT IGNORE INTO medicine_categories (name, description) VALUES (?, ?)',
          [category.name, category.description]
        );
      }
      
      console.log('Sample data inserted successfully');
    } catch (error) {
      console.error('Failed to insert sample data:', error);
    }
  }

  // Medicine operations
  async getMedicines(limit = 100, offset = 0) {
    if (!this.isConnected) {
      return this.getMockMedicines();
    }
    
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM medicines ORDER BY name LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      console.error('Failed to get medicines:', error);
      return this.getMockMedicines();
    }
  }

  async searchMedicines(query, limit = 50) {
    if (!this.isConnected) {
      return this.searchMockMedicines(query);
    }
    
    try {
      const [rows] = await this.connection.execute(
        `SELECT * FROM medicines 
         WHERE name LIKE ? OR generic_name LIKE ? OR brand_name LIKE ?
         ORDER BY name LIMIT ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`, limit]
      );
      return rows;
    } catch (error) {
      console.error('Failed to search medicines:', error);
      return this.searchMockMedicines(query);
    }
  }

  async getMedicineById(id) {
    if (!this.isConnected) {
      return this.getMockMedicineById(id);
    }
    
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM medicines WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Failed to get medicine by ID:', error);
      return this.getMockMedicineById(id);
    }
  }

  async addMedicine(medicineData) {
    if (!this.isConnected) {
      console.log('Mock mode: Medicine would be added to database');
      return { success: true, id: Date.now() };
    }
    
    try {
      const [result] = await this.connection.execute(
        `INSERT INTO medicines (name, generic_name, brand_name, strength, dosage_form, 
         manufacturer, category, prescription_required, description, side_effects, interactions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          medicineData.name,
          medicineData.generic_name,
          medicineData.brand_name,
          medicineData.strength,
          medicineData.dosage_form,
          medicineData.manufacturer,
          medicineData.category,
          medicineData.prescription_required || false,
          medicineData.description,
          medicineData.side_effects,
          medicineData.interactions
        ]
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Failed to add medicine:', error);
      return { success: false, error: error.message };
    }
  }

  // Pharmacy operations
  async getPharmacies(limit = 100, offset = 0) {
    if (!this.isConnected) {
      return this.getMockPharmacies();
    }
    
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM pharmacies ORDER BY name LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      console.error('Failed to get pharmacies:', error);
      return this.getMockPharmacies();
    }
  }

  async getPharmacyById(id) {
    if (!this.isConnected) {
      return this.getMockPharmacyById(id);
    }
    
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM pharmacies WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Failed to get pharmacy by ID:', error);
      return this.getMockPharmacyById(id);
    }
  }

  // Price operations
  async getMedicinePrices(medicineId, limit = 50) {
    if (!this.isConnected) {
      return this.getMockMedicinePrices(medicineId);
    }
    
    try {
      const [rows] = await this.connection.execute(
        `SELECT mp.*, p.name as pharmacy_name, p.address, p.city, p.rating
         FROM medicine_prices mp
         JOIN pharmacies p ON mp.pharmacy_id = p.id
         WHERE mp.medicine_id = ?
         ORDER BY mp.price ASC
         LIMIT ?`,
        [medicineId, limit]
      );
      return rows;
    } catch (error) {
      console.error('Failed to get medicine prices:', error);
      return this.getMockMedicinePrices(medicineId);
    }
  }

  async searchMedicinesWithPrices(query, limit = 20) {
    if (!this.isConnected) {
      return this.searchMockMedicinesWithPrices(query);
    }
    
    try {
      const [rows] = await this.connection.execute(
        `SELECT DISTINCT m.*, 
                MIN(mp.price) as min_price,
                MAX(mp.price) as max_price,
                COUNT(DISTINCT mp.pharmacy_id) as pharmacy_count
         FROM medicines m
         LEFT JOIN medicine_prices mp ON m.id = mp.medicine_id
         WHERE m.name LIKE ? OR m.generic_name LIKE ? OR m.brand_name LIKE ?
         GROUP BY m.id
         ORDER BY m.name
         LIMIT ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`, limit]
      );
      return rows;
    } catch (error) {
      console.error('Failed to search medicines with prices:', error);
      return this.searchMockMedicinesWithPrices(query);
    }
  }

  // Mock data fallback methods
  useMockData() {
    console.log('Using mock data - MySQL not available');
    this.isConnected = false;
  }

  getMockMedicines() {
    // Return sample medicine data
    return [
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
      // Add more mock medicines as needed
    ];
  }

  searchMockMedicines(query) {
    const medicines = this.getMockMedicines();
    return medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.generic_name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.brand_name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getMockMedicineById(id) {
    const medicines = this.getMockMedicines();
    return medicines.find(medicine => medicine.id == id) || null;
  }

  getMockPharmacies() {
    return [
      {
        id: 1,
        name: 'MedPlus Pharmacy',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91-22-12345678',
        email: 'info@medplus.com',
        rating: 4.5,
        verified: true
      }
      // Add more mock pharmacies as needed
    ];
  }

  getMockPharmacyById(id) {
    const pharmacies = this.getMockPharmacies();
    return pharmacies.find(pharmacy => pharmacy.id == id) || null;
  }

  getMockMedicinePrices(medicineId) {
    return [
      {
        id: 1,
        medicine_id: medicineId,
        pharmacy_id: 1,
        price: 15.50,
        stock_quantity: 100,
        pharmacy_name: 'MedPlus Pharmacy',
        address: '123 Main Street',
        city: 'Mumbai',
        rating: 4.5
      }
      // Add more mock prices as needed
    ];
  }

  searchMockMedicinesWithPrices(query) {
    const medicines = this.searchMockMedicines(query);
    return medicines.map(medicine => ({
      ...medicine,
      min_price: 10.00,
      max_price: 25.00,
      pharmacy_count: 5
    }));
  }

  // Utility methods
  async closeConnection() {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.end();
        this.isConnected = false;
        console.log('MySQL connection closed');
      } catch (error) {
        console.error('Error closing MySQL connection:', error);
      }
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      config: this.config ? this.config.getConfig() : null
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MySQLService;
}
