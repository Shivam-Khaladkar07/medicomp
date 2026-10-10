// Dashboard Service for managing customer orders
export class DashboardService {
    constructor() {
        this.orders = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadOrders();
        this.setupEventListeners();
        this.updateStats();
        this.renderOrders();
    }

    // Load orders from localStorage (in a real app, this would be from API)
    async loadOrders() {
        try {
            const storedOrders = JSON.parse(localStorage.getItem('medicomp-orders') || '[]');
            const mockOrders = this.getMockOrders();

            // Try fetching from backend using remembered email
            let serverOrders = [];
            const email = localStorage.getItem('medicomp-user-email');
            if (email) {
                try {
                    const resp = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
                    const data = await resp.json();
                    if (data?.success && Array.isArray(data.data)) {
                        serverOrders = data.data.map(o => ({
                            id: o.id,
                            orderNumber: o.order_number,
                            status: o.order_status,
                            paymentStatus: o.payment_status,
                            paymentMethod: o.payment_method,
                            customerName: o.customer_name,
                            customerEmail: o.customer_email,
                            customerPhone: o.customer_phone,
                            shippingAddress: o.shipping_address,
                            subtotal: Number(o.subtotal),
                            taxAmount: Number(o.tax_amount),
                            deliveryFee: Number(o.delivery_fee),
                            totalAmount: Number(o.total_amount),
                            notes: o.notes,
                            createdAt: o.created_at,
                            updatedAt: o.updated_at,
                            items: [],
                            statusHistory: []
                        }));
                    }
                } catch (e) {
                    console.warn('Failed to load server orders, using local only');
                }
            }

            // Merge, preferring server then local then mock
            this.orders = [...serverOrders, ...storedOrders, ...mockOrders];

            const uniqueOrders = [];
            const seen = new Set();
            for (const o of this.orders) {
                const key = o.orderNumber || o.order_number || o.id;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueOrders.push(o);
                }
            }
            this.orders = uniqueOrders;
        } catch (error) {
            console.error('Error loading orders:', error);
            this.orders = [];
        }
    }

    // Mock data for demonstration
    getMockOrders() {
        return [
            {
                id: 1,
                orderNumber: 'ORD-2024-001',
                status: 'delivered',
                paymentStatus: 'paid',
                paymentMethod: 'Credit Card',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                customerPhone: '+91-9876543210',
                shippingAddress: '123 Main Street, Andheri West, Mumbai - 400058',
                subtotal: 150.00,
                taxAmount: 27.00,
                deliveryFee: 50.00,
                totalAmount: 227.00,
                notes: 'Please deliver after 6 PM',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-17T14:20:00Z',
                items: [
                    {
                        id: 1,
                        medicineName: 'Paracetamol 500mg',
                        pharmacyName: 'MedPlus Pharmacy',
                        quantity: 2,
                        unitPrice: 15.50,
                        totalPrice: 31.00
                    },
                    {
                        id: 2,
                        medicineName: 'Aspirin 75mg',
                        pharmacyName: 'MedPlus Pharmacy',
                        quantity: 3,
                        unitPrice: 12.00,
                        totalPrice: 36.00
                    },
                    {
                        id: 3,
                        medicineName: 'Ibuprofen 400mg',
                        pharmacyName: 'MedPlus Pharmacy',
                        quantity: 2,
                        unitPrice: 22.00,
                        totalPrice: 44.00
                    }
                ],
                statusHistory: [
                    { status: 'pending', timestamp: '2024-01-15T10:30:00Z', notes: 'Order placed successfully' },
                    { status: 'confirmed', timestamp: '2024-01-15T11:00:00Z', notes: 'Order confirmed by pharmacy' },
                    { status: 'processing', timestamp: '2024-01-15T14:00:00Z', notes: 'Order is being prepared' },
                    { status: 'shipped', timestamp: '2024-01-16T09:00:00Z', notes: 'Order shipped via courier' },
                    { status: 'delivered', timestamp: '2024-01-17T14:20:00Z', notes: 'Order delivered successfully' }
                ]
            },
            {
                id: 2,
                orderNumber: 'ORD-2024-002',
                status: 'shipped',
                paymentStatus: 'paid',
                paymentMethod: 'UPI',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                customerPhone: '+91-9876543210',
                shippingAddress: '456 Linking Road, Bandra West, Mumbai - 400050',
                subtotal: 225.00,
                taxAmount: 40.50,
                deliveryFee: 50.00,
                totalAmount: 315.50,
                notes: 'Urgent delivery required',
                createdAt: '2024-01-18T09:15:00Z',
                updatedAt: '2024-01-19T16:30:00Z',
                items: [
                    {
                        id: 4,
                        medicineName: 'Paracetamol 500mg',
                        pharmacyName: 'Apollo Pharmacy',
                        quantity: 4,
                        unitPrice: 18.00,
                        totalPrice: 72.00
                    },
                    {
                        id: 5,
                        medicineName: 'Amoxicillin 500mg',
                        pharmacyName: 'Apollo Pharmacy',
                        quantity: 2,
                        unitPrice: 48.50,
                        totalPrice: 97.00
                    },
                    {
                        id: 6,
                        medicineName: 'Metformin 500mg',
                        pharmacyName: 'Apollo Pharmacy',
                        quantity: 1,
                        unitPrice: 37.50,
                        totalPrice: 37.50
                    }
                ],
                statusHistory: [
                    { status: 'pending', timestamp: '2024-01-18T09:15:00Z', notes: 'Order placed successfully' },
                    { status: 'confirmed', timestamp: '2024-01-18T10:00:00Z', notes: 'Order confirmed by pharmacy' },
                    { status: 'processing', timestamp: '2024-01-18T14:00:00Z', notes: 'Order is being prepared' },
                    { status: 'shipped', timestamp: '2024-01-19T16:30:00Z', notes: 'Order shipped via courier' }
                ]
            },
            {
                id: 3,
                orderNumber: 'ORD-2024-003',
                status: 'processing',
                paymentStatus: 'paid',
                paymentMethod: 'Net Banking',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                customerPhone: '+91-9876543210',
                shippingAddress: '789 Juhu Tara Road, Juhu, Mumbai - 400049',
                subtotal: 180.00,
                taxAmount: 32.40,
                deliveryFee: 50.00,
                totalAmount: 262.40,
                notes: 'Regular delivery',
                createdAt: '2024-01-20T14:45:00Z',
                updatedAt: '2024-01-20T16:00:00Z',
                items: [
                    {
                        id: 7,
                        medicineName: 'Aspirin 75mg',
                        pharmacyName: 'Netmeds Pharmacy',
                        quantity: 5,
                        unitPrice: 11.75,
                        totalPrice: 58.75
                    },
                    {
                        id: 8,
                        medicineName: 'Ibuprofen 400mg',
                        pharmacyName: 'Netmeds Pharmacy',
                        quantity: 3,
                        unitPrice: 21.75,
                        totalPrice: 65.25
                    }
                ],
                statusHistory: [
                    { status: 'pending', timestamp: '2024-01-20T14:45:00Z', notes: 'Order placed successfully' },
                    { status: 'confirmed', timestamp: '2024-01-20T15:30:00Z', notes: 'Order confirmed by pharmacy' },
                    { status: 'processing', timestamp: '2024-01-20T16:00:00Z', notes: 'Order is being prepared' }
                ]
            },
            {
                id: 4,
                orderNumber: 'ORD-2024-004',
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: 'Cash on Delivery',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                customerPhone: '+91-9876543210',
                shippingAddress: '321 Hill Road, Bandra West, Mumbai - 400050',
                subtotal: 95.00,
                taxAmount: 17.10,
                deliveryFee: 50.00,
                totalAmount: 162.10,
                notes: 'COD preferred',
                createdAt: '2024-01-21T11:20:00Z',
                updatedAt: '2024-01-21T11:20:00Z',
                items: [
                    {
                        id: 9,
                        medicineName: 'Paracetamol 500mg',
                        pharmacyName: 'PharmEasy Store',
                        quantity: 3,
                        unitPrice: 17.50,
                        totalPrice: 52.50
                    },
                    {
                        id: 10,
                        medicineName: 'Aspirin 75mg',
                        pharmacyName: 'PharmEasy Store',
                        quantity: 2,
                        unitPrice: 12.25,
                        totalPrice: 24.50
                    }
                ],
                statusHistory: [
                    { status: 'pending', timestamp: '2024-01-21T11:20:00Z', notes: 'Order placed successfully' }
                ]
            }
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab filtering
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setActiveTab(e.target.dataset.tab);
            });
        });

        // Modal close
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('order-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'order-modal') {
                this.closeModal();
            }
        });
    }

    // Set active tab and filter orders
    setActiveTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });

        const activeButton = document.querySelector(`[data-tab="${tab}"]`);
        activeButton.classList.add('active', 'border-blue-500', 'text-blue-600');
        activeButton.classList.remove('border-transparent', 'text-gray-500');

        // Update filter
        this.currentFilter = tab;
        this.renderOrders();
    }

    // Update dashboard statistics
    updateStats() {
        const totalOrders = this.orders.length;
        const deliveredOrders = this.orders.filter(order => order.status === 'delivered').length;
        const shippedOrders = this.orders.filter(order => order.status === 'shipped').length;
        const processingOrders = this.orders.filter(order => order.status === 'processing').length;

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('delivered-orders').textContent = deliveredOrders;
        document.getElementById('shipped-orders').textContent = shippedOrders;
        document.getElementById('processing-orders').textContent = processingOrders;
    }

    // Render orders based on current filter
    renderOrders() {
        const container = document.getElementById('orders-container');
        const loadingState = document.getElementById('loading-state');
        const emptyState = document.getElementById('empty-state');

        // Hide loading state
        loadingState.classList.add('hidden');

        // Filter orders
        let filteredOrders = this.orders;
        if (this.currentFilter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
        }

        // Show empty state if no orders
        if (filteredOrders.length === 0) {
            emptyState.classList.remove('hidden');
            container.innerHTML = '';
            return;
        }

        // Hide empty state
        emptyState.classList.add('hidden');

        // Render orders
        container.innerHTML = filteredOrders.map(order => this.renderOrderCard(order)).join('');

        // Re-initialize icons for new content
        lucide.createIcons();
    }

    // Render individual order card
    renderOrderCard(order) {
        const statusConfig = this.getStatusConfig(order.status);
        const paymentStatusConfig = this.getPaymentStatusConfig(order.paymentStatus);
        const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${order.orderNumber}</h3>
                        <p class="text-sm text-gray-600">Placed on ${formattedDate}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}">
                            ${statusConfig.label}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig.class}">
                            ${paymentStatusConfig.label}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Items</p>
                        <p class="text-sm text-gray-900">${order.items.length} medicine(s)</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Total Amount</p>
                        <p class="text-sm text-gray-900">₹${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Payment Method</p>
                        <p class="text-sm text-gray-900">${order.paymentMethod}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button onclick="dashboardService.viewOrderDetails(${order.id})" 
                                class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            View Details
                        </button>
                        <a href="order-tracking.html?id=${order.id}" 
                           class="text-purple-600 hover:text-purple-800 font-medium text-sm">
                            Track Order
                        </a>
                        ${order.status === 'delivered' ? `
                            <button onclick="dashboardService.reorder(${order.id})" 
                                    class="text-green-600 hover:text-green-800 font-medium text-sm">
                                Reorder
                            </button>
                        ` : ''}
                        ${order.status === 'pending' ? `
                            <button onclick="dashboardService.cancelOrder(${order.id})" 
                                    class="text-red-600 hover:text-red-800 font-medium text-sm">
                                Cancel Order
                            </button>
                        ` : ''}
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-600">Delivery Address</p>
                        <p class="text-sm text-gray-900 max-w-xs truncate">${order.shippingAddress}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Get status configuration
    getStatusConfig(status) {
        const configs = {
            pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: 'Confirmed', class: 'bg-blue-100 text-blue-800' },
            processing: { label: 'Processing', class: 'bg-purple-100 text-purple-800' },
            shipped: { label: 'Shipped', class: 'bg-indigo-100 text-indigo-800' },
            delivered: { label: 'Delivered', class: 'bg-green-100 text-green-800' },
            cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-800' }
        };
        return configs[status] || configs.pending;
    }

    // Get payment status configuration
    getPaymentStatusConfig(status) {
        const configs = {
            pending: { label: 'Payment Pending', class: 'bg-yellow-100 text-yellow-800' },
            paid: { label: 'Paid', class: 'bg-green-100 text-green-800' },
            failed: { label: 'Payment Failed', class: 'bg-red-100 text-red-800' },
            refunded: { label: 'Refunded', class: 'bg-gray-100 text-gray-800' }
        };
        return configs[status] || configs.pending;
    }

    // View order details
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('order-modal');
        const modalContent = document.getElementById('modal-content');
        const modalTitle = document.getElementById('modal-title');

        modalTitle.textContent = `Order ${order.orderNumber}`;
        modalContent.innerHTML = this.renderOrderDetails(order);

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    // Render order details for modal
    renderOrderDetails(order) {
        const statusConfig = this.getStatusConfig(order.status);
        const paymentStatusConfig = this.getPaymentStatusConfig(order.paymentStatus);
        const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <!-- Order Status Timeline -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Status</h4>
                <div class="space-y-4">
                    ${order.statusHistory.map((status, index) => `
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full ${this.getStatusConfig(status.status).class} flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                </div>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">${this.getStatusConfig(status.status).label}</p>
                                <p class="text-xs text-gray-600">${new Date(status.timestamp).toLocaleString('en-IN')}</p>
                                ${status.notes ? `<p class="text-xs text-gray-500 mt-1">${status.notes}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                <div class="space-y-3">
                    ${order.items.map(item => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">${item.medicineName}</p>
                                <p class="text-sm text-gray-600">${item.pharmacyName}</p>
                                <p class="text-sm text-gray-500">Qty: ${item.quantity} × ₹${item.unitPrice.toFixed(2)}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900">₹${item.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Order Summary -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="text-gray-900">₹${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tax (18%)</span>
                        <span class="text-gray-900">₹${order.taxAmount.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Delivery Fee</span>
                        <span class="text-gray-900">₹${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div class="border-t pt-2">
                        <div class="flex justify-between font-semibold">
                            <span class="text-gray-900">Total</span>
                            <span class="text-gray-900">₹${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Information -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Name</p>
                        <p class="text-sm text-gray-900">${order.customerName}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Email</p>
                        <p class="text-sm text-gray-900">${order.customerEmail}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Phone</p>
                        <p class="text-sm text-gray-900">${order.customerPhone}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Order Date</p>
                        <p class="text-sm text-gray-900">${formattedDate}</p>
                    </div>
                </div>
            </div>

            <!-- Delivery Address -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-900">${order.shippingAddress}</p>
                </div>
            </div>

            ${order.notes ? `
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h4>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-900">${order.notes}</p>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // Close modal
    closeModal() {
        document.getElementById('order-modal').classList.add('hidden');
    }

    // Reorder functionality
    reorder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // In a real application, this would add items to cart
        alert(`Reordering items from ${order.orderNumber}. This would add items to your cart.`);
        
        // For demo purposes, redirect to main page
        window.location.href = 'main.html';
    }

    // Cancel order functionality
    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
            // In a real application, this would make an API call
            order.status = 'cancelled';
            order.updatedAt = new Date().toISOString();
            
            // Update the display
            this.updateStats();
            this.renderOrders();
            
            alert('Order cancelled successfully.');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardService = new DashboardService();
});
