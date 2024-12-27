'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: 1,
    name: "Casque audio sans fil",
    price: 199.99,
    category: "Électronique",
    image: "/kids.webp"
  },
  {
    id: 2,
    name: "Sac à dos intelligent",
    price: 149.99,
    category: "Accessoires",
    image: "/kids.webp"
  },
  {
    id: 3,
    name: "Montre connectée",
    price: 249.99,
    category: "Électronique",
    image: "/kids.webp"
  },
  {
    id: 4,
    name: "Chaussures de course",
    price: 129.99,
    category: "Sport",
    image: "/kids.webp"
  },
  {
    id: 5,
    name: "Chaussures de course",
    price: 129.99,
    category: "Sport",
    image: "/kids.webp"
  },
  {
    id: 6,
    name: "Chaussures de course",
    price: 129.99,
    category: "Sport",
    image: "/kids.webp"
  },
  {
    id: 7,
    name: "Chaussures de course",
    price: 129.99,
    category: "Sport",
    image: "/kids.webp"
  },
  {
    id: 8,
    name: "Chaussures de course",
    price: 129.99,
    category: "Sport",
    image: "/kids.webp"
  }
]

export default function ProductList() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">Découvrez nos produits tendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <CardContent className="p-0 relative">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{product.category}</Badge>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-4 right-4 transition-colors duration-300 ${favorites.includes(product.id) ? 'text-red-500' : 'text-gray-900'} hover:text-red-500`}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className="h-6 w-6 fill-current" />
              </Button>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{product.name}</h2>
                <p className="text-2xl font-bold mb-4">{product.price.toFixed(2)} €</p>
                <Button className="w-full group-hover:bg-primary bg-black group-hover:text-primary-foreground transition-colors duration-300">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}