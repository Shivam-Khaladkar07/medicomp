// Order Tracking Service
export class OrderTrackingService {
    constructor() {
        this.order = null;
        this.init();
    }

    async init() {
        // Get order ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        
        if (orderId) {
            await this.loadOrder(orderId);
            this.renderOrderDetails();
            this.renderTrackingTimeline();
            this.renderOrderItems();
        } else {
            // Redirect to dashboard if no order ID
            window.location.href = 'dashboard.html';
        }
    }

    // Load order data
    async loadOrder(orderId) {
        try {
            // Load from localStorage first
            const storedOrders = JSON.parse(localStorage.getItem('medicomp-orders') || '[]');
            let order = storedOrders.find(o => o.id == orderId);
            
            // If not found in stored orders, check mock data
            if (!order) {
                const mockOrders = this.getMockOrders();
                order = mockOrders.find(o => o.id == orderId);
            }
            
            if (order) {
                this.order = order;
            } else {
                throw new Error('Order not found');
            }
        } catch (error) {
            console.error('Error loading order:', error);
            alert('Order not found. Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
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
            }
        ];
    }

    // Render order details
    renderOrderDetails() {
        if (!this.order) return;

        const formattedDate = new Date(this.order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        document.getElementById('order-number').textContent = `Order #${this.order.orderNumber}`;
        document.getElementById('order-date').textContent = `Placed on ${formattedDate}`;
        document.getElementById('order-total').textContent = `₹${this.order.totalAmount.toFixed(2)}`;
        document.getElementById('payment-status').textContent = `Payment: ${this.order.paymentStatus.charAt(0).toUpperCase() + this.order.paymentStatus.slice(1)}`;

        // Current status
        const statusConfig = this.getStatusConfig(this.order.status);
        document.getElementById('current-status').textContent = statusConfig.label;
        document.getElementById('status-description').textContent = this.getStatusDescription(this.order.status);

        // Delivery information
        document.getElementById('delivery-address').textContent = this.order.shippingAddress;
        
        // Calculate estimated delivery
        const orderDate = new Date(this.order.createdAt);
        const estimatedDelivery = new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days later
        const estimatedDeliveryFormatted = estimatedDelivery.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('estimated-delivery').textContent = `${estimatedDeliveryFormatted} by 6:00 PM`;
    }

    // Render tracking timeline
    renderTrackingTimeline() {
        if (!this.order) return;

        const timeline = document.getElementById('tracking-timeline');
        timeline.innerHTML = this.order.statusHistory.map((status, index) => {
            const isCompleted = index < this.order.statusHistory.length - 1 || this.order.status === 'delivered';
            const isCurrent = index === this.order.statusHistory.length - 1;
            const statusConfig = this.getStatusConfig(status.status);
            const formattedTime = new Date(status.timestamp).toLocaleString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center">
                            <i data-lucide="${isCompleted ? 'check' : isCurrent ? 'clock' : 'circle'}" class="w-5 h-5 text-white"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-medium text-gray-900">${statusConfig.label}</h3>
                            <span class="text-sm text-gray-500">${formattedTime}</span>
                        </div>
                        <p class="text-gray-600 mt-1">${status.notes}</p>
                        ${isCurrent && this.order.status !== 'delivered' ? `
                            <div class="mt-2">
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${this.getProgressPercentage()}%"></div>
                                </div>
                                <p class="text-sm text-gray-500 mt-1">${this.getProgressPercentage()}% complete</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Re-initialize icons
        lucide.createIcons();
    }

    // Render order items
    renderOrderItems() {
        if (!this.order) return;

        const itemsContainer = document.getElementById('order-items');
        itemsContainer.innerHTML = this.order.items.map(item => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i data-lucide="pill" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-900">${item.medicineName}</h3>
                        <p class="text-sm text-gray-600">${item.pharmacyName}</p>
                        <p class="text-sm text-gray-500">Qty: ${item.quantity} × ₹${item.unitPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">₹${item.totalPrice.toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        // Re-initialize icons
        lucide.createIcons();
    }

    // Get status configuration
    getStatusConfig(status) {
        const configs = {
            pending: { label: 'Order Placed', icon: 'clock' },
            confirmed: { label: 'Order Confirmed', icon: 'check-circle' },
            processing: { label: 'Processing', icon: 'package' },
            shipped: { label: 'Shipped', icon: 'truck' },
            delivered: { label: 'Delivered', icon: 'check-circle' },
            cancelled: { label: 'Cancelled', icon: 'x-circle' }
        };
        return configs[status] || configs.pending;
    }

    // Get status description
    getStatusDescription(status) {
        const descriptions = {
            pending: 'Your order has been placed and is being reviewed',
            confirmed: 'Your order has been confirmed by the pharmacy',
            processing: 'Your order is being prepared for shipment',
            shipped: 'Your order is on its way to you',
            delivered: 'Your order has been successfully delivered',
            cancelled: 'Your order has been cancelled'
        };
        return descriptions[status] || descriptions.pending;
    }

    // Get progress percentage
    getProgressPercentage() {
        if (!this.order) return 0;
        
        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(this.order.status);
        return Math.round((currentIndex / (statusOrder.length - 1)) * 100);
    }
}

// Initialize tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderTrackingService();
});
