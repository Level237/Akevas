import { useParams } from 'react-router-dom';
import { useGetCatalogSellerQuery } from '@/services/guardService';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { ScrollRestoration } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AsyncLink from '@/components/ui/AsyncLink';

const CatalogPage: React.FC = () => {
  const { shopKey } = useParams();
  const { data: catalogData, isLoading } = useGetCatalogSellerQuery(shopKey || '');
    console.log(catalogData)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue de la boutique</h1>
          <p className="text-gray-600 mt-2">Découvrez tous nos produits disponibles</p>
        </div>

        {catalogData && catalogData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogData.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-square">
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{product.product_name}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{product.product_description}</p>
                  <p className="text-[#ed7e0f] font-bold mt-2">{product.product_price} FCFA</p>
                </CardContent>
                <CardFooter>
                  <AsyncLink to={`/produit/${product.product_url}`} className="w-full">
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">
                      Voir le produit
                    </Button>
                  </AsyncLink>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Catalogue vide</h2>
            <p className="text-gray-500">Cette boutique n'a pas encore de produits disponibles</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default CatalogPage;