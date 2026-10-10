export class CartService {
    constructor() {
        this.cart = this.loadCart();
        this.initCartIcon();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('medicomp-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('medicomp-cart', JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    // Add item to cart
    addToCart(medicine, pharmacy, price, quantity = 1) {
        console.log('Adding to cart:', { medicine, pharmacy, price, quantity });
        
        const existingItem = this.cart.find(item => 
            item.medicine.id === medicine.id && 
            item.pharmacy.id === pharmacy.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            console.log('Updated existing item quantity:', existingItem.quantity);
        } else {
            const newItem = {
                id: `${medicine.id}-${pharmacy.id}`,
                medicine: medicine,
                pharmacy: pharmacy,
                price: price,
                quantity: quantity,
                addedAt: new Date().toISOString()
            };
            this.cart.push(newItem);
            console.log('Added new item to cart:', newItem);
        }

        console.log('Current cart:', this.cart);
        this.saveCart();
        this.forceUpdateCartIcon();
        this.showAddToCartNotification(medicine.name);
    }

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartPage();
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartPage();
            }
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartPage();
    }

    // Initialize cart icon in navbar
    initCartIcon() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateCartIcon();
            });
        } else {
            this.updateCartIcon();
        }
    }

    // Update cart icon count
    updateCartIcon() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getCartItemCount();
            cartCount.textContent = count;
            cartCount.classList.toggle('hidden', count === 0);
            
            // Also update the cart icon visibility
            const cartIcon = document.getElementById('cart-icon');
            if (cartIcon) {
                cartIcon.classList.toggle('opacity-50', count === 0);
            }
        }
    }

    // Force update cart icon (useful for external calls)
    forceUpdateCartIcon() {
        setTimeout(() => this.updateCartIcon(), 100);
    }

    // Show add to cart notification
    showAddToCartNotification(medicineName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span>${medicineName} added to cart!</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize cart page
    initCartPage() {
        this.updateCartPage();
        this.setupEventListeners();
    }

    // Update cart page display
    updateCartPage() {
        const cartItems = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const subtotal = document.getElementById('subtotal');
        const tax = document.getElementById('tax');
        const total = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            checkoutBtn.disabled = true;
        } else {
            emptyCart.classList.add('hidden');
            checkoutBtn.disabled = false;
            
            cartItems.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
        }

        // Update totals
        const subtotalAmount = this.getCartTotal();
        const deliveryFee = 50;
        const taxAmount = subtotalAmount * 0.18;
        const totalAmount = subtotalAmount + deliveryFee + taxAmount;

        if (subtotal) subtotal.textContent = `₹${subtotalAmount.toFixed(2)}`;
        if (tax) tax.textContent = `₹${taxAmount.toFixed(2)}`;
        if (total) total.textContent = `₹${totalAmount.toFixed(2)}`;

        // Also update payment total on the Pay button if payment section is visible
        try {
            const paymentTotalEl = document.getElementById('payment-total');
            if (paymentTotalEl && window.stripePaymentService) {
                const paise = window.stripePaymentService.calculateTotalAmount();
                const rupees = (paise / 100).toFixed(2);
                paymentTotalEl.textContent = rupees;
            }
        } catch (e) {
            // no-op if payment module not loaded
        }
    }

    // Render individual cart item
    renderCartItem(item) {
        return `
            <div class="p-6" data-item-id="${item.id}">
                <div class="flex items-start space-x-4">
                    <!-- Medicine Image Placeholder -->
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i data-lucide="pill" class="w-8 h-8 text-blue-600"></i>
                    </div>
                    
                    <!-- Item Details -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="text-lg font-medium text-gray-900">${item.medicine.name}</h3>
                                <p class="text-sm text-gray-600">${item.medicine.genericName || 'Generic'}</p>
                                <p class="text-sm text-gray-500">${item.medicine.strength || ''} ${item.medicine.dosageForm || ''}</p>
                                <p class="text-sm text-blue-600 font-medium">${item.pharmacy.name}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-semibold text-gray-900">₹${item.price.toFixed(2)}</p>
                                <p class="text-sm text-gray-500">per unit</p>
                            </div>
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="flex items-center justify-between mt-4">
                            <div class="flex items-center space-x-2">
                                <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}" class="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <i data-lucide="minus" class="w-4 h-4 text-gray-600"></i>
                                </button>
                                <span class="w-12 text-center text-gray-900 font-medium">${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase" data-item-id="${item.id}" class="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <i data-lucide="plus" class="w-4 h-4 text-gray-600"></i>
                                </button>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <p class="text-lg font-semibold text-gray-900">
                                    ₹${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button class="remove-btn" data-item-id="${item.id}" class="text-red-600 hover:text-red-800 transition-colors">
                                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup event listeners for cart page
    setupEventListeners() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        // Quantity buttons
        cartItems.addEventListener('click', (e) => {
            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const action = btn.dataset.action;
                const itemId = btn.dataset.itemId;
                const item = this.cart.find(item => item.id === itemId);
                
                if (item) {
                    if (action === 'increase') {
                        this.updateQuantity(itemId, item.quantity + 1);
                    } else if (action === 'decrease') {
                        this.updateQuantity(itemId, item.quantity - 1);
                    }
                }
            }
            
            // Remove button
            if (e.target.closest('.remove-btn')) {
                const btn = e.target.closest('.remove-btn');
                const itemId = btn.dataset.itemId;
                this.removeFromCart(itemId);
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckout();
            });
        }
    }

    // Handle checkout process
    handleCheckout() {
        if (this.cart.length === 0) return;
        
        // Show payment section instead of direct checkout
        if (window.simplePaymentService) {
            window.simplePaymentService.showPaymentSection();
        } else if (window.stripePaymentService) {
            // Backward compatibility if Stripe still present
            window.stripePaymentService.showPaymentSection();
        } else {
            // Fallback for demo purposes
            this.createOrderFromCart();
        }
    }

    // Create order from cart items (for demo purposes)
    createOrderFromCart() {
        if (this.cart.length === 0) return;

        // Generate order number
        const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        
        // Calculate totals
        const subtotal = this.getCartTotal();
        const deliveryFee = 50;
        const taxAmount = subtotal * 0.18;
        const totalAmount = subtotal + deliveryFee + taxAmount;

        // Create order object
        const order = {
            id: Date.now(),
            orderNumber: orderNumber,
            status: 'pending',
            paymentStatus: 'paid',
            paymentMethod: 'Demo Payment',
            customerName: 'John Doe', // In real app, get from user profile
            customerEmail: 'john.doe@email.com',
            customerPhone: '+91-9876543210',
            shippingAddress: '123 Main Street, Andheri West, Mumbai - 400058', // In real app, get from form
            subtotal: subtotal,
            taxAmount: taxAmount,
            deliveryFee: deliveryFee,
            totalAmount: totalAmount,
            notes: 'Demo order created from cart',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: this.cart.map(item => ({
                id: item.id,
                medicineName: item.medicine.name,
                pharmacyName: item.pharmacy.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity
            })),
            statusHistory: [
                {
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    notes: 'Order placed successfully'
                }
            ]
        };

        // Store order in localStorage (in real app, send to backend)
        this.saveOrderToStorage(order);

        // Clear cart
        this.clearCart();

        // Show success message and redirect to dashboard
        alert(`Order ${orderNumber} placed successfully! Redirecting to your dashboard...`);
        window.location.href = 'dashboard.html';
    }

    // Save order to localStorage (for demo purposes)
    saveOrderToStorage(order) {
        const existingOrders = JSON.parse(localStorage.getItem('medicomp-orders') || '[]');
        existingOrders.unshift(order); // Add to beginning of array
        localStorage.setItem('medicomp-orders', JSON.stringify(existingOrders));
    }
}
