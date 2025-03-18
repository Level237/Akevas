import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Hook personnalisé pour l'intersection observer
const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};

// Composant pour l'image lazy-loadée
const LazyImage = React.memo(({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(imgRef);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
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

// Composant de catégorie individuelle mémorisé
const CategoryItem = React.memo(({ category, style }: { category: Category; style: React.CSSProperties }) => (
  <div className="group cursor-pointer" style={style}>
    <div className="relative overflow-hidden rounded-lg aspect-square mx-3">
      <LazyImage
        src={category.category_profile}
        alt={category.category_name}
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-semibold">{category.category_name}</h3>
      </div>
    </div>
  </div>
));

CategoryItem.displayName = 'CategoryItem';

interface Category {
  category_name: string;
  category_profile: string;
  name: string;
  id: string | number;
}

const CategoryGridList = React.memo(({
  categories,
  isLoading,
  title
}: {
  categories: Category[];
  isLoading: boolean;
  title: string;
}) => {
  const COLUMN_WIDTH = 300;
  const ROW_HEIGHT = 300;
  const SKELETON_ARRAY = Array(8).fill(0);

  const Cell = React.useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * 4 + columnIndex;
    if (isLoading) {
      return <CategorySkeleton key={`skeleton-${index}`} />;
    }
    if (index >= categories.length) return null;
    return <CategoryItem key={categories[index].id} category={categories[index]} style={style} />;
  }, [categories, isLoading]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = Math.floor(width / COLUMN_WIDTH) || 1;
            const rowCount = Math.ceil(
              (isLoading ? SKELETON_ARRAY.length : categories.length) / columnCount
            );

            return (
              <FixedSizeGrid
                columnCount={columnCount}
                columnWidth={width / columnCount}
                height={650}
                rowCount={rowCount}
                rowHeight={ROW_HEIGHT}
                width={width}
              >
                {Cell}
              </FixedSizeGrid>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
});

CategoryGridList.displayName = 'CategoryGridList';
export default CategoryGridList;
