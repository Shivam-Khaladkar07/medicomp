# Database Setup Instructions

## Option 1: Using Python (Recommended)

If you have Python 3.7+ installed:

```bash
python scripts/database/init_db.py
```

## Option 2: Manual Setup (No Python Required)

The application will work automatically with the built-in database service that contains all the sample data. No additional setup is required.

## Option 3: Using Online SQLite Tools

1. Copy the SQL schema from `database/medicomp.db`
2. Use an online SQLite tool like:
   - [SQLite Online](https://sqliteonline.com/)
   - [DB Browser for SQLite Online](https://db-browser.herokuapp.com/)
3. Execute the schema and sample data
4. Download the generated .db file
5. Place it in the `database/` folder

## What's Included

The application comes with:
- **10 Medicine Categories**: Analgesics, Antibiotics, Antihypertensives, etc.
- **10 Sample Medicines**: Paracetamol, Aspirin, Ibuprofen, etc.
- **8 Sample Pharmacies**: MedPlus, Apollo, Netmeds, etc.
- **40 Sample Prices**: Realistic pricing across pharmacies

## Database Schema

The database includes these tables:
- `medicines` - Medicine information
- `pharmacies` - Pharmacy details
- `medicine_prices` - Price data
- `medicine_categories` - Category information

## No Setup Required

**Important**: The application will work immediately without any database setup. The JavaScript database service (`db_service.js`) contains all the necessary sample data and will function perfectly for demonstration and development purposes.

## For Production Use

When deploying to production:
1. Set up a real database (MySQL, PostgreSQL, etc.)
2. Create a backend API
3. Update the database service to connect to your API
4. Replace sample data with real pharmacy data
