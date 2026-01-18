import React from 'react';
import ProductListContainer from '@/components/frontend/ProductListContainer';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';




const ProductListPage: React.FC = () => {
  



  return (
    <>
      <Header />
    <MobileNav />
    <ProductListContainer/>
    </>
    
  );
};

export default ProductListPage;
