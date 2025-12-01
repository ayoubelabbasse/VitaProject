'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatPrice } from '@/utils/formatters/currency'

// Mock order data - replace with API call
const mockOrders = [
  {
    id: 'ORD-12345678',
    date: '2024-01-15',
    status: 'delivered' as const,
    total: 389.99,
    items: [
      {
        id: 1,
        name: 'Vitamin D3 5000IU',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&bg=transparent',
        quantity: 2,
        price: 89.99,
      },
      {
        id: 2,
        name: 'Omega-3 Fish Oil',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&bg=transparent',
        quantity: 1,
        price: 149.99,
      },
    ],
  },
  {
    id: 'ORD-12345679',
    date: '2024-01-20',
    status: 'processing' as const,
    total: 199.99,
    items: [
      {
        id: 3,
        name: 'Whey Protein Isolate',
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&bg=transparent',
        quantity: 1,
        price: 199.99,
      },
    ],
  },
  {
    id: 'ORD-12345680',
    date: '2024-01-22',
    status: 'shipped' as const,
    total: 249.98,
    items: [
      {
        id: 4,
        name: 'Creatine Monohydrate',
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&bg=transparent',
        quantity: 2,
        price: 79.99,
      },
    ],
  },
]

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'shipped':
      return <Truck className="w-5 h-5 text-blue-500" />
    case 'processing':
      return <Package className="w-5 h-5 text-yellow-500" />
    case 'pending':
      return <Clock className="w-5 h-5 text-gray-500" />
    default:
      return <Clock className="w-5 h-5 text-gray-500" />
  }
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'Delivered'
    case 'shipped':
      return 'Shipped'
    case 'processing':
      return 'Processing'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-text mb-8">My Orders</h1>

        {mockOrders.length === 0 ? (
          <div className="bg-bg border border-border rounded-lg shadow-soft p-12 text-center">
            <Package className="w-24 h-24 text-muted/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-text mb-4">No Orders Yet</h2>
            <p className="text-muted mb-8">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary inline-flex items-center">
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg border border-border rounded-lg shadow-soft overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-text">Order #{order.id}</h3>
                          <p className="text-sm text-muted">
                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-muted">Total</p>
                        <p className="text-xl font-bold text-text">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-primary/10 border border-primary rounded-lg">
                        <span className="text-sm font-medium text-primary">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 pb-4 border-b border-border last:border-0"
                      >
                        <div className="relative w-20 h-20 bg-bg border border-border rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text">{item.name}</h4>
                          <p className="text-sm text-muted">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 btn-outline text-center"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="flex-1 btn-outline">
                        Reorder
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="flex-1 btn-outline">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

