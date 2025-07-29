import { useState, useEffect } from 'react';

import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/dashboard/seller/layouts/header';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import MobileNav from '../ui/mobile-nav';
import SidebarLeft from '../ui/SidebarLeft';
import { shopCategoriesIsEmpty } from '@/lib/shopCategoriesIsEmpty';
import CategoryModal from '../modals/CategoryModal';
import { useGetCategoryByGenderQuery } from '@/services/guardService';

export default function SellerRootDashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: { data: sellerData } = {} } = useCurrentSellerQuery<SellerResponse>('seller')
  const [categoriesIsEmpty, setCategoriesIsEmpty] = useState<boolean | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Genre sélectionné (par défaut celui du shop ou 1)
  let initialGender = sellerData?.shop?.gender;
  if (!initialGender) initialGender = '1'; // Valeur par défaut si non défini
  // const [selectedGender, setSelectedGender] = useState(initialGender);

  // Catégories sélectionnées (ids)
  const initialSelectedCategories = sellerData?.shop?.categories?.map(cat => parseInt(cat.id)) || [];
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialSelectedCategories);

  // Récupération des catégories selon le genre
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(initialGender);
 
  useEffect(() => {
    if (Array.isArray(sellerData?.shop?.categories)) {
      shopCategoriesIsEmpty(sellerData.shop.categories).then(setCategoriesIsEmpty);
    } else {
      setCategoriesIsEmpty(null);
    }
  }, [sellerData?.shop?.categories]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handler pour valider la sélection (à adapter pour appel API)
  const handleValidateCategories = () => {
    // TODO: Appel API pour mettre à jour les catégories du shop
    console.log('Catégories sélectionnées :', selectedCategories);
    setShowCategoryModal(false);
  };

  // Handler pour changer le genre (optionnel, si tu veux permettre de changer le genre dans le modal)
  // const handleChangeGender = (value: number) => {
  //   setSelectedGender(value);
  //   setSelectedCategories([]); // reset sélection
  // };
  
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
      {children}
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
    </div>
  );
}