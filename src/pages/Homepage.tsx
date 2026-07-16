import { useState, useEffect, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import StoreHero from '@/components/frontend/StoreHero';
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import StoreStories from '@/components/stores/store-stories';
import PremiumProducts from '@/components/products/PremiumProducts';
import MobileNav from '@/components/ui/mobile-nav';
import CategoryShowcaseDual from '@/components/categories/CategoryShowcaseDual';
import GenderNavigationMobile from '@/components/categories/GenderNavigationMobile';
import PageLoader from '@/components/ui/PageLoader';
import FloatingHelpButton from '@/components/ui/FloatingHelpButton';
import InstallButton from '@/components/InstallButton';
import Footer from '@/components/ui/footer';

// Services & Types
import { useGetCategoriesWithParentIdNullQuery, useGetHomeShopsQuery } from '@/services/guardService';
import { setInitialLoading } from '@/store/features/loadingSlice';
import { RootState } from '@/store';

const Homepage = () => {
  const dispatch = useDispatch();
  const isInitialLoading = useSelector((state: RootState) => state.loading.isInitialLoading);
  
  // useTransition est utile, mais on l'utilisera proprement sans état local redondant
  const [isPending, startTransition] = useTransition();

  // ✅ 1. APPELS API SÉCURISÉS (Plus de refetch intempestif)
  const { 
    data: shopsResponse, 
    isLoading: shopsLoading, 
    error: shopsError 
  } = useGetHomeShopsQuery("guard", {
    refetchOnFocus: false,          // ❌ Ne pas recharger au changement d'onglet
    refetchOnMountOrArgChange: false, // ❌ Utiliser le cache de 5 min défini dans guardService
  });

  const { 
    data: categoriesResponse, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useGetCategoriesWithParentIdNullQuery("4", {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  // ✅ 2. EXTRACTION SÉCURISÉE DES DONNÉES (Sans état local inutile)
  // On utilise l'optional chaining (?.) pour éviter les erreurs si data est undefined
  const shops = shopsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  // ✅ 3. GESTION PROPRE DU LOADER (Sans setTimeout artificiel)
  useEffect(() => {
    if (!shopsLoading && !categoriesLoading && isInitialLoading) {
      // On utilise startTransition pour que la mise à jour du state Redux 
      // ne bloque pas le thread principal et permette une transition fluide
      startTransition(() => {
        dispatch(setInitialLoading(false));
      });
    }
  }, [shopsLoading, categoriesLoading, isInitialLoading, dispatch]);

  // ✅ 4. GESTION D'ERREUR CENTRALISÉE
  if (shopsError || categoriesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FC]">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oups, un problème est survenu
          </h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger les données de la page d'accueil.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#ed7e0f] hover:bg-[#d66a00] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  // ✅ 5. AFFICHAGE CONDITIONNEL OPTIMISÉ
  // On affiche le loader global seulement si c'est le tout premier chargement
  if (isInitialLoading || (shopsLoading && !shopsResponse)) {
    return <PageLoader />;
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC]">
      <div className="max-sm:ml-0">
        <TopBar />
        <Header />

        <main className="relative pb-20"> {/* pb-20 pour éviter que le footer ne colle au contenu sur mobile */}
          <GenderNavigationMobile />
          
          <div className="relative space-y-8"> {/* space-y-8 gère les espacements verticaux proprement */}
            <StoreHero />
            
            {/* On passe directement 'shops' au lieu de 'localShops' */}
            <StoreStories 
              title="Boutiques en vedette" 
              description="Découvrez les boutiques en vedette" 
              shops={shops} 
              isLoading={shopsLoading} 
            />
            
            <PremiumProducts />
            
            <CategoryShowcaseDual 
              categories={categories} 
              isLoading={categoriesLoading} 
              title="Catégories" 
              titleCategory="Découvrez nos catégories" 
            />
          </div>
        </main>

        <MobileNav />
        <FloatingHelpButton />
        <InstallButton />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
