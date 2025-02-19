import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gem, Shirt, Hand, Sparkles, Dumbbell, Watch } from 'lucide-react';
import bijoux from '../../assets/dress.jpg';

const categories = [
  {
    id: 1,
    name: 'Bijoux',
    icon: Gem,
    color: '#FFD700',
    image: bijoux,
    count: '1.2k produits'
  },
  {
    id: 2,
    name: 'Vêtements',
    icon: Shirt,
    color: '#FF6B6B',
    image: bijoux,
    count: '2.5k produits'
  },
  {
    id: 3,
    name: 'Chaussures',
    icon: Hand,
    color: '#4ECDC4',
    image: bijoux,
    count: '1.8k produits'
  },
  {
    id: 4,
    name: 'Beauté',
    icon: Sparkles,
    color: '#FF69B4',
    image: bijoux,
    count: '950 produits'
  },
  {
    id: 5,
    name: 'Sport',
    icon: Dumbbell,
    color: '#45B7D1',
    image: bijoux,
    count: '780 produits'
  },
  {
    id: 6,
    name: 'Accessoires',
    icon: Watch,
    color: '#9B9B9B',
    image: bijoux,
    count: '1.3k produits'
  }
];

const ShopByCategory = () => {
  return (
    <div className="py-2 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-medium text-sm uppercase tracking-wider">
            Explorez notre catalogue
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Nos catégories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez nos collections soigneusement sélectionnées pour votre style unique
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative overflow-hidden rounded-3xl aspect-[3/4] hover:shadow-2xl transition-all duration-500"
            >
              <Link to={`/category/${category.id}`} className="block h-full">
                <div className="relative h-full">
                  {/* Background Image avec effet de zoom amélioré */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transform transition-all duration-700 group-hover:scale-125"
                    style={{
                      backgroundImage: `url(${category.image})`,
                    }}
                  />
                  
                  {/* Nouveau gradient overlay avec effet glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-all duration-500 backdrop-blur-[2px] group-hover:backdrop-blur-[4px]" />

                  {/* Content avec nouvelle disposition */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-white/90">
                        {category.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/90 backdrop-blur-md">
                          {category.count}
                        </span>
                        <motion.span 
                          className="text-white/80"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
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
