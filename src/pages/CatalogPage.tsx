import { useParams } from 'react-router-dom';
import { useGetCatalogSellerQuery } from '@/services/guardService';
import MobileNav from '@/components/ui/mobile-nav';
import { ScrollRestoration } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AsyncLink from '@/components/ui/AsyncLink';
import { ArrowLeft, Search, Filter} from 'lucide-react';
import { useState } from 'react';



const CatalogPage: React.FC = () => {
  const { shopKey } = useParams();
  const { data: catalogData, isLoading } = useGetCatalogSellerQuery(shopKey || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous les produits');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
    
  // Extraire les catégories uniques des produits
  const categories = catalogData ? [
    { id: 0, name: 'Tous les produits' },
    ...Array.from(new Set(catalogData.flatMap((product: any) => 
      product.product_categories.map((category: any) => ({
        id: category.id,
        name: category.category_name
      }))
    )))
  ] : [];
  // Filtrer les produits selon la catégorie sélectionnée
  const filteredProducts = catalogData ? 
    selectedCategory === 'Tous les produits' 
      ? catalogData 
      : catalogData.filter((product: any) => 
          product.product_categories.some((cat: any) => 
            cat.category_name === selectedCategory
          )
        )
    : [];
  console.log(selectedCategory)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-100" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 aspect-[3/4] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne avec navigation et filtres */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Barre de navigation principale */}
          <div className="flex items-center h-16 px-4">
            <AsyncLink to={`/shop/${catalogData[0].shop_id}`} className="mr-4 lg:hidden">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </AsyncLink>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{catalogData[0].shop_name}</h1>
              <p className="text-sm text-gray-500 hidden md:block">Catalogue des produits</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Rechercher un produit..."
                  className="hidden md:block w-64 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]/20"
                />
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Barre de filtres par catégories */}
          <div className="border-t overflow-x-auto">
            <div className="flex items-center px-4 space-x-2 py-3">
              {categories.map((category: any) => (
                <Button
                    key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className={`rounded-full whitespace-nowrap ${
                    selectedCategory === category.name 
                    ? "bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90" 
                    : ""
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <ScrollRestoration />
      
      {/* Corps principal avec les produits filtrés */}
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        {catalogData && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product: any) => (
              <AsyncLink 
                key={product.id} 
                to={`/produit/${product.product_url}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Image Container */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={product.product_profile}
                      alt={product.product_name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Informations du produit */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {product.product_description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#ed7e0f] font-semibold">
                        {product.product_price} FCFA
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white"
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                </div>
              </AsyncLink>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Aucun produit disponible
            </h2>
            <p className="text-gray-500 text-center mt-2">
              Cette boutique n'a pas encore ajouté de produits à son catalogue
            </p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default CatalogPage;