export class SimplePaymentService {
    constructor() {}

    calculateTotals() {
        const cartService = window.cartService;
        const subtotal = cartService ? cartService.getCartTotal() : 0;
        const deliveryFee = 50;
        const taxAmount = subtotal * 0.18;
        const totalAmount = subtotal + deliveryFee + taxAmount;
        return { subtotal, deliveryFee, taxAmount, totalAmount };
    }

    showPaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (!paymentSection) return;
        paymentSection.classList.remove('hidden');
        if (checkoutBtn) checkoutBtn.classList.add('hidden');
        const paymentTotal = document.getElementById('payment-total');
        const { totalAmount } = this.calculateTotals();
        if (paymentTotal) paymentTotal.textContent = totalAmount.toFixed(2);
    }

    hidePaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (!paymentSection) return;
        paymentSection.classList.add('hidden');
        if (checkoutBtn) checkoutBtn.classList.remove('hidden');
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.showPaymentSection());
        }

        const cancelBtn = document.getElementById('cancel-payment');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hidePaymentSection());
        }

        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
        }

        // Switch visible method fields
        const methodRadios = document.querySelectorAll('input[name="payment-method"]');
        methodRadios.forEach(r => {
            r.addEventListener('change', () => this.updateMethodVisibility());
        });

        this.updateMethodVisibility();
        this.setupBillHandlers();
    }

    setupQRUpload() {
        const uploadInput = document.getElementById('qr-upload');
        const qrImage = document.getElementById('qr-image');
        const qrPlaceholder = document.getElementById('qr-placeholder');
        
        if (uploadInput && !uploadInput.__bound) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        qrImage.src = event.target.result;
                        qrImage.classList.remove('hidden');
                        qrPlaceholder.classList.add('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
            uploadInput.__bound = true;
        }
    }

    updateMethodVisibility() {
        const method = this.getSelectedMethod();
        const upi = document.getElementById('method-upi');
        const card = document.getElementById('method-card');
        const qr = document.getElementById('method-qr');
        if (upi) upi.classList.toggle('hidden', method !== 'upi');
        if (card) card.classList.toggle('hidden', method !== 'card');
        if (qr) {
            qr.classList.toggle('hidden', method !== 'qr');
            if (method === 'qr') {
                // Update amount display
                const amountEl = document.getElementById('qr-amount');
                const { totalAmount } = this.calculateTotals();
                if (amountEl) amountEl.textContent = totalAmount.toFixed(2);
                
                // Setup QR upload handler if not already done
                this.setupQRUpload();
            }
        }
    }

    getSelectedMethod() {
        const selected = document.querySelector('input[name="payment-method"]:checked');
        return selected ? selected.value : 'upi';
    }

    async handlePayment(event) {
        event.preventDefault();
        const payButton = document.getElementById('pay-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        if (payButton && buttonText && spinner) {
            payButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');
        }

        // Minimal validation per method
        const method = this.getSelectedMethod();
        try {
            if (method === 'upi') {
                const vpa = document.getElementById('upi-vpa')?.value?.trim();
                if (!vpa) throw new Error('Please enter your UPI ID (VPA).');
            } else if (method === 'card') {
                const number = document.getElementById('card-number')?.value?.replace(/\s+/g, '');
                const name = document.getElementById('cardholder-name')?.value?.trim();
                const expiry = document.getElementById('card-expiry')?.value?.trim();
                const cvc = document.getElementById('card-cvc')?.value?.trim();
                if (!number || number.length < 12 || !name || !expiry || !cvc) {
                    throw new Error('Please complete your card details.');
                }
            } else if (method === 'qr') {
                // Assume user will scan and pay; no extra inputs to validate
            }

            // Simulate processing delay
            await new Promise(res => setTimeout(res, 800));

            // Build a mock payment object similar to Stripe's for reuse
            const paymentIntent = {
                id: `SIMPLE_${Date.now()}`,
                status: 'succeeded',
                method: method
            };
            await this.handlePaymentSuccess(paymentIntent);
        } catch (error) {
            this.showError(error.message || 'Payment failed. Please try again.');
        } finally {
            if (payButton && buttonText && spinner) {
                payButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        }
    }

    async handlePaymentSuccess(paymentIntent) {
        const name = document.getElementById('cardholder-name')?.value || 'Customer';
        const email = document.getElementById('payer-email')?.value || document.getElementById('cardholder-email')?.value || '';
        if (email) localStorage.setItem('medicomp-user-email', email);

        // Persist order (local only)
        try {
            const cartService = window.cartService;
            if (cartService && Array.isArray(cartService.cart) && cartService.cart.length > 0) {
                const { subtotal, deliveryFee, taxAmount, totalAmount } = this.calculateTotals();
                const order = {
                    id: Date.now(),
                    orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
                    status: 'pending',
                    paymentStatus: 'paid',
                    paymentMethod: paymentIntent.method,
                    customerName: name,
                    customerEmail: email || 'unknown@example.com',
                    customerPhone: '',
                    shippingAddress: 'Address provided during checkout',
                    subtotal, taxAmount, deliveryFee, totalAmount,
                    notes: `Simple payment ${paymentIntent.id}`,
                    items: cartService.cart.map(item => ({
                        id: item.id,
                        medicineName: item.medicine?.name || 'Medicine',
                        pharmacyName: item.pharmacy?.name || 'Pharmacy',
                        quantity: item.quantity,
                        unitPrice: item.price,
                        totalPrice: item.price * item.quantity
                    })),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const existing = JSON.parse(localStorage.getItem('medicomp-orders') || '[]');
                existing.unshift(order);
                localStorage.setItem('medicomp-orders', JSON.stringify(existing));
            }
        } catch (_) {}

        this.showSuccess('Payment successful! Your order has been placed.');
        this.showBillModal(paymentIntent);
        if (window.cartService) window.cartService.clearCart();
        this.hidePaymentSection();
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="x-circle" class="w-5 h-5"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.remove('translate-x-full'); }, 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
        }, 5000);
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.remove('translate-x-full'); }, 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
        }, 5000);
    }

    // Bill helpers (duplicated from Stripe service to keep isolated)
    formatCurrency(amount) {
        try { return `₹${Number(amount).toFixed(2)}`; } catch (_) { return `₹${amount}`; }
    }

    buildBillHtml(paymentIntent) {
        const cartService = window.cartService;
        const items = Array.isArray(cartService?.cart) ? cartService.cart : [];
        const { subtotal, deliveryFee, taxAmount, totalAmount } = this.calculateTotals();
        const customerName = document.getElementById('cardholder-name')?.value || 'Customer';
        const customerEmail = document.getElementById('payer-email')?.value || document.getElementById('cardholder-email')?.value || '';
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
    }

    showBillModal(paymentIntent) {
        const modal = document.getElementById('bill-modal');
        const content = document.getElementById('bill-content');
        if (!modal || !content) return;
        content.innerHTML = this.buildBillHtml(paymentIntent);
        modal.classList.remove('hidden');
        try { if (window.lucide) window.lucide.createIcons(); } catch (_) {}
        this.setupBillHandlers();
    }

    setupBillHandlers() {
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
            downloadBtn.addEventListener('click', doPrint); // Save as PDF via print dialog
            downloadBtn.__bound = true;
        }
    }
}


