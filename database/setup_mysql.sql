-- MediComp MySQL Database Setup Script
-- Run this script as root or a user with CREATE DATABASE privileges

-- Create the database
CREATE DATABASE IF NOT EXISTS medicomp_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user for the application
CREATE USER IF NOT EXISTS 'medicomp_user'@'localhost' IDENTIFIED BY 'your_password_here';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON medicomp_db.* TO 'medicomp_user'@'localhost';

-- Grant additional privileges for development (optional)
GRANT CREATE, DROP, ALTER, INDEX ON medicomp_db.* TO 'medicomp_user'@'localhost';

-- Apply privileges
FLUSH PRIVILEGES;

-- Use the database
USE medicomp_db;

-- Create medicine categories table
CREATE TABLE IF NOT EXISTS medicine_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create medicines table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category),
  INDEX idx_generic_name (generic_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create pharmacies table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_city (city),
  INDEX idx_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create medicine prices table
CREATE TABLE IF NOT EXISTS medicine_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicine_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_medicine_pharmacy (medicine_id, pharmacy_id),
  INDEX idx_price (price),
  INDEX idx_stock (stock_quantity),
  INDEX idx_last_updated (last_updated)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  medicine_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_medicine_id (medicine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample medicine categories
INSERT IGNORE INTO medicine_categories (name, description) VALUES
('Analgesics', 'Pain relieving medications'),
('Antibiotics', 'Medications that fight bacterial infections'),
('Antihypertensives', 'Medications for high blood pressure'),
('Antidiabetics', 'Medications for diabetes management'),
('Antacids', 'Medications for stomach acid relief'),
('Vitamins', 'Essential nutrients and supplements'),
('Cough & Cold', 'Medications for respiratory symptoms'),
('Skin Care', 'Topical medications for skin conditions'),
('Eye Care', 'Medications for eye health'),
('Dental Care', 'Medications for oral health');

-- Insert sample medicines
INSERT IGNORE INTO medicines (name, generic_name, brand_name, strength, dosage_form, manufacturer, category, prescription_required, description, side_effects, interactions) VALUES
('Paracetamol 500mg', 'Acetaminophen', 'Crocin', '500mg', 'Tablet', 'GSK Consumer Healthcare', 'Analgesics', FALSE, 'Pain reliever and fever reducer', 'Nausea, stomach upset, allergic reactions', 'May interact with blood thinners'),
('Aspirin 75mg', 'Acetylsalicylic Acid', 'Ecosprin', '75mg', 'Tablet', 'USV Limited', 'Analgesics', FALSE, 'Pain reliever and blood thinner', 'Stomach irritation, bleeding risk', 'Interacts with blood thinners and alcohol'),
('Ibuprofen 400mg', 'Ibuprofen', 'Brufen', '400mg', 'Tablet', 'Abbott Healthcare', 'Analgesics', FALSE, 'Anti-inflammatory pain reliever', 'Stomach upset, dizziness, headache', 'May interact with blood pressure medications'),
('Amoxicillin 500mg', 'Amoxicillin', 'Novamox', '500mg', 'Capsule', 'Cipla Limited', 'Antibiotics', TRUE, 'Broad-spectrum antibiotic', 'Diarrhea, nausea, allergic reactions', 'Interacts with birth control pills'),
('Metformin 500mg', 'Metformin HCl', 'Glycomet', '500mg', 'Tablet', 'USV Limited', 'Antidiabetics', TRUE, 'Oral diabetes medication', 'Nausea, diarrhea, stomach upset', 'May interact with alcohol and other diabetes medications');

-- Insert sample pharmacies
INSERT IGNORE INTO pharmacies (name, address, city, state, pincode, phone, email, rating, verified) VALUES
('MedPlus Pharmacy', '123 Main Street, Andheri West', 'Mumbai', 'Maharashtra', '400058', '+91-22-12345678', 'info@medplus.com', 4.5, TRUE),
('Apollo Pharmacy', '456 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '+91-22-87654321', 'info@apollo.com', 4.3, TRUE),
('Netmeds Pharmacy', '789 Juhu Tara Road, Juhu', 'Mumbai', 'Maharashtra', '400049', '+91-22-11223344', 'info@netmeds.com', 4.1, TRUE),
('PharmEasy Store', '321 Hill Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '+91-22-99887766', 'info@pharmeasy.com', 4.2, TRUE),
('1mg Pharmacy', '654 Carter Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '+91-22-55443322', 'info@1mg.com', 4.0, TRUE);

-- Insert sample medicine prices
INSERT IGNORE INTO medicine_prices (medicine_id, pharmacy_id, price, stock_quantity) VALUES
(1, 1, 15.50, 100),
(1, 2, 18.00, 75),
(1, 3, 16.25, 90),
(1, 4, 17.50, 60),
(1, 5, 16.75, 80),
(2, 1, 12.00, 120),
(2, 2, 13.50, 85),
(2, 3, 11.75, 95),
(2, 4, 12.25, 70),
(2, 5, 11.50, 100),
(3, 1, 22.00, 80),
(3, 2, 24.50, 65),
(3, 3, 21.75, 85),
(3, 4, 23.00, 55),
(3, 5, 22.25, 75),
(4, 1, 45.00, 50),
(4, 2, 48.50, 40),
(4, 3, 44.75, 60),
(4, 4, 46.00, 35),
(4, 5, 45.25, 45),
(5, 1, 35.00, 70),
(5, 2, 37.50, 55),
(5, 3, 34.75, 80),
(5, 4, 36.00, 50),
(5, 5, 35.25, 65);

-- Show created tables
SHOW TABLES;

-- Show sample data
SELECT 'Medicine Categories' as table_name, COUNT(*) as count FROM medicine_categories
UNION ALL
SELECT 'Medicines', COUNT(*) FROM medicines
UNION ALL
SELECT 'Pharmacies', COUNT(*) FROM pharmacies
UNION ALL
SELECT 'Medicine Prices', COUNT(*) FROM medicine_prices;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  shipping_address TEXT NOT NULL,
  billing_address TEXT,
  order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(100),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  medicine_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  pharmacy_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_medicine_id (medicine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample orders for demonstration
INSERT IGNORE INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, order_status, payment_status, payment_method, subtotal, tax_amount, delivery_fee, total_amount, notes) VALUES
('ORD-2024-001', 'John Doe', 'john.doe@email.com', '+91-9876543210', '123 Main Street, Andheri West, Mumbai - 400058', 'delivered', 'paid', 'Credit Card', 150.00, 27.00, 50.00, 227.00, 'Please deliver after 6 PM'),
('ORD-2024-002', 'Jane Smith', 'jane.smith@email.com', '+91-9876543211', '456 Linking Road, Bandra West, Mumbai - 400050', 'shipped', 'paid', 'UPI', 225.00, 40.50, 50.00, 315.50, 'Urgent delivery required'),
('ORD-2024-003', 'Mike Johnson', 'mike.johnson@email.com', '+91-9876543212', '789 Juhu Tara Road, Juhu, Mumbai - 400049', 'processing', 'paid', 'Net Banking', 180.00, 32.40, 50.00, 262.40, 'Regular delivery'),
('ORD-2024-004', 'Sarah Wilson', 'sarah.wilson@email.com', '+91-9876543213', '321 Hill Road, Bandra West, Mumbai - 400050', 'pending', 'pending', 'Cash on Delivery', 95.00, 17.10, 50.00, 162.10, 'COD preferred');

-- Insert sample order items
INSERT IGNORE INTO order_items (order_id, medicine_id, pharmacy_id, medicine_name, pharmacy_name, quantity, unit_price, total_price) VALUES
(1, 1, 1, 'Paracetamol 500mg', 'MedPlus Pharmacy', 2, 15.50, 31.00),
(1, 2, 1, 'Aspirin 75mg', 'MedPlus Pharmacy', 3, 12.00, 36.00),
(1, 3, 1, 'Ibuprofen 400mg', 'MedPlus Pharmacy', 2, 22.00, 44.00),
(2, 1, 2, 'Paracetamol 500mg', 'Apollo Pharmacy', 4, 18.00, 72.00),
(2, 4, 2, 'Amoxicillin 500mg', 'Apollo Pharmacy', 2, 48.50, 97.00),
(2, 5, 2, 'Metformin 500mg', 'Apollo Pharmacy', 1, 37.50, 37.50),
(3, 2, 3, 'Aspirin 75mg', 'Netmeds Pharmacy', 5, 11.75, 58.75),
(3, 3, 3, 'Ibuprofen 400mg', 'Netmeds Pharmacy', 3, 21.75, 65.25),
(4, 1, 4, 'Paracetamol 500mg', 'PharmEasy Store', 3, 17.50, 52.50),
(4, 2, 4, 'Aspirin 75mg', 'PharmEasy Store', 2, 12.25, 24.50);

-- Insert sample order status history
INSERT IGNORE INTO order_status_history (order_id, status, notes) VALUES
(1, 'pending', 'Order placed successfully'),
(1, 'confirmed', 'Order confirmed by pharmacy'),
(1, 'processing', 'Order is being prepared'),
(1, 'shipped', 'Order shipped via courier'),
(1, 'delivered', 'Order delivered successfully'),
(2, 'pending', 'Order placed successfully'),
(2, 'confirmed', 'Order confirmed by pharmacy'),
(2, 'processing', 'Order is being prepared'),
(2, 'shipped', 'Order shipped via courier'),
(3, 'pending', 'Order placed successfully'),
(3, 'confirmed', 'Order confirmed by pharmacy'),
(3, 'processing', 'Order is being prepared'),
(4, 'pending', 'Order placed successfully');

-- Show sample medicine with prices
SELECT 
  m.name as medicine_name,
  m.generic_name,
  p.name as pharmacy_name,
  mp.price,
  mp.stock_quantity,
  p.city
FROM medicines m
JOIN medicine_prices mp ON m.id = mp.medicine_id
JOIN pharmacies p ON mp.pharmacy_id = p.id
ORDER BY m.name, mp.price
LIMIT 10;
