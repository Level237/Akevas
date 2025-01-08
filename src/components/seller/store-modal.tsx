'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { X, ExternalLink, Star, Heart, ShoppingBag, Clock, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"
import { StoreBadges } from "./store-badge"

interface Category {
  id: number
  name: string
  productCount: number
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  sales: number
}

interface Store {
  id: string
  name: string
  banner: string
  products: Product[]
  rating: number
  followers: number
  totalProducts: number
  categories: Category[]
  isPremium: boolean
  isWholesale: boolean
  isThrift: boolean
  joinDate: string
  location: string
  responseRate: string
}

const demoStore: Store = {
  id: "store1",
  name: "Home Garden Store",
  banner: "/placeholder.svg?height=300&width=1200",
  rating: 4.8,
  followers: 15234,
  totalProducts: 1458,
  isPremium: true,
  isWholesale: true,
  isThrift: false,
  joinDate: "2021",
  location: "Guangzhou, China",
  responseRate: "97.8%",
  categories: [
    { id: 1, name: "LED Lights", productCount: 245 },
    { id: 2, name: "Home Decor", productCount: 189 },
    { id: 3, name: "Garden Tools", productCount: 156 },
    { id: 4, name: "Smart Home", productCount: 98 },
  ],
  products: [
    {
      id: 1,
      name: "LED Moon Lamp with Wooden Stand",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      sales: 285
    },
    {
      id: 2,
      name: "Smart LED Strip Lights",
      price: 19.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.3,
      sales: 152
    },
    {
      id: 3,
      name: "Modern Desk Lamp",
      price: 34.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      sales: 98
    },
    {
      id: 4,
      name: "Crystal Table Lamp",
      price: 45.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      sales: 167
    }
  ]
}

export function StoreCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer group"
      >
        <div className="relative w-72 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
          <div className="relative h-40">
            <img
              src={demoStore.banner}
              alt={demoStore.name}

              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{demoStore.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{demoStore.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {demoStore.followers.toLocaleString()} followers
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-x-4 top-[5%] z-50 mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-x-auto"
            >
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="relative">
                  <div className="relative h-72 w-full">
                    <img
                      src={demoStore.banner}
                      alt={demoStore.name}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-3xl font-bold">{demoStore.name}</h2>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg">{demoStore.rating}</span>
                        </div>
                        <span className="text-white/60">•</span>
                        <span className="text-white/90">
                          {demoStore.followers.toLocaleString()} followers
                        </span>
                        <span className="text-white/60">•</span>
                        <span className="text-white/90">
                          {demoStore.totalProducts.toLocaleString()} products
                        </span>
                      </div>
                      <div className="mt-4">
                        <StoreBadges
                          isPremium={demoStore.isPremium}
                          isWholesale={demoStore.isWholesale}
                          isThrift={demoStore.isThrift}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
                  <div className="md:col-span-3">
                    <div className="mb-6">
                      <h3 className="mb-4 text-lg font-semibold">Store Categories</h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {demoStore.categories.map((category) => (
                          <div
                            key={category.id}
                            className="rounded-lg border bg-gray-50 p-3 text-center"
                          >
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.productCount} products</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Featured Products</h3>
                        <Button variant="outline">View All Products</Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {demoStore.products.map((product) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: product.id * 0.1 }}
                            className="group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                          >
                            <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <button className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100">
                                <Heart className="h-4 w-4" />
                              </button>
                            </div>
                            <h4 className="mb-2 line-clamp-2 text-sm font-medium">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">${product.price}</span>
                              <Badge variant="secondary" className="text-xs">
                                {product.sales} sold
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 rounded-xl border bg-gray-50 p-4">
                    <Button className="w-full gap-2">
                      Visit Store
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <ShoppingBag className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Total Products</div>
                          <div className="text-sm text-gray-500">{demoStore.totalProducts.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Member Since</div>
                          <div className="text-sm text-gray-500">{demoStore.joinDate}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-500">{demoStore.location}</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="mb-2 font-medium">Response Rate</div>
                        <div className="text-2xl font-bold text-green-600">{demoStore.responseRate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

