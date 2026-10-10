export class StripePaymentService {
    constructor() {
        // Use test publishable key - replace with your actual key
        this.stripe = Stripe('pk_test_51234567890abcdef'); // Replace with your actual publishable key
        this.elements = null;
        this.cardElement = null;
        this.clientSecret = null;
    }

    // Initialize Stripe Elements
    async initializeElements() {
        try {
            // Create payment intent on the server
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: this.calculateTotalAmount(),
                    currency: 'inr'
                })
            });

            const { client_secret } = await response.json();
            this.clientSecret = client_secret;

            // Create Elements instance
            this.elements = this.stripe.elements({
                clientSecret: this.clientSecret
            });

            // Create card element
            this.cardElement = this.elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            });

            // Mount the card element
            this.cardElement.mount('#card-element');

            // Handle real-time validation errors from the card Element
            this.cardElement.on('change', ({ error }) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });

        } catch (error) {
            console.error('Error initializing Stripe:', error);
            this.showError('Failed to initialize payment system. Please try again.');
        }
    }

    // Calculate total amount for payment
    calculateTotalAmount() {
        const cartService = window.cartService;
        if (!cartService) return 0;

        const subtotal = cartService.getCartTotal();
        const deliveryFee = 50;
        const tax = subtotal * 0.18;
        const total = subtotal + deliveryFee + tax;

        // Convert to paise (Stripe expects amount in smallest currency unit)
        return Math.round(total * 100);
    }

    // Handle payment form submission
    async handlePayment(event) {
        event.preventDefault();

        const payButton = document.getElementById('pay-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');

        // Show loading state
        payButton.disabled = true;
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');

        try {
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(
                this.clientSecret,
                {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: {
                            name: document.getElementById('cardholder-name').value,
                            email: document.getElementById('cardholder-email').value,
                        },
                    }
                }
            );

            if (error) {
                this.showError(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                this.handlePaymentSuccess(paymentIntent);
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showError('An unexpected error occurred. Please try again.');
        } finally {
            // Reset button state
            payButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    // Handle successful payment
    async handlePaymentSuccess(paymentIntent) {
        console.log('Payment succeeded:', paymentIntent);

        try {
            const cartService = window.cartService;
            const name = document.getElementById('cardholder-name')?.value || 'Customer';
            const email = document.getElementById('cardholder-email')?.value || '';
            if (email) {
                localStorage.setItem('medicomp-user-email', email);
            }

            if (cartService && Array.isArray(cartService.cart) && cartService.cart.length > 0) {
                const subtotal = cartService.getCartTotal();
                const deliveryFee = 50;
                const taxAmount = subtotal * 0.18;
                const totalAmount = subtotal + deliveryFee + taxAmount;

                const orderPayload = {
                    customer_name: name,
                    customer_email: email || 'unknown@example.com',
                    customer_phone: '',
                    shipping_address: 'Address provided during checkout',
                    billing_address: '',
                    payment_status: 'paid',
                    payment_method: 'Card',
                    subtotal: Number(subtotal.toFixed(2)),
                    tax_amount: Number(taxAmount.toFixed(2)),
                    delivery_fee: Number(deliveryFee.toFixed(2)),
                    total_amount: Number(totalAmount.toFixed(2)),
                    notes: `Stripe PaymentIntent ${paymentIntent.id}`,
                    items: cartService.cart.map(item => ({
                        medicine_id: item.medicine?.id || null,
                        pharmacy_id: item.pharmacy?.id || null,
                        medicine_name: item.medicine?.name || 'Medicine',
                        pharmacy_name: item.pharmacy?.name || 'Pharmacy',
                        quantity: item.quantity,
                        unit_price: Number(item.price.toFixed(2)),
                        total_price: Number((item.price * item.quantity).toFixed(2))
                    }))
                };

                try {
                    await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderPayload)
                    });
                } catch (e) {
                    console.warn('Order persistence failed, continuing with local flow', e);
                }
            }
        } catch (err) {
            console.warn('Failed constructing order payload:', err);
        }

        // Show success message
        this.showSuccess('Payment successful! Your order has been placed.');

        // Show bill modal
		this.showBillModal(paymentIntent);

        // Clear cart
        if (window.cartService) {
            window.cartService.clearCart();
        }

        // Hide payment section
        this.hidePaymentSection();
    }

    // Show payment section
    showPaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (paymentSection) {
            paymentSection.classList.remove('hidden');
            checkoutBtn.classList.add('hidden');
            
            // Update payment total
            const paymentTotal = document.getElementById('payment-total');
            if (paymentTotal && window.cartService) {
                const total = this.calculateTotalAmount() / 100;
                paymentTotal.textContent = total.toFixed(2);
            }
            
            // Initialize Stripe Elements if not already done
            if (!this.elements) {
                this.initializeElements();
            }
        }
    }

    // Hide payment section
    hidePaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (paymentSection) {
            paymentSection.classList.add('hidden');
            checkoutBtn.classList.remove('hidden');
        }
    }

    // Show error message
    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="x-circle" class="w-5 h-5"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Show success message
    showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showPaymentSection();
            });
        }

        // Cancel payment button
        const cancelBtn = document.getElementById('cancel-payment');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hidePaymentSection();
            });
        }

        // Payment form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                this.handlePayment(e);
            });
        }

		// Bill modal handlers (in case modal exists on page)
		this.setupBillHandlers();
    }
}


