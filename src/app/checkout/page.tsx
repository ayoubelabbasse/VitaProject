'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, MapPin, Truck, Lock, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters/currency'

type ShippingMethod = 'standard' | 'express' | 'pickup'

interface ShippingOption {
  id: ShippingMethod
  name: string
  description: string
  price: number
  days: string
}

const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Standard Delivery', description: '3-5 business days', price: 50, days: '3-5' },
  { id: 'express', name: 'Express Delivery', description: '1-2 business days', price: 100, days: '1-2' },
  { id: 'pickup', name: 'Store Pickup', description: 'Casablanca location', price: 0, days: 'Same day' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>('standard')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    region: '',
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })

  const subtotal = getTotal()
  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0
  const vat = (subtotal + shippingCost) * 0.20
  const finalTotal = subtotal + shippingCost + vat - discount

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.10)
    } else {
      alert('Invalid coupon code')
    }
  }

  const handlePlaceOrder = () => {
    // In production, process payment and create order
    alert('Order placed successfully! (This is a demo)')
    clearCart()
    router.push('/orders/success')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {['shipping', 'payment', 'review'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step === s
                        ? 'bg-primary text-white'
                        : idx < ['shipping', 'payment', 'review'].indexOf(step)
                        ? 'bg-primary text-white'
                        : 'bg-border text-muted'
                    }`}
                  >
                    {idx < ['shipping', 'payment', 'review'].indexOf(step) ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-text capitalize">{s}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-colors ${
                      idx < ['shipping', 'payment', 'review'].indexOf(step)
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg border border-border rounded-lg shadow-soft p-6"
                >
                  <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-primary" />
                    Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-clay-beige rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      placeholder="+212 6XX XXX XXX"
                      className="w-full px-4 py-3 border border-clay-beige rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-clay-beige rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Region *
                      </label>
                      <select
                        value={shippingInfo.region}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, region: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      >
                        <option value="">Select Region</option>
                        <option value="casablanca">Casablanca</option>
                        <option value="rabat">Rabat</option>
                        <option value="marrakech">Marrakech</option>
                        <option value="fes">Fes</option>
                        <option value="tanger">Tanger</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-herbal-green" />
                      Shipping Method
                    </h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedShipping === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) =>
                              setSelectedShipping(e.target.value as ShippingMethod)
                            }
                            className="mr-4 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-text">{option.name}</p>
                                <p className="text-sm text-muted">{option.description}</p>
                              </div>
                              <span className="font-bold text-text">
                                {option.price === 0 ? 'Free' : formatPrice(option.price)}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                    <button
                      onClick={() => setStep('payment')}
                      className="w-full btn-primary"
                    >
                      Continue to Payment
                    </button>
                </motion.div>
              )}

              {/* Payment Information */}
              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg border border-border rounded-lg shadow-soft p-6"
                >
                  <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-primary" />
                    Payment Information
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim(),
                        })
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-clay-beige rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardName}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-clay-beige rounded-xl focus:ring-2 focus:ring-herbal-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5),
                          })
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">CVV *</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value.replace(/\D/g, '').substring(0, 3),
                          })
                        }
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-muted mb-6">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm">Your payment information is secure and encrypted</span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep('shipping')}
                      className="flex-1 btn-outline"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      className="flex-1 btn-primary"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Review Order */}
              {step === 'review' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg border border-border rounded-lg shadow-soft p-6"
                >
                  <h2 className="text-2xl font-bold text-text mb-6">Review Your Order</h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center">
                        <span className="text-muted">
                          {item.product.name} x{item.quantity}
                        </span>
                        <span className="font-medium text-text">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal</span>
                      <span className="text-text">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span className="text-text">
                        {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>VAT (20%)</span>
                      <span className="text-text">{formatPrice(vat)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-2xl font-bold text-text pt-4 border-t border-border">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setStep('payment')}
                      className="flex-1 btn-outline"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 btn-primary"
                    >
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
            <div className="bg-bg border border-border rounded-lg shadow-soft p-6 sticky top-24">
              <h3 className="text-xl font-bold text-text mb-4">Order Summary</h3>

              <div className="space-y-2 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-muted">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-text">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-text">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="font-medium text-text">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>VAT</span>
                  <span className="font-medium text-text">{formatPrice(vat)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-text pt-4 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text mb-2">
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 btn-primary"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

