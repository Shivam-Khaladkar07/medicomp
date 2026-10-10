#!/usr/bin/env python3
"""
MediComp Database Initialization Script
This script creates and populates the SQLite database with medicine and pharmacy data.
"""

import sqlite3
import os
from pathlib import Path

def init_database():
    """Initialize the MediComp database with schema and sample data."""
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    db_path = project_root / "database" / "medicomp.db"
    
    # Create database directory if it doesn't exist
    db_path.parent.mkdir(exist_ok=True)
    
    # Remove existing database if it exists
    if db_path.exists():
        db_path.unlink()
        print("Removed existing database.")
    
    # Connect to database (this will create it)
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    print("Creating MediComp database...")
    
    # Read and execute the SQL schema
    schema_file = project_root / "database" / "medicomp.db"
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            generic_name TEXT NOT NULL,
            brand_name TEXT,
            strength TEXT NOT NULL,
            dosage_form TEXT NOT NULL,
            manufacturer TEXT NOT NULL,
            category TEXT NOT NULL,
            prescription_required BOOLEAN DEFAULT 0,
            description TEXT,
            side_effects TEXT,
            interactions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pharmacies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            pincode TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            website TEXT,
            rating REAL DEFAULT 0.0,
            verified BOOLEAN DEFAULT 0,
            operating_hours TEXT,
            delivery_available BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicine_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_id INTEGER NOT NULL,
            pharmacy_id INTEGER NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL,
            in_stock BOOLEAN DEFAULT 1,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (medicine_id) REFERENCES medicines (id),
            FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicine_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT
        )
    ''')
    
    print("Tables created successfully.")
    
    # Insert medicine categories
    categories = [
        ('Analgesics', 'Pain relief medications', '💊'),
        ('Antibiotics', 'Medications that fight bacterial infections', '🦠'),
        ('Antihypertensives', 'Medications for high blood pressure', '❤️'),
        ('Antidiabetics', 'Medications for diabetes management', '🩸'),
        ('Antacids', 'Medications for acid reflux and heartburn', '🔥'),
        ('Vitamins', 'Essential nutrients and supplements', '🌟'),
        ('Cough & Cold', 'Medications for respiratory symptoms', '🤧'),
        ('Dermatological', 'Skin-related medications', '🧴'),
        ('Ophthalmic', 'Eye-related medications', '👁️'),
        ('Dental', 'Oral health medications', '🦷')
    ]
    
    cursor.executemany('''
        INSERT INTO medicine_categories (name, description, icon) 
        VALUES (?, ?, ?)
    ''', categories)
    
    print("Medicine categories inserted.")
    
    # Insert sample medicines
    medicines = [
        ('Paracetamol 500mg', 'Acetaminophen', 'Crocin', '500mg', 'Tablet', 'GSK Consumer Healthcare', 'Analgesics', 0, 'Pain reliever and fever reducer', 'Nausea, stomach upset, allergic reactions', 'May interact with blood thinners'),
        ('Aspirin 75mg', 'Acetylsalicylic Acid', 'Ecosprin', '75mg', 'Tablet', 'USV Limited', 'Analgesics', 0, 'Pain reliever and blood thinner', 'Stomach irritation, bleeding risk', 'Interacts with blood thinners and alcohol'),
        ('Ibuprofen 400mg', 'Ibuprofen', 'Brufen', '400mg', 'Tablet', 'Abbott Healthcare', 'Analgesics', 0, 'Anti-inflammatory pain reliever', 'Stomach upset, dizziness, headache', 'May interact with blood pressure medications'),
        ('Amoxicillin 500mg', 'Amoxicillin', 'Novamox', '500mg', 'Capsule', 'Cipla Limited', 'Antibiotics', 1, 'Broad-spectrum antibiotic', 'Diarrhea, nausea, allergic reactions', 'Interacts with birth control pills'),
        ('Metformin 500mg', 'Metformin HCl', 'Glycomet', '500mg', 'Tablet', 'USV Limited', 'Antidiabetics', 1, 'Oral diabetes medication', 'Nausea, diarrhea, lactic acidosis risk', 'Interacts with alcohol and certain heart medications'),
        ('Omeprazole 20mg', 'Omeprazole', 'Omez', '20mg', 'Capsule', 'Dr. Reddy\'s Laboratories', 'Antacids', 1, 'Proton pump inhibitor for acid reflux', 'Headache, diarrhea, abdominal pain', 'May reduce absorption of other medications'),
        ('Cetirizine 10mg', 'Cetirizine', 'Alerid', '10mg', 'Tablet', 'Cipla Limited', 'Cough & Cold', 0, 'Antihistamine for allergies', 'Drowsiness, dry mouth, headache', 'May interact with sedatives'),
        ('Vitamin D3 1000IU', 'Cholecalciferol', 'Calcirol', '1000IU', 'Softgel', 'Cadila Healthcare', 'Vitamins', 0, 'Vitamin D supplement for bone health', 'Nausea, constipation, kidney stones', 'May interact with certain heart medications'),
        ('Atorvastatin 10mg', 'Atorvastatin', 'Atorva', '10mg', 'Tablet', 'Sun Pharmaceutical', 'Cardiovascular', 1, 'Cholesterol-lowering medication', 'Muscle pain, liver problems, diabetes risk', 'Interacts with grapefruit and certain antibiotics'),
        ('Lisinopril 5mg', 'Lisinopril', 'Zestril', '5mg', 'Tablet', 'AstraZeneca', 'Antihypertensives', 1, 'ACE inhibitor for blood pressure', 'Dry cough, dizziness, high potassium', 'Interacts with potassium supplements and diuretics')
    ]
    
    cursor.executemany('''
        INSERT INTO medicines (name, generic_name, brand_name, strength, dosage_form, manufacturer, category, prescription_required, description, side_effects, interactions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', medicines)
    
    print("Sample medicines inserted.")
    
    # Insert sample pharmacies
    pharmacies = [
        ('MedPlus Pharmacy', 'Retail Chain', '123 Healthcare Street, Medical District', 'Mumbai', 'Maharashtra', '400001', '+91 98765 43210', 'info@medplus.com', 'https://medplus.com', 4.5, 1, '8:00 AM - 10:00 PM', 1),
        ('Apollo Pharmacy', 'Retail Chain', '456 Wellness Avenue, Health Zone', 'Delhi', 'Delhi', '110001', '+91 98765 43211', 'info@apollo.com', 'https://apollo.com', 4.7, 1, '7:00 AM - 11:00 PM', 1),
        ('Netmeds Online', 'Online Pharmacy', '789 Digital Plaza, E-commerce Hub', 'Bangalore', 'Karnataka', '560001', '+91 98765 43212', 'support@netmeds.com', 'https://netmeds.com', 4.3, 1, '24/7 Online', 1),
        ('PharmEasy', 'Online Pharmacy', '321 Easy Street, Tech Park', 'Chennai', 'Tamil Nadu', '600001', '+91 98765 43213', 'help@pharmeasy.com', 'https://pharmeasy.com', 4.6, 1, '24/7 Online', 1),
        ('1mg Store', 'Online Pharmacy', '654 Health Lane, Digital City', 'Kolkata', 'West Bengal', '700001', '+91 98765 43214', 'support@1mg.com', 'https://1mg.com', 4.4, 1, '24/7 Online', 1),
        ('Wellness Forever', 'Independent', '987 Wellness Road, Community Center', 'Pune', 'Maharashtra', '411001', '+91 98765 43215', 'info@wellnessforever.com', 'https://wellnessforever.com', 4.2, 1, '9:00 AM - 9:00 PM', 0),
        ('Guardian Pharmacy', 'Retail Chain', '147 Guardian Street, Shopping Mall', 'Hyderabad', 'Telangana', '500001', '+91 98765 43216', 'info@guardian.com', 'https://guardian.com', 4.5, 1, '8:00 AM - 10:00 PM', 1),
        ('HealthKart Pharmacy', 'Online Pharmacy', '258 Health Street, E-commerce Zone', 'Ahmedabad', 'Gujarat', '380001', '+91 98765 43217', 'support@healthkart.com', 'https://healthkart.com', 4.1, 1, '24/7 Online', 1)
    ]
    
    cursor.executemany('''
        INSERT INTO pharmacies (name, type, address, city, state, pincode, phone, email, website, rating, verified, operating_hours, delivery_available) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', pharmacies)
    
    print("Sample pharmacies inserted.")
    
    # Insert sample medicine prices
    prices = [
        (1, 1, 25.00, 10, 'tablets', 1), (1, 2, 28.00, 10, 'tablets', 1), (1, 3, 22.00, 10, 'tablets', 1), (1, 4, 24.00, 10, 'tablets', 1),
        (2, 1, 15.00, 15, 'tablets', 1), (2, 2, 18.00, 15, 'tablets', 1), (2, 3, 14.00, 15, 'tablets', 1), (2, 5, 16.00, 15, 'tablets', 1),
        (3, 1, 35.00, 10, 'tablets', 1), (3, 2, 38.00, 10, 'tablets', 1), (3, 4, 32.00, 10, 'tablets', 1), (3, 6, 36.00, 10, 'tablets', 1),
        (4, 1, 120.00, 10, 'capsules', 1), (4, 2, 125.00, 10, 'capsules', 1), (4, 3, 118.00, 10, 'capsules', 1), (4, 7, 122.00, 10, 'capsules', 1),
        (5, 1, 85.00, 15, 'tablets', 1), (5, 2, 88.00, 15, 'tablets', 1), (5, 4, 82.00, 15, 'tablets', 1), (5, 8, 86.00, 15, 'tablets', 1),
        (6, 1, 95.00, 10, 'capsules', 1), (6, 2, 98.00, 10, 'capsules', 1), (6, 3, 92.00, 10, 'capsules', 1), (6, 5, 94.00, 10, 'capsules', 1),
        (7, 1, 45.00, 10, 'tablets', 1), (7, 2, 48.00, 10, 'tablets', 1), (7, 4, 42.00, 10, 'tablets', 1), (7, 6, 44.00, 10, 'tablets', 1),
        (8, 1, 180.00, 30, 'softgels', 1), (8, 2, 185.00, 30, 'softgels', 1), (8, 3, 175.00, 30, 'softgels', 1), (8, 7, 178.00, 30, 'softgels', 1),
        (9, 1, 150.00, 10, 'tablets', 1), (9, 2, 155.00, 10, 'tablets', 1), (9, 4, 148.00, 10, 'tablets', 1), (9, 8, 152.00, 10, 'tablets', 1),
        (10, 1, 75.00, 10, 'tablets', 1), (10, 2, 78.00, 10, 'tablets', 1), (10, 3, 72.00, 10, 'tablets', 1), (10, 5, 74.00, 10, 'tablets', 1)
    ]
    
    cursor.executemany('''
        INSERT INTO medicine_prices (medicine_id, pharmacy_id, price, quantity, unit, in_stock) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', prices)
    
    print("Sample medicine prices inserted.")
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_pharmacies_city ON pharmacies(city)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_medicine_prices_medicine ON medicine_prices(medicine_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_medicine_prices_pharmacy ON medicine_prices(pharmacy_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_medicine_prices_price ON medicine_prices(price)')
    
    print("Database indexes created.")
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print(f"Database initialized successfully at: {db_path}")
    print("Database contains:")
    print("- 10 medicine categories")
    print("- 10 sample medicines")
    print("- 8 sample pharmacies")
    print("- 40 sample medicine prices")

if __name__ == "__main__":
    init_database()
