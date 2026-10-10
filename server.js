/**
 * MediComp Backend Server
 * Express server with MySQL database connection
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef'); // Replace with your actual secret key

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'medicomp_user',
  password: 'your_password_here',
  database: 'medicomp_db',
  port: 3306
};

// Database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    
    // Create tables
    const schema = {
      medicines: `CREATE TABLE IF NOT EXISTS medicines (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      orders: `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        shipping_address TEXT NOT NULL,
        billing_address TEXT,
        order_status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
        payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
        payment_method VARCHAR(100),
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        delivery_fee DECIMAL(10,2) DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_number (order_number),
        INDEX idx_order_status (order_status),
        INDEX idx_created_at (created_at)
      )`,
      order_items: `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        medicine_id INT NULL,
        pharmacy_id INT NULL,
        medicine_name VARCHAR(255) NOT NULL,
        pharmacy_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )`,
      order_status_history: `CREATE TABLE IF NOT EXISTS order_status_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id)
      )`,
      pharmacies: `CREATE TABLE IF NOT EXISTS pharmacies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        phone VARCHAR(20),
        email VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0.00,
        verified BOOLEAN DEFAULT FALSE
      )`,
      medicine_prices: `CREATE TABLE IF NOT EXISTS medicine_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        medicine_id INT NOT NULL,
        pharmacy_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT DEFAULT 0,
        FOREIGN KEY (medicine_id) REFERENCES medicines(id),
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
      )`
    };
    
    for (const [tableName, createSQL] of Object.entries(schema)) {
      await connection.execute(createSQL);
      console.log(`✅ Table ${tableName} initialized`);
    }
    
    connection.release();
    console.log('✅ Database initialization completed');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/medicines', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM medicines ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/medicines/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Search query required' });
    
    const [rows] = await pool.execute(
      'SELECT * FROM medicines WHERE name LIKE ? OR generic_name LIKE ? ORDER BY name',
      [`%${q}%`, `%${q}%`]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/medicines/:id/prices', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT mp.*, p.name as pharmacy_name, p.address, p.city, p.rating
       FROM medicine_prices mp
       JOIN pharmacies p ON mp.pharmacy_id = p.id
       WHERE mp.medicine_id = ? ORDER BY mp.price ASC`,
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/pharmacies', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pharmacies ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ success: true, message: 'Server is healthy', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server health check failed', database: 'Disconnected' });
  }
});

// Stripe Payment Intent Creation
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid amount' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'medicomp-app'
      }
    });

    res.json({ 
      success: true, 
      client_secret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment processing failed' 
    });
  }
});

// Orders API
// Create a new order
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      billing_address,
      payment_status = 'paid',
      payment_method = 'Card',
      subtotal,
      tax_amount,
      delivery_fee,
      total_amount,
      notes,
      items = []
    } = req.body;

    if (!customer_name || !customer_email || !shipping_address || !subtotal || !total_amount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
        (order_number, customer_name, customer_email, customer_phone, shipping_address, billing_address, order_status, payment_status, payment_method, subtotal, tax_amount, delivery_fee, total_amount, notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [orderNumber, customer_name, customer_email, customer_phone || null, shipping_address, billing_address || null, 'pending', payment_status, payment_method, subtotal, tax_amount || 0, delivery_fee || 0, total_amount, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, medicine_id, pharmacy_id, medicine_name, pharmacy_name, quantity, unit_price, total_price)
         VALUES (?,?,?,?,?,?,?,?)`,
        [orderId, item.medicine_id || null, item.pharmacy_id || null, item.medicine_name, item.pharmacy_name, item.quantity, item.unit_price, item.total_price]
      );
    }

    // Add initial status history
    await connection.execute(
      `INSERT INTO order_status_history (order_id, status, notes) VALUES (?, 'pending', 'Order placed successfully')`,
      [orderId]
    );

    await connection.commit();

    res.json({ success: true, data: { id: orderId, order_number: orderNumber } });
  } catch (error) {
    await connection.rollback();
    console.error('Create order failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Get list of orders (optionally by email)
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;
    let rows;
    if (email) {
      [rows] = await pool.execute('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [email]);
    } else {
      [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    }
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single order with items and history
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[order]] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
    const [history] = await pool.execute('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC', [id]);
    res.json({ success: true, data: { order, items, history } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stripe Webhook for payment confirmation
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_webhook_secret');
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can update your database, send confirmation emails, etc.
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 MediComp server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
