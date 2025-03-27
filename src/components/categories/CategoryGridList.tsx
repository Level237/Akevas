import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';



// Composant pour l'image lazy-loadée modifié
const LazyImage = React.memo(({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Composant Skeleton optimisé et mémorisé
const CategorySkeleton = React.memo(() => (
  <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-200 animate-pulse">
    <div className="absolute bottom-4 left-4">
      <div className="h-6 w-32 bg-gray-300 rounded" />
    </div>
  </div>
));

CategorySkeleton.displayName = 'CategorySkeleton';

interface Category {
  category_name: string;
  category_profile: string;
  name: string;
  id: string | number;
}

const CategoryItem = React.memo(({ category }: { category: Category }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group cursor-pointer"
    style={{
      willChange: 'transform',
      transform: 'translateZ(0)',
    }}
  >
    <div 
      className="relative overflow-hidden rounded-lg aspect-square"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <img
        src={category.category_profile}
        alt={category.category_name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ willChange: 'opacity' }}
      />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-semibold">{category.category_name}</h3>
      </div>
    </div>
  </motion.div>
));

CategoryItem.displayName = 'CategoryItem';

const CategoryGridList = React.memo(({
  categories = [],
  isLoading,
  title
}: {
  categories: Category[];
  isLoading: boolean;
  title: string;
}) => {
  const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      // Précharger toutes les images
      const imagePromises = categories.map(category => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = category.category_profile;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      });

      Promise.all(imagePromises).then(() => {
        setLoadedCategories(categories);
        setImagesLoaded(true);
      });
    }
  }, [categories]);

  if (isLoading || !imagesLoaded) {
    return (
      <div 
        className="container mx-auto px-4 py-8"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="aspect-square rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
        perspective: '1000px',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {loadedCategories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
          />
        ))}
      </motion.div>
    </div>
  );
});

CategoryGridList.displayName = 'CategoryGridList';
export default CategoryGridList;
