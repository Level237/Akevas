import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shirt,
  Smartphone,
  Watch,
  Laptop,
  Headphones,
  Sofa,
  Baby,
  Car,
  Gamepad,
  ShoppingBag,
  Gem,
  Utensils
} from 'lucide-react';
import dress from "../../assets/dress.jpg"
const categories = [
  {
    id: 1,
    name: 'Mode',
    icon: Shirt,
    color: '#FF6B6B',
    image: dress,
    count: '2.5k produits'
  },
  {
    id: 2,
    name: 'Électronique',
    icon: Smartphone,
    color: '#4ECDC4',
    image: '/categories/electronics.jpg',
    count: '1.8k produits'
  },
  {
    id: 3,
    name: 'Montres',
    icon: Watch,
    color: '#45B7D1',
    image: '/categories/watches.jpg',
    count: '950 produits'
  },
  {
    id: 4,
    name: 'Informatique',
    icon: Laptop,
    color: '#96CEB4',
    image: '/categories/computers.jpg',
    count: '1.2k produits'
  },
  {
    id: 5,
    name: 'Audio',
    icon: Headphones,
    color: '#D4A5A5',
    image: '/categories/audio.jpg',
    count: '780 produits'
  },
  {
    id: 6,
    name: 'Maison',
    icon: Sofa,
    color: '#9B9B9B',
    image: '/categories/home.jpg',
    count: '2.1k produits'
  },
  {
    id: 7,
    name: 'Bébé',
    icon: Baby,
    color: '#FFB6B9',
    image: '/categories/baby.jpg',
    count: '1.3k produits'
  },
  {
    id: 8,
    name: 'Auto',
    icon: Car,
    color: '#957DAD',
    image: '/categories/auto.jpg',
    count: '890 produits'
  },
  {
    id: 9,
    name: 'Gaming',
    icon: Gamepad,
    color: '#E84A5F',
    image: '/categories/gaming.jpg',
    count: '670 produits'
  },
  {
    id: 10,
    name: 'Luxe',
    icon: Gem,
    color: '#FFD93D',
    image: '/categories/luxury.jpg',
    count: '450 produits'
  }
];

const ShopByCategory = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Découvrez par catégorie</h2>
          <p className="text-gray-600">
            Explorez notre large sélection de produits par catégorie
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <Link to={`/category/${category.id}`} className="block">
                <div className="relative aspect-square">
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"
                  />
                  
                  {/* Category Icon */}
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center z-20"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transform transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${category.image})`,
                      backgroundColor: category.color
                    }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                    <h3 className="text-lg font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
