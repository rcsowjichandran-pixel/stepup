import React, { useCallback, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DELIVERY_STORAGE_KEY = 'stepup_last_delivery';
const CASH_ON_DELIVERY = 'Cash on Delivery';
const RAZORPAY = 'Razorpay';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Razorpay Checkout.'));
    document.body.appendChild(script);
  });
}

function getDeliveryStorageKey(user) {
  const accountId = user?.id ?? user?.email ?? user?.username;
  return accountId
    ? `${DELIVERY_STORAGE_KEY}_${encodeURIComponent(String(accountId).toLowerCase())}`
    : null;
}

const emptyDelivery = (user) => ({
  fullName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : '',
  email: user?.email || '',
  phone: '',
  address: '',
  city: 'Bangalore',
  state: 'Karnataka',
  postalCode: '560103',
  paymentMethod: CASH_ON_DELIVERY,
});

function readSavedDelivery(storageKey) {
  if (!storageKey) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (
      saved &&
      ['fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode']
        .every((field) => typeof saved[field] === 'string' && saved[field].trim())
    ) {
      return saved;
    }
  } catch (error) {
    console.error('Could not read the saved delivery address.', error);
  }
  return null;
}

function addBusinessDays(startDate, businessDays) {
  const date = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) daysAdded += 1;
  }

  return date;
}

function getEstimatedDeliveryRange(orderDate) {
  const formatDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const earliestDate = addBusinessDays(orderDate, 2);
  const latestDate = addBusinessDays(orderDate, 4);
  return `${formatDate.format(earliestDate)} – ${formatDate.format(latestDate)}`;
}

