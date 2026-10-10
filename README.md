# MediComp - Medicine Price Comparison Platform

MediComp is a comprehensive web application that helps users compare medicine prices across multiple pharmacies, find detailed medicine information, and connect with verified healthcare providers.

## 🚀 Features

### **Core Functionality**
- **🔍 Medicine Search**: Search medicines by name, generic name, or category
- **💰 Price Comparison**: Compare prices across multiple pharmacies
- **🏥 Pharmacy Directory**: Browse verified partner pharmacies
- **📱 Responsive Design**: Works seamlessly on all devices
- **🤖 AI Chatbot**: Intelligent assistance for medicine-related queries

### **Database Integration**
- **🗄️ SQLite Database**: Comprehensive medicine and pharmacy data
- **📊 Real Data**: 10+ medicine categories, 10+ medicines, 8+ pharmacies
- **🔗 Relational Data**: Medicine prices linked to pharmacies
- **⚡ Fast Queries**: Optimized with database indexes

### **Medicine Information**
- **Generic & Brand Names**: Complete medicine identification
- **Strength & Dosage Forms**: Detailed specifications
- **Manufacturer Details**: Company information
- **Prescription Requirements**: Clear prescription indicators
- **Side Effects & Interactions**: Safety information
- **Category Classification**: Organized by medical purpose

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Database**: SQLite
- **Backend**: Python (for database initialization)
- **Architecture**: Modular JavaScript with ES6 modules

## 📁 Project Structure

```
MediComp/
├── index.html                 # Homepage with search functionality
├── about.html                 # About page
├── pharmacies.html            # Pharmacy listing page
├── contact.html               # Contact page
├── compare.html               # Medicine comparison page
├── pharmacy-detail.html       # Individual pharmacy details
├── components/                # Reusable HTML components
│   ├── navbar.html           # Navigation bar
│   ├── footer.html           # Footer
│   ├── chatbot.html          # AI chatbot component
│   └── badge.html            # Trust badges
├── scripts/                   # JavaScript modules
│   ├── search.js             # Medicine search functionality
│   ├── chatbot.js            # AI chatbot logic
│   ├── pharmacies.js         # Pharmacy management
│   ├── comparison.js         # Medicine comparison
│   ├── contact.js            # Contact form handling
│   ├── quickSearch.js        # Quick search functionality
│   ├── components/           # Component loaders
│   │   └── loader.js         # Dynamic component loading
│   ├── database/             # Database services
│   │   ├── db_service.js     # Database operations
│   │   └── init_db.py        # Database initialization script
│   └── utils/                # Utility functions
│       └── mockData.js       # Fallback mock data
├── database/                  # Database files
│   └── medicomp.db           # SQLite database (generated)
└── README.md                  # This file
```

## 🗄️ Database Schema

### **Tables**

#### **medicines**
- `id`: Primary key
- `name`: Medicine name with strength
- `generic_name`: Generic/chemical name
- `brand_name`: Brand name
- `strength`: Dosage strength
- `dosage_form`: Tablet, capsule, etc.
- `manufacturer`: Pharmaceutical company
- `category`: Medicine category
- `prescription_required`: Boolean flag
- `description`: Medicine description
- `side_effects`: Potential side effects
- `interactions`: Drug interactions

#### **pharmacies**
- `id`: Primary key
- `name`: Pharmacy name
- `type`: Retail chain, online, independent
- `address`: Full address
- `city`, `state`, `pincode`: Location details
- `phone`, `email`, `website`: Contact information
- `rating`: Customer rating
- `verified`: Verification status
- `operating_hours`: Business hours
- `delivery_available`: Delivery service flag

#### **medicine_prices**
- `id`: Primary key
- `medicine_id`: Reference to medicines table
- `pharmacy_id`: Reference to pharmacies table
- `price`: Medicine price
- `quantity`: Package quantity
- `unit`: Unit of measurement
- `in_stock`: Availability status
- `last_updated`: Price update timestamp

