'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/data';
import { CartItem } from '@/components/CartDrawer';
import { X, CheckCircle, Truck, Phone, MapPin, User, ShoppingBag, CreditCard, Wallet } from 'lucide-react';

interface QuickOrderModalProps {
  product?: Product | null;
  cartItems?: CartItem[] | null;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export default function QuickOrderModal({ product, cartItems, onClose, onOrderCreated }: QuickOrderModalProps) {
  const isCartMode = Array.isArray(cartItems) && cartItems.length > 0;
  if (!isCartMode && !product) return null;

  const targetProduct = product || (isCartMode ? cartItems![0].product : null);

  // Selected variant state for single product mode
  const initialVariant = targetProduct?.variants && targetProduct.variants.length > 0
    ? targetProduct.variants.map(v => v.options[0]).join(' / ')
    : '';

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryFee = deliveryZone === 'outside_dhaka' ? 130 : 70;
  
  const subtotal = isCartMode
    ? cartItems!.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    : (targetProduct ? targetProduct.price * quantity : 0);
    
  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please enter your full name, mobile number and address.');
      return;
    }

    if (phone.length < 11) {
      setErrorMsg('Please enter a valid 11-digit mobile number.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const itemsPayload = isCartMode
        ? cartItems!.map(item => ({
            productId: item.product.id,
            productTitle: item.product.title,
            productImage: item.product.images[0] || '',
            price: item.product.price,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant || undefined
          }))
        : targetProduct ? [
            {
              productId: targetProduct.id,
              productTitle: targetProduct.title,
              productImage: targetProduct.images[0] || '',
              price: targetProduct.price,
              quantity,
              selectedVariant: selectedVariant || undefined
            }
          ] : [];

      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        deliveryZone,
        paymentMethod,
        transactionId: transactionId.trim(),
        notes: notes.trim(),
        items: itemsPayload
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      const data = await res.json();
      setCreatedOrder(data);
      if (onOrderCreated) onOrderCreated();
    } catch (err: any) {
      setErrorMsg('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-pink-100 animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} />
            <h2 className="font-bold text-base sm:text-lg">Place Your Order</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors flex items-center justify-center"
            title="Close / Cancel Order"
          >
            <X size={20} />
          </button>
        </div>

        {/* If Order Successful */}
        {createdOrder ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-sm text-gray-600">
              Thank you <b>{createdOrder.customerName}</b>! Your order is being processed.
            </p>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left space-y-1 text-xs sm:text-sm">
              <p><b>Order ID:</b> <span className="text-pink-600 font-bold">{createdOrder.orderNumber}</span></p>
              <p><b>Items Ordered:</b> {isCartMode ? `${cartItems!.length} item(s)` : targetProduct?.title}</p>
              <p><b>Total Amount:</b> <span className="font-bold text-slate-900">৳{createdOrder.totalAmount}</span></p>
              <p><b>Mobile:</b> {createdOrder.phone}</p>
              <p><b>Shipping Address:</b> {createdOrder.address}</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/8801858931317?text=${encodeURIComponent(`Hello KUN! I just placed order ${createdOrder.orderNumber}. Total: ৳${createdOrder.totalAmount}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs sm:text-sm"
              >
                <span>Confirm Order via WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-left overflow-y-auto flex-1">

            {/* Selected Product / Cart Items Summary Box */}
            {isCartMode ? (
              <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50/80">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Order Items ({cartItems!.length}):
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {cartItems!.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-gray-100">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                        alt={item.product.title}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="font-semibold text-gray-800 truncate">{item.product.title}</div>
                        <div className="text-[11px] text-gray-500">
                          Qty: <span className="font-bold text-slate-900">{item.quantity}</span> x ৳{item.product.price}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-pink-600">
                        ৳{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : targetProduct ? (
              <>
                <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <img
                    src={targetProduct.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                    alt={targetProduct.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2">{targetProduct.title}</h4>
                    <div className="text-pink-600 font-bold text-sm mt-1">৳{targetProduct.price}</div>
                  </div>
                </div>

                {/* Variant Selector */}
                {targetProduct.variants && targetProduct.variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Select Variant:
                    </label>
                    {targetProduct.variants.map((v, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-xs text-gray-500 font-medium">{v.name}:</span>
                        <div className="flex flex-wrap gap-2">
                          {v.options.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setSelectedVariant(option)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
                                selectedVariant.includes(option)
                                  ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                  <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 font-bold hover:bg-gray-200 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold text-sm text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 font-bold hover:bg-gray-200 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {/* Customer Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <User size={14} className="text-amber-500" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone size={14} className="text-amber-500" />
                  <span>Mobile Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 11-digit mobile number..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin size={14} className="text-amber-500" />
                  <span>Full Shipping Address *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat no, Street, Area, City..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Truck size={14} className="text-amber-500" />
                  <span>Delivery Zone *</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex flex-col items-center justify-center transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      value="inside_dhaka"
                      checked={deliveryZone === 'inside_dhaka'}
                      onChange={() => setDeliveryZone('inside_dhaka')}
                      className="sr-only"
                    />
                    <span>Inside Dhaka</span>
                    <span className="text-[11px] font-bold text-pink-600 mt-0.5">৳70</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex flex-col items-center justify-center transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      value="outside_dhaka"
                      checked={deliveryZone === 'outside_dhaka'}
                      onChange={() => setDeliveryZone('outside_dhaka')}
                      className="sr-only"
                    />
                    <span>Outside Dhaka</span>
                    <span className="text-[11px] font-bold text-pink-600 mt-0.5">৳130</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Wallet size={14} className="text-amber-500" />
                  <span>Payment Method *</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
                      {paymentMethod === 'cod' && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">Cash on Delivery</span>
                      <span className="text-[10px] text-gray-500 font-normal">Pay upon receipt</span>
                    </div>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-50 text-pink-900 ring-2 ring-pink-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-pink-500 flex items-center justify-center shrink-0">
                      {paymentMethod === 'bkash' && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-pink-700">bKash</span>
                      <span className="text-[10px] text-gray-500 font-normal">Send Money / Pay</span>
                    </div>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0">
                      {paymentMethod === 'nagad' && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-orange-700">Nagad</span>
                      <span className="text-[10px] text-gray-500 font-normal">Send Money / Pay</span>
                    </div>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 flex items-center justify-center shrink-0">
                      {paymentMethod === 'card' && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-indigo-700">Credit / Debit Card</span>
                      <span className="text-[10px] text-gray-500 font-normal">Online Payment</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* bKash / Nagad Details Box */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="bg-pink-50/70 border border-pink-200 rounded-xl p-3 text-xs space-y-2">
                  <p className="font-bold text-slate-900">
                    Please Send Money (<b>৳{totalAmount}</b>) to official {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number:
                  </p>
                  <div className="bg-white p-2 rounded-lg border border-pink-200 font-mono font-bold text-sm text-pink-600 flex items-center justify-between">
                    <span>01736528481</span>
                    <span className="text-[10px] font-sans bg-pink-100 text-pink-800 px-2 py-0.5 rounded">Personal/Send Money</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Transaction ID (TrxID) / bKash or Nagad Sender Number:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter TrxID e.g. 9J87X..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-300 rounded-lg text-xs focus:outline-none focus:border-pink-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Card Details Box */}
              {paymentMethod === 'card' && (
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 text-xs space-y-1 text-indigo-900">
                  <p className="font-bold flex items-center gap-1">
                    <CreditCard size={14} className="text-indigo-600" />
                    <span>Online Credit / Debit Card Selected</span>
                  </p>
                  <p className="text-[11px] text-indigo-700 leading-relaxed">
                    You can pay via Visa, MasterCard or Net Banking. After placing the order, you will receive payment link & invoice via WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Red Light Warning Notice for Bad Delivery Record */}
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-3 flex items-start gap-2.5 shadow-sm text-left">
              <div className="relative flex shrink-0 mt-1">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 bg-rose-600 rounded-full relative"></div>
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold text-rose-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <span>⚠️ পেমেন্ট সতর্কবার্তা / Notice:</span>
                </p>
                <p className="text-rose-900 font-semibold leading-relaxed">
                  ডেলিভারি রেকর্ড খারাপ থাকলে সে ক্ষেত্রে অর্ডার কনফার্ম করতে ডেলিভারি চার্জ আগে পেমেন্ট করতে হবে।
                </p>
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="bg-slate-950 text-white p-4 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee:</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm sm:text-base text-amber-400">
                <span>Total Amount:</span>
                <span>৳{totalAmount}</span>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-2/3 py-3.5 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>Confirm Order (৳{totalAmount})</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
