import { useParams } from 'react-router-dom';
import { ChevronDown, Search, ChevronRight, PackageX, Filter } from 'lucide-react';
import TopBar from '@/components/ui/topBar';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductListGrid from '@/components/products/ProductListGrid';
import { useGetCategoryProductsByUrlQuery, useGetCategoryByUrlQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import AsyncLink from '@/components/ui/AsyncLink';
import defaultHeroImage from "@/assets/dress.jpg"
import Footer from '@/components/ui/footer';
import CategoryFilters from '@/components/filters/CategoryFilters';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

const CategoryProductsPage = () => {
    const { url } = useParams<{ url: string }>();
    const { data: categoryData, isLoading } = useGetCategoryProductsByUrlQuery(url);
    const { data: category } = useGetCategoryByUrlQuery(url);
    const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery("guard");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const hasProducts = !isLoading && categoryData && categoryData.length > 0;

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <Header />
            <MobileNav />

            {/* Hero Section Amélioré */}
            <div className="relative h-[200px] md:h-[300px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={category?.category_profile || defaultHeroImage}
                        alt={category?.category_name || "Catégorie"}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultHeroImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                            {category?.category_name || "Catégorie"}
                        </h1>
                        <div className="flex items-center text-gray-200 text-sm backdrop-blur-sm bg-black/10 px-4 py-2 rounded-full inline-flex">
                            <AsyncLink to="/" className="hover:text-white transition-colors">
                                Accueil
                            </AsyncLink>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <AsyncLink to="/categories" className="hover:text-white transition-colors">
                                Catégories
                            </AsyncLink>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-white font-medium">
                                {category?.category_name || "Catégorie"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtres Desktop */}
                    <div className="hidden lg:block lg:w-1/4">
                        <CategoryFilters
                            categories={categories || []}
                            isLoading={categoriesLoading}
                            selectedCategories={selectedCategories}
                            onCategoryToggle={handleCategoryToggle}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:w-3/4">
                        {/* Barre de recherche et bouton filtres mobile */}
                  

                        {/* Products Grid */}
                        <ProductListGrid
                            products={categoryData}
                            isLoading={isLoading}
                            gridColumn={3}
                        />

                        {/* Load More */}
                        
                    </div>
                </div>
            </div>

            {/* Filtres Mobile */}
          

            <Footer/>
        </div>
    );
};

export default CategoryProductsPage;