# MySQL Database Setup Guide for MediComp

This guide will help you set up a MySQL database for your MediComp medicine price comparison application.

## Prerequisites

1. **MySQL Server** (version 8.0 or higher recommended)
2. **Node.js** (version 16.0 or higher)
3. **npm** or **yarn** package manager

## Step 1: Install MySQL Server

### Windows
1. Download MySQL Installer from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the setup wizard
3. Choose "Developer Default" or "Server only" installation
4. Set root password when prompted
5. Complete the installation

### macOS
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation
```

## Step 2: Create Database and User

1. **Connect to MySQL as root:**
```bash
mysql -u root -p
```

2. **Run the setup script:**
```sql
source database/setup_mysql.sql;
```

Or manually execute these commands:

```sql
-- Create database
CREATE DATABASE medicomp_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'medicomp_user'@'localhost' IDENTIFIED BY 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON medicomp_db.* TO 'medicomp_user'@'localhost';
FLUSH PRIVILEGES;

-- Use database
USE medicomp_db;
```

## Step 3: Install Node.js Dependencies

1. **Navigate to your project directory:**
```bash
cd /path/to/your/MediComp/project
```

2. **Install dependencies:**
```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL driver for Node.js
- `cors` - Cross-origin resource sharing middleware

## Step 4: Configure Database Connection

1. **Edit `server.js` and update the database configuration:**
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'medicomp_user',
  password: 'your_actual_password_here', // Change this!
  database: 'medicomp_db',
  port: 3306
};
```

2. **Or create a `.env` file for environment variables:**
```bash
# Create .env file
touch .env
```

Add the following content:
```env
DB_HOST=localhost
DB_USER=medicomp_user
DB_PASSWORD=your_actual_password_here
DB_NAME=medicomp_db
DB_PORT=3306
PORT=3000
```

## Step 5: Start the Server

1. **Start the server:**
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

2. **Verify the server is running:**
- Open your browser and go to `http://localhost:3000`
- Check the health endpoint: `http://localhost:3000/api/health`

## Step 6: Test the API Endpoints

### Test Medicine Search
```bash
curl "http://localhost:3000/api/medicines/search?q=paracetamol"
```

### Test Medicine Prices
```bash
curl "http://localhost:3000/api/medicines/1/prices"
```

### Test All Medicines
```bash
curl "http://localhost:3000/api/medicines"
```

### Test Pharmacies
```bash
curl "http://localhost:3000/api/pharmacies"
```

## Database Schema Overview

The application creates the following tables:

### 1. `medicines`
- Medicine information (name, generic name, brand, strength, etc.)
- Prescription requirements and side effects
- Category classification

### 2. `pharmacies`
- Pharmacy details (name, address, contact info)
- Rating and verification status
- Location information

### 3. `medicine_prices`
- Price data for medicines across pharmacies
- Stock quantities
- Foreign key relationships

### 4. `medicine_categories`
- Medicine category definitions
- Descriptions for each category

### 5. `users` (for future authentication)
- User account information
- Authentication details

### 6. `cart_items` (for shopping cart)
- Shopping cart functionality
- User medicine selections

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MySQL service is running
   - Check if port 3306 is accessible
   - Verify firewall settings

2. **Access Denied**
   - Check username and password
   - Verify user privileges
   - Ensure user can connect from localhost

3. **Database Not Found**
   - Verify database name spelling
   - Check if database was created successfully
   - Ensure user has access to the database

### Debug Commands

```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL processes
ps aux | grep mysql

# Check MySQL port
netstat -tlnp | grep 3306

# Test MySQL connection
mysql -u medicomp_user -p medicomp_db
```

## Security Considerations

1. **Change default passwords**
2. **Use strong passwords**
3. **Limit user privileges**
4. **Enable SSL connections for production**
5. **Regular security updates**

## Production Deployment

For production environments:

1. **Use environment variables** for sensitive data
2. **Enable SSL/TLS** for database connections
3. **Implement connection pooling** optimization
4. **Set up database backups**
5. **Monitor database performance**
6. **Use a reverse proxy** (nginx, Apache)

## Sample Data

The setup script includes sample data:
- **10 Medicine Categories** (Analgesics, Antibiotics, etc.)
- **5 Sample Medicines** (Paracetamol, Aspirin, etc.)
- **5 Sample Pharmacies** (MedPlus, Apollo, etc.)
- **25 Sample Prices** across different pharmacies

## Next Steps

1. **Customize the sample data** for your region
2. **Add more medicines** and pharmacies
3. **Implement user authentication**
4. **Add shopping cart functionality**
5. **Create admin panel** for data management

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify MySQL connection settings
3. Ensure all dependencies are installed
4. Check file permissions and paths

## API Documentation

The server provides these endpoints:

- `GET /api/medicines` - List all medicines
- `GET /api/medicines/search?q=query` - Search medicines
- `GET /api/medicines/:id/prices` - Get medicine prices
- `GET /api/pharmacies` - List all pharmacies
- `GET /api/health` - Server health check

All endpoints return JSON responses with `success` boolean and `data` or `error` fields.