// Bill/Invoice helpers
StripePaymentService.prototype.formatCurrency = function(amount) {
	try {
		return `₹${Number(amount).toFixed(2)}`;
	} catch (_) {
		return `₹${amount}`;
	}
};

StripePaymentService.prototype.buildBillHtml = function(paymentIntent) {
	const cartService = window.cartService;
	const items = Array.isArray(cartService?.cart) ? cartService.cart : [];
	const subtotal = cartService ? cartService.getCartTotal() : 0;
	const deliveryFee = 50;
	const taxAmount = subtotal * 0.18;
	const totalAmount = subtotal + deliveryFee + taxAmount;

	const customerName = document.getElementById('cardholder-name')?.value || 'Customer';
	const customerEmail = document.getElementById('cardholder-email')?.value || '';

	const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
	const paidOn = new Date().toLocaleString();

	const itemsRows = items.map(item => `
		<tr>
			<td class="py-2">${item.medicine?.name || 'Medicine'}</td>
			<td class="py-2">${item.pharmacy?.name || 'Pharmacy'}</td>
			<td class="py-2 text-center">${item.quantity}</td>
			<td class="py-2 text-right">${this.formatCurrency(item.price)}</td>
			<td class="py-2 text-right">${this.formatCurrency(item.price * item.quantity)}</td>
		</tr>
	`).join('');

	return `
		<div class="space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Order No.</p>
					<p class="font-semibold text-gray-900">${orderNumber}</p>
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-500">Payment ID</p>
					<p class="font-mono text-gray-900">${paymentIntent?.id || '-'}</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-gray-500">Billed To</p>
					<p class="font-semibold text-gray-900">${customerName}</p>
					${customerEmail ? `<p class="text-sm text-gray-700">${customerEmail}</p>` : ''}
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-500">Date</p>
					<p class="font-semibold text-gray-900">${paidOn}</p>
				</div>
			</div>

			<table class="w-full text-sm border-t border-b border-gray-200">
				<thead class="text-gray-600">
					<tr>
						<th class="py-2 text-left">Item</th>
						<th class="py-2 text-left">Pharmacy</th>
						<th class="py-2 text-center">Qty</th>
						<th class="py-2 text-right">Price</th>
						<th class="py-2 text-right">Total</th>
					</tr>
				</thead>
				<tbody>
					${itemsRows || '<tr><td colspan="5" class="py-4 text-center text-gray-500">No items</td></tr>'}
				</tbody>
			</table>

			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-600">Subtotal</span>
					<span class="font-medium">${this.formatCurrency(subtotal)}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-gray-600">Delivery Fee</span>
					<span class="font-medium">${this.formatCurrency(deliveryFee)}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-gray-600">Tax (18% GST)</span>
					<span class="font-medium">${this.formatCurrency(taxAmount)}</span>
				</div>
				<hr class="border-gray-200">
				<div class="flex justify-between text-lg font-bold">
					<span>Total</span>
					<span class="text-blue-600">${this.formatCurrency(totalAmount)}</span>
				</div>
			</div>
		</div>
	`;
};

StripePaymentService.prototype.showBillModal = function(paymentIntent) {
	const modal = document.getElementById('bill-modal');
	const content = document.getElementById('bill-content');
	if (!modal || !content) return;

	content.innerHTML = this.buildBillHtml(paymentIntent);
	modal.classList.remove('hidden');

	// Refresh icons if library available
	try { if (window.lucide) { window.lucide.createIcons(); } } catch (_) {}

	// Ensure handlers bound
	this.setupBillHandlers();
};

StripePaymentService.prototype.setupBillHandlers = function() {
	const modal = document.getElementById('bill-modal');
	if (!modal) return;

	const closeBtn = document.getElementById('close-bill-modal');
	const printBtn = document.getElementById('print-bill');
	const downloadBtn = document.getElementById('download-bill');

	if (closeBtn && !closeBtn.__bound) {
		closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
		closeBtn.__bound = true;
	}

	const doPrint = () => {
		const content = document.getElementById('bill-content');
		if (!content) return;
		const printWindow = window.open('', '_blank');
		if (!printWindow) return;
		printWindow.document.write(`<!DOCTYPE html><html><head><title>Bill</title><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css\"></head><body class=\"p-6\">${content.innerHTML}</body></html>`);
		printWindow.document.close();
		printWindow.focus();
		printWindow.onload = () => printWindow.print();
	};

	if (printBtn && !printBtn.__bound) {
		printBtn.addEventListener('click', doPrint);
		printBtn.__bound = true;
	}

	if (downloadBtn && !downloadBtn.__bound) {
		// Trigger print dialog to allow "Save as PDF"
		downloadBtn.addEventListener('click', doPrint);
		downloadBtn.__bound = true;
	}
};

