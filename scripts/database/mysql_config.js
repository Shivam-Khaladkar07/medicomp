/**
 * MySQL Database Configuration for MediComp
 * Handles MySQL connection and database operations
 */

class MySQLConfig {
  constructor() {
    // Database connection configuration
    this.config = {
      host: 'localhost',
      user: 'medicomp_user',
      password: 'your_password_here',
      database: 'medicomp_db',
      port: 3306,
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    };
    
    // Database schema
    this.schema = {
      medicines: `
        CREATE TABLE IF NOT EXISTS medicines (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          generic_name VARCHAR(255),
          brand_name VARCHAR(255),
          strength VARCHAR(100),
          dosage_form VARCHAR(100),
          manufacturer VARCHAR(255),
          category VARCHAR(100),
          prescription_required BOOLEAN DEFAULT FALSE,
          description TEXT,
          side_effects TEXT,
          interactions TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      
      pharmacies: `
        CREATE TABLE IF NOT EXISTS pharmacies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(100),
          pincode VARCHAR(10),
          phone VARCHAR(20),
          email VARCHAR(255),
          rating DECIMAL(3,2) DEFAULT 0.00,
          verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      
      medicine_categories: `
        CREATE TABLE IF NOT EXISTS medicine_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      
      medicine_prices: `
        CREATE TABLE IF NOT EXISTS medicine_prices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          medicine_id INT NOT NULL,
          pharmacy_id INT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          stock_quantity INT DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
          FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
          UNIQUE KEY unique_medicine_pharmacy (medicine_id, pharmacy_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      
      users: `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255),
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      
      cart_items: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          medicine_id INT NOT NULL,
          pharmacy_id INT NOT NULL,
          quantity INT DEFAULT 1,
          added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
          FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `
    };
    
    // Sample data for initial population
    this.sampleData = {
      categories: [
        { name: 'Analgesics', description: 'Pain relieving medications' },
        { name: 'Antibiotics', description: 'Medications that fight bacterial infections' },
        { name: 'Antihypertensives', description: 'Medications for high blood pressure' },
        { name: 'Antidiabetics', description: 'Medications for diabetes management' },
        { name: 'Antacids', description: 'Medications for stomach acid relief' },
        { name: 'Vitamins', description: 'Essential nutrients and supplements' },
        { name: 'Cough & Cold', description: 'Medications for respiratory symptoms' },
        { name: 'Skin Care', description: 'Topical medications for skin conditions' },
        { name: 'Eye Care', description: 'Medications for eye health' },
        { name: 'Dental Care', description: 'Medications for oral health' }
      ]
    };
  }

  // Get database configuration
  getConfig() {
    return this.config;
  }

  // Get database schema
  getSchema() {
    return this.schema;
  }

  // Get sample data
  getSampleData() {
    return this.sampleData;
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get connection string for MySQL
  getConnectionString() {
    return `mysql://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MySQLConfig;
}