#### **medicine_categories**
- `id`: Primary key
- `name`: Category name
- `description`: Category description
- `icon`: Emoji icon representation

## 🚀 Getting Started

### **Prerequisites**
- Python 3.7+ (for database initialization)
- Modern web browser
- Local web server (optional, for development)

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MediComp
   ```

2. **Initialize the database**
   ```bash
   python scripts/database/init_db.py
   ```
   This will create the SQLite database with sample data.

3. **Start the application**
   - **Option 1**: Open `index.html` directly in your browser
   - **Option 2**: Use a local web server
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have it)
     npx http-server
     
     # PHP (if you have it)
     php -S localhost:8000
     ```

4. **Access the application**
   - Navigate to `http://localhost:8000` (if using server)
   - Or open `index.html` directly in your browser

## 🔧 Database Operations

### **Using the Database Service**

```javascript
import { DatabaseService } from './scripts/database/db_service.js';

const dbService = new DatabaseService();

// Search medicines
const results = await dbService.searchMedicines('paracetamol');

// Get medicine with prices
const medicineWithPrices = await dbService.searchMedicinesWithPrices('aspirin');

// Get pharmacy details
const pharmacy = await dbService.getPharmacyById(1);

// Get medicine categories
const categories = await dbService.getMedicineCategories();
```

### **Database Queries**

The service provides these main methods:
- `searchMedicines(query, filters)`: Search medicines with optional filters
- `getMedicineById(id)`: Get specific medicine details
- `getMedicinePrices(medicineId)`: Get prices across pharmacies
- `getPharmacies(filters)`: Get pharmacies with optional filters
- `getMedicineCategories()`: Get all medicine categories

## 🎯 Usage Examples

### **Searching for Medicines**
1. Visit the homepage
2. Enter medicine name (e.g., "Paracetamol", "Aspirin")
3. View search results with prices
4. Click "View Store" to see pharmacy details

### **Comparing Prices**
1. Search for a medicine
2. View prices across different pharmacies
3. Compare features and ratings
4. Choose the best option

### **Using the AI Chatbot**
1. Click the chat button (bottom-right)
2. Ask questions about medicines, prices, or health
3. Get instant AI-powered responses
4. Navigate through helpful information

## 🔒 Security & Privacy

- **No Personal Data**: Application doesn't store personal health information
- **Verified Sources**: All pharmacy data is verified
- **Secure Navigation**: Safe external links to pharmacy websites
- **Medical Disclaimer**: Clear disclaimers about medical advice

## 🚧 Development & Customization

### **Adding New Medicines**
1. Update the database initialization script
2. Add medicine details to the `medicines` table
3. Add corresponding prices to `medicine_prices` table

### **Adding New Pharmacies**
1. Update the database initialization script
2. Add pharmacy details to the `pharmacies` table
3. Add medicine prices for the new pharmacy

### **Customizing the UI**
- Modify Tailwind CSS classes in HTML files
- Update component styles in `scripts/components/`
- Customize chatbot responses in `scripts/chatbot.js`

## 🌟 Key Benefits

### **For Users**
- **Save Money**: Find the best medicine prices
- **Save Time**: Compare multiple pharmacies instantly
- **Make Informed Decisions**: Access comprehensive medicine information
- **24/7 Access**: Available anytime, anywhere

### **For Pharmacies**
- **Increased Visibility**: Reach more customers
- **Competitive Advantage**: Showcase competitive pricing
- **Trust Building**: Verified partner status
- **Customer Engagement**: Direct connection with users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub issues
- **Questions**: Use the AI chatbot in the application

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- **User Accounts**: Personalized medicine tracking
- **Price Alerts**: Notifications for price changes
- **Medicine Reviews**: User feedback and ratings
- **Mobile App**: Native mobile application
- **API Integration**: Connect with real pharmacy APIs
- **Advanced Search**: Filter by location, availability, etc.

---

**MediComp** - Making healthcare affordable and accessible for everyone! 🏥💊
