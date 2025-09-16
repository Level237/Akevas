import React, { useMemo } from 'react';
import ProductListContainer from '@/components/frontend/ProductListContainer';
import { useQueryState } from 'nuqs';
import { useGetAllProductsQuery } from '@/services/guardService';
import { Product } from '@/types/products';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';

const ProductListPage: React.FC = () => {
  const [pageParam] = useQueryState('page', {
    defaultValue: '1',
    parse: (v) => v || '1',
    serialize: (v) => v
  });
  const currentPage = parseInt(pageParam || '1', 10);

  const [minPrice] = useQueryState('min_price', {
    defaultValue: 0,
    parse: (value) => parseInt(value, 10) || 0,
    serialize: (value) => value.toString()
  });
  const [maxPrice] = useQueryState('max_price', {
    defaultValue: 500000,
    parse: (value) => parseInt(value, 10) || 500000,
    serialize: (value) => value.toString()
  });
  const [selectedCategories] = useQueryState('categories', {
    defaultValue: [],
    parse: (value) => value ? value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [selectedColors] = useQueryState('colors', {
    defaultValue: [],
    parse: (value) => value ? value.split(',') : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [selectedAttributes] = useQueryState('attribut', {
    defaultValue: [],
    parse: (value) => value ? value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [selectedGenders] = useQueryState('gender', {
    defaultValue: [],
    parse: (value) => value ? value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [isSellerMode] = useQueryState('seller_mode', {
    defaultValue: false,
    parse: (value) => value === 'true',
    serialize: (value) => value ? 'true' : ''
  });
  const [selectedBulkPriceRange] = useQueryState('bulk_price_range', {
    defaultValue: '',
    parse: (value) => value || '',
    serialize: (value) => value || ''
  });

  const { data: { productList, totalPagesResponse } = {}, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    min_price: minPrice,
    max_price: maxPrice,
    categories: selectedCategories,
    colors: selectedColors,
    attribut: selectedAttributes,
    gender: selectedGenders,
    seller_mode: isSellerMode,
    bulk_price_range: selectedBulkPriceRange
  });

  const products: Product[] = useMemo(() => productList || [], [productList]);

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber.toString());
    if (minPrice > 0) params.set('min_price', minPrice.toString());
    if (maxPrice < 500000) params.set('max_price', maxPrice.toString());
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (selectedAttributes.length > 0) params.set('attribut', selectedAttributes.join(','));
    if (selectedGenders.length > 0) params.set('gender', selectedGenders.join(','));
    if (isSellerMode) params.set('seller_mode', 'true'); else params.delete('seller_mode');
    if (selectedBulkPriceRange) params.set('bulk_price_range', selectedBulkPriceRange); else params.delete('bulk_price_range');
    return `?${params.toString()}`;
  };

  return (
    <>
      <Header />
    <MobileNav />
    <ProductListContainer
      products={products}
      isLoadingOverride={isLoading}
      totalPagesOverride={totalPagesResponse}
      currentPageOverride={currentPage}
      getPageUrlOverride={getPageUrl}
    />
    </>
    
  );
};

export default ProductListPage;
