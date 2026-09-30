// Razorpay payment utility

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_D7ANXcGhfhhYf1';

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

// Open Razorpay checkout
export const openRazorpayCheckout = (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Razorpay = await loadRazorpayScript();
      
      const defaultOptions = {
        key: RAZORPAY_KEY_ID,
        name: 'E-Commerce',
        description: 'Payment for Order',
        theme: {
          color: '#3399cc',
        },
        handler: (response) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new Razorpay({ ...defaultOptions, ...options });
      razorpay.open();
    } catch (error) {
      reject(error);
    }
  });
};

// Create order data for Razorpay
export const createRazorpayOrder = (amount, orderId) => {
  return {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'INR',
    receipt: `order_${orderId}_${Date.now()}`,
  };
};

// Process payment with Razorpay
export const processPayment = async (orderId, amount, onSuccess, onError) => {
  try {
    const orderData = createRazorpayOrder(amount, orderId);
    
    const result = await openRazorpayCheckout({
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'E-Commerce Payment',
      description: `Payment for Order #${orderId}`,
      order_id: orderId, // If you have a backend order ID
      prefill: {
        // Add user details if available
        // name: userName,
        // email: userEmail,
        // contact: userPhone,
      },
    });

    if (onSuccess) {
      onSuccess(result);
    }
    return result;
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

export default {
  loadRazorpayScript,
  openRazorpayCheckout,
  createRazorpayOrder,
  processPayment,
};
