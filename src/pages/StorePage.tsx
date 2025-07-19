import Header from '@/components/ui/header';
import { Link, ScrollRestoration, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNav from '@/components/ui/mobile-nav';
import CurrentShopOverView, { CurrentShopOverViewSkeleton } from '@/components/seller/current-shop-overview';
import { useGetShopQuery } from '@/services/guardService';

import ErrorBoundary from '@/components/errors/error-boundary';
import ErrorMessage from '@/components/ui/error-message';

const StorePage: React.FC = () => {
  const { id } = useParams();
  const { data: { data: shop } = {}, isLoading, error } = useGetShopQuery(id);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen mb-16 bg-gray-50">
        <Header />
        <ScrollRestoration />
      
        {isLoading && <CurrentShopOverViewSkeleton/>}
        {!isLoading && shop && shop.isSeller === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Boutique en attente d’activation</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Cette boutique n’est pas encore disponible. Elle est en cours de validation par notre équipe. Revenez plus tard pour découvrir ses produits et services !
            </p>
            <Link to="/shops">
              <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">
                Voir les autres boutiques
              </Button>
            </Link>
          </div>
        )}
        {!isLoading && shop && shop.isSeller && shop.isSeller===1 && (
          <>
            <CurrentShopOverView shop={shop}/>
          </>
        )}
        
        {(!isLoading && !shop) && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Boutique non trouvée</h2>
            <p className="text-gray-500 mb-6">Cette boutique n'existe pas ou a été supprimée</p>
            <Link to="/stores">
              <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">
                Voir les boutiques
              </Button>
            </Link>
          </div>
        )}

        {error && <ErrorMessage />}
        
        <MobileNav />
      </div>
    </ErrorBoundary>
  );
};

export default StorePage;