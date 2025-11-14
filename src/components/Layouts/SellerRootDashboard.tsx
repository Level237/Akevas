import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/dashboard/seller/layouts/header';
import { useCurrentSellerQuery } from '@/services/sellerService';
import MobileNav from '../ui/mobile-nav';
import SidebarLeft from '../ui/SidebarLeft';
import CategoryModal from '../modals/CategoryModal';
import { useGetCategoryByGenderQuery } from '@/services/guardService';
import NotificationChatWidget from '../ui/NotificationChatWidget';



const SellerRootDashboard= () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: { data: sellerData } = {}, isLoading } = useCurrentSellerQuery('seller');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(sellerData?.shop.gender || '', { skip: !sellerData?.shop.gender });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoriesIsEmpty, setCategoriesIsEmpty] = useState<boolean | null>(null);
  const location = useLocation();
  const shouldShowChatWidget = location.pathname !== '/seller/create-product';

  useEffect(() => {
    if (sellerData?.shop?.categories && sellerData.shop.categories.length === 0) {
      setCategoriesIsEmpty(true);
    } else {
      setCategoriesIsEmpty(false);
    }
  }, [sellerData?.shop?.categories]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleValidateCategories = () => {
    console.log('Selected Categories:', selectedCategories);
    setShowCategoryModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed7e0f]"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
      <SidebarLeft />
      {/* En-tête avec navigation */}
      <Header sellerData={sellerData} isMobile={isMobile} setIsSidebarOpen={setIsSidebarOpen} />
      <Outlet />
      <MobileNav />
      <CategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        options={categoriesByGender?.categories || []}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        onValidate={handleValidateCategories}
        loading={isLoadingCategoriesByGender}
      />
      {categoriesIsEmpty === true && (
        <div className="fixed bottom-4 max-sm:bottom-24 right-4 z-50">
          <div className="relative group">
            <button
              className="bg-[#6e0a13] shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none"
              aria-label="Complétez la catégorie de votre boutique"
              onClick={() => setShowCategoryModal(true)}
              type="button"
              style={{ minWidth: 56, minHeight: 56 }}
            >
              {/* Badge d'alerte */}
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {/* Icône collection */}
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h4.5v4.5h-4.5v-4.5zm0 12h4.5v4.5h-4.5v-4.5zm12-12h4.5v4.5h-4.5v-4.5zm0 12h4.5v4.5h-4.5v-4.5z" />
              </svg>
            </button>
            {/* Tooltip infobulle */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
              <div className="bg-white text-gray-800 text-xs px-3 py-2 rounded shadow-lg border border-gray-200 whitespace-nowrap flex items-center gap-1">
                <svg className="w-4 h-4 text-orange-500 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                <span>Mettez à jour vos catégories</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {shouldShowChatWidget && (
        <NotificationChatWidget bottomClass={categoriesIsEmpty === true ? 'bottom-24 max-sm:bottom-44' : 'bottom-4 max-sm:bottom-24'} />
      )}
    </div>
  );
}

export default SellerRootDashboard;