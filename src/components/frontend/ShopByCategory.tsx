import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gem, Shirt, Hand, Sparkles, Dumbbell, Watch } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos catégories</h2>
          <p className="text-gray-600">
            Découvrez nos collections par catégorie
          </p>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1.2}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
            },
            768: {
              slidesPerView: 3.2,
            },
            1024: {
              slidesPerView: 4.2,
            },
          }}
          className="!pb-12"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
              >
                <Link to={`/category/${category.id}`} className="block h-full">
                  <div className="relative h-full">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transform transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${category.image})`,
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white/80">{category.count}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ShopByCategory;