export default function CheckoutModal({
  onClose,
  onOrderComplete,
  selectedPaymentMethod = CASH_ON_DELIVERY,
}) {
  const { cartItems, grandTotal, discountAmount, coupon, clearCart } = useCart();
  const { user, token } = useAuth();
  const [deliveryStorageKey] = useState(() => getDeliveryStorageKey(user));
  const [savedDelivery] = useState(() => readSavedDelivery(deliveryStorageKey));
  const [formData, setFormData] = useState(() => {
    return {
      ...emptyDelivery(user),
      ...savedDelivery,
      paymentMethod: selectedPaymentMethod,
    };
  });
  const [hasSavedDelivery] = useState(() => Boolean(savedDelivery));
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [deliverySaveError, setDeliverySaveError] = useState(false);

  const placeOrder = useCallback(async (paymentMethod = formData.paymentMethod) => {
    if (loading || !cartItems.length) return;

    setLoading(true);
    setError(null);

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
      total_amount: grandTotal,
      discount_amount: discountAmount,
      payment_method: paymentMethod,
      coupon_code: coupon?.code || '',
      cart_items: cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
    };

    try {
      const response = await api.checkout(payload, token);
      let paymentStatus = response.payment_status;

      if (paymentMethod === RAZORPAY) {
        await loadRazorpay();
        const paymentResponse = await new Promise((resolve, reject) => {
          const checkout = new window.Razorpay({
            key: response.razorpay_key_id,
            amount: response.amount,
            currency: response.currency,
            name: 'StepUp',
            description: `Order #${response.order_id}`,
            order_id: response.razorpay_order_id,
            prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
            theme: { color: '#2F4F4F' },
            handler: resolve,
            modal: { ondismiss: () => reject(new Error('Payment was cancelled. You can try again.')) },
          });
          checkout.on('payment.failed', (failure) => {
            reject(new Error(failure.error?.description || 'Payment failed. Please try again.'));
          });
          checkout.open();
        });
        const verification = await api.verifyPayment({
          order_id: response.order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        });
        paymentStatus = verification.payment_status;
      }
      try {
        if (deliveryStorageKey) {
          localStorage.setItem(deliveryStorageKey, JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          }));
        }
        setDeliverySaveError(false);
      } catch (storageError) {
        console.error('Order placed, but the delivery address could not be saved.', storageError);
        setDeliverySaveError(true);
      }
      setOrderSuccess({
        orderId: response.order_id,
        total: Number(response.total_amount),
        paymentStatus,
        paymentMethod: response.payment_method,
        estimatedDelivery: getEstimatedDeliveryRange(new Date()),
      });
      if (paymentMethod === CASH_ON_DELIVERY || paymentStatus === 'Paid') clearCart();
    } catch (checkoutError) {
      setError(checkoutError.message || 'Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cartItems, clearCart, coupon, deliveryStorageKey, discountAmount, formData, grandTotal, loading, token]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleShippingSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setStep('payment');
  };

  const hasDeliveryDetails = [
    'fullName',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'postalCode',
  ].every((field) => formData[field].trim());
  const paymentIsPending = orderSuccess?.paymentStatus === 'Pending';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(3px)',
      zIndex: 350,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close checkout"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666666',
          }}
        >
          <X size={20} />
        </button>

        {orderSuccess ? (
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '22px',
              color: '#2F4F4F',
              marginBottom: '8px',
            }}>
              Order placed
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '20px' }}>
              Your order is registered. {orderSuccess.paymentMethod === CASH_ON_DELIVERY
                ? 'Payment is due on delivery.'
                : paymentIsPending
                  ? 'Payment is still pending; no online payment was collected.'
                  : 'Payment has been received.'}
            </p>
            {deliverySaveError && (
              <p role="alert" style={{ fontSize: '12px', color: '#9A6700', marginBottom: '12px' }}>
                Your order was placed, but we could not save this address for next time.
              </p>
            )}
            <div style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px',
              textAlign: 'left',
              fontSize: '13px',
              lineHeight: '1.8',
            }}>
              <div><b>Order ID:</b> #{orderSuccess.orderId}</div>
              <div><b>Order total:</b> ₹{orderSuccess.total.toLocaleString()}</div>
              <div><b>Payment method:</b> {orderSuccess.paymentMethod}</div>
              <div><b>Payment status:</b> {orderSuccess.paymentStatus}</div>
              <div><b>Delivery address:</b> {formData.address}, {formData.city} - {formData.postalCode}</div>
              <div><b>Estimated delivery:</b> {orderSuccess.estimatedDelivery}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOrderComplete?.();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : loading ? (
          <div style={{ padding: '52px 32px', textAlign: 'center', color: '#2F4F4F' }}>
            <Lock size={28} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '20px' }}>
              Placing your order
            </h3>
            <p style={{ fontSize: '13px', color: '#666666' }}>
              {hasSavedDelivery
                ? 'Using the delivery address from your previous order.'
                : 'Please wait while we confirm your order.'}
            </p>
          </div>
        ) : step === 'payment' ? (
          <div style={{ padding: '32px 28px' }}>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: 0,
                background: 'none',
                color: '#2F4F4F',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '16px',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h3 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '21px',
              color: '#2F4F4F',
              marginBottom: '6px',
            }}>
              Payment
            </h3>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '18px' }}>
              Choose your payment option for ₹{grandTotal.toLocaleString()}.
            </p>

            <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
              {[CASH_ON_DELIVERY, RAZORPAY].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, paymentMethod: method }))}
                  aria-pressed={formData.paymentMethod === method}
                  style={{
                    padding: '11px 14px',
                    textAlign: 'left',
                    background: formData.paymentMethod === method ? '#EDF3F3' : '#FFFFFF',
                    border: `1px solid ${formData.paymentMethod === method ? '#2F4F4F' : '#CBD5E1'}`,
                    borderRadius: '6px',
                    color: '#2F4F4F',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {method === 'UPI' ? (
                    <img
                      src="/images/payment-upi.svg"
                      alt="UPI"
                      style={{ display: 'block', width: '48px', height: '24px', margin: '0 auto' }}
                    />
                  ) : method === 'Google Pay' ? (
                    <img
                      src="/images/payment-gpay.svg"
                      alt="Google Pay"
                      style={{ display: 'block', width: '70px', height: '24px', margin: '0 auto' }}
                    />
                  ) : (
                    method
                  )}
                </button>
              ))}
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: formData.paymentMethod === CASH_ON_DELIVERY ? '#E8F5E9' : '#FFF8E1',
              color: formData.paymentMethod === CASH_ON_DELIVERY ? '#2E7D32' : '#6D5310',
              fontSize: '12px',
              lineHeight: 1.5,
              marginBottom: '16px',
            }}>
              {formData.paymentMethod === CASH_ON_DELIVERY
                ? 'Pay the delivery partner when your order arrives.'
                : 'Pay securely using the payment methods enabled in Razorpay Checkout.'}
            </div>

            <div style={{
              padding: '12px',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              color: '#555555',
              fontSize: '12px',
              lineHeight: 1.6,
              marginBottom: '18px',
            }}>
              {hasDeliveryDetails ? (
                <>
                  <b>Delivering to:</b> {formData.fullName}<br />
                  {formData.address}, {formData.city}, {formData.state} {formData.postalCode}<br />
                  {formData.phone}
                </>
              ) : (
                <span>Add delivery details before placing your order.</span>
              )}
              {hasDeliveryDetails && (
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  style={{
                    display: 'block',
                    border: 0,
                    background: 'none',
                    padding: '8px 0 0',
                    color: '#2F4F4F',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Change delivery details
                </button>
              )}
              {!hasDeliveryDetails && (
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  style={{
                    display: 'block',
                    border: 0,
                    background: 'none',
                    padding: '8px 0 0',
                    color: '#2F4F4F',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Add delivery details
                </button>
              )}
            </div>

            {error && (
              <div role="alert" style={{
                padding: '9px 12px',
                backgroundColor: '#FFEBEE',
                color: '#C62828',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '14px',
              }}>
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={loading || !hasDeliveryDetails}
              onClick={() => void placeOrder()}
              style={{
                width: '100%',
                backgroundColor: '#2F4F4F',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {formData.paymentMethod === CASH_ON_DELIVERY
                ? `Place Order · Cash on Delivery · ₹${grandTotal.toLocaleString()}`
                : `Pay with Razorpay · ₹${grandTotal.toLocaleString()}`}
            </button>
          </div>
        ) : (
          <div style={{ padding: '28px' }}>
            <h3 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '20px',
              color: '#2F4F4F',
              marginBottom: '4px',
            }}>
              {hasSavedDelivery ? 'Confirm delivery details' : 'Shipping & Checkout'}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '20px' }}>
              Order total: <b style={{ color: '#2F4F4F' }}>₹{grandTotal.toLocaleString()}</b>
            </p>
            {error && (
              <div role="alert" style={{
                padding: '8px 12px',
                backgroundColor: '#FFEBEE',
                color: '#C62828',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '14px',
              }}>
                {error}
              </div>
            )}
            <form onSubmit={handleShippingSubmit}>
              {[
                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Rohan Sharma' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
                { name: 'address', label: 'Delivery Address', type: 'textarea', placeholder: 'House/Flat No, Street, Landmark' },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'postalCode', label: 'Pincode', type: 'text' },
              ].map(({ name, label, type, placeholder }) => (
                <label key={name} style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '12px',
                }}>
                  {label} *
                  {type === 'textarea' ? (
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      rows={2}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginTop: '4px',
                      }}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginTop: '4px',
                      }}
                    />
                  )}
                </label>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#2F4F4F',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continue to Payment Options · ₹{grandTotal.toLocaleString()}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
