import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, Search } from 'lucide-react';
import TopBar from '@/components/ui/topBar';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductListGrid from '@/components/products/ProductListGrid';
import { useGetCategoryByUrlQuery } from '@/services/guardService';
const CategoryProductsPage = ({ url }: { url: string }) => {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category");
    const [sortBy, setSortBy] = useState("newest");

    // Vous devrez créer ce hook pour récupérer les données de la catégorie
    const { data: categoryData, isLoading } = useGetCategoryByUrlQuery(url);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <Header />
            <MobileNav />

            {/* Hero Section */}
            <div className="relative h-[300px]">
                <div className="absolute inset-0">
                    <img
                        src={categoryData?.category_image}
                        alt={categoryData?.category_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <h1 className="text-4xl font-bold text-white">{categoryData?.category_name}</h1>
                </div>
            </div>

            {/* Filters and Search Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input className="pl-10" placeholder="Rechercher dans cette catégorie..." />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtres
                            </Button>

                            <Button variant="outline" className="flex items-center gap-2">
                                Trier par
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    <Button variant="secondary" size="sm" className="rounded-full">
                        Prix: 50€ - 200€ ×
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full">
                        Taille: M ×
                    </Button>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <ProductListGrid
                        products={categoryData?.products}
                        isLoading={isLoading}
                    />
                </div>

                {/* Load More */}
                <div className="text-center">
                    <Button variant="outline" className="px-8">
                        Charger plus de produits
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CategoryProductsPage; 