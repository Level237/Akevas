import React, { useMemo } from 'react';

// Composant Skeleton
const CategorySkeleton = () => (
  <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-200 animate-pulse">
    <div className="absolute bottom-4 left-4">
      <div className="h-6 w-32 bg-gray-300 rounded" />
    </div>
  </div>
);

interface Category {
  category_name: string;
  category_profile: string;
  name: string;
}

const CategoryGridList = ({
  categories,
  isLoading,
  title
}: {
  categories: Category[];
  isLoading: boolean;
  title: string;
}) => {

  const renderCategories = useMemo(() => {
    if (isLoading) {
      return Array(8).fill(0).map((_, index) => (
        <CategorySkeleton key={`skeleton-${index}`} />
      ));
    }

    return categories.map((category) => (
      <div key={category.id} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg aspect-square">
          <img
            src={category.category_profile}
            alt={category.category_name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              img.classList.remove('opacity-0');
              img.classList.add('opacity-100');
            }}
            style={{ transition: 'opacity 0.3s ease-in-out' }}

          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-semibold">{category.category_name}</h3>
          </div>
        </div>
      </div>
    ));
  }, [categories, isLoading]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {renderCategories}
      </div>
    </div>
  );
};

CategoryGridList.displayName = 'CategoryGridList';
export default React.memo(CategoryGridList);
