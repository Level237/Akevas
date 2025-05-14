import { useParams } from 'react-router-dom';
import { ChevronDown, Filter, Search, ChevronRight } from 'lucide-react';
import TopBar from '@/components/ui/topBar';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductListGrid from '@/components/products/ProductListGrid';
import { useGetCategoryProductsByUrlQuery, useGetCategoryByUrlQuery } from '@/services/guardService';
import AsyncLink from '@/components/ui/AsyncLink';

const CategoryProductsPage = () => {
    const { url } = useParams<{ url: string }>();
    const { data: categoryData, isLoading } = useGetCategoryProductsByUrlQuery(url);
    const { data: category } = useGetCategoryByUrlQuery(url);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <Header />
            <MobileNav />

            {/* Hero Section */}
            <div className="relative h-[200px] md:h-[250px]">
                <div className="absolute inset-0">
                    <img
                        src={category?.category_profile}
                        alt={category?.category_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{category?.category_name}</h1>
                        <div className="flex items-center text-gray-200 text-sm">
                            <AsyncLink to="/" className="hover:text-white">Accueil</AsyncLink>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span>Catégories</span>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-white">{category?.category_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Catégories</h2>
                            <div className="space-y-2">
                                {/* Example categories - replace with actual data */}
                                {['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté'].map((cat, index) => (
                                    <button 
                                        key={index}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                                            ${url === cat.toLowerCase() 
                                                ? 'bg-[#ed7e0f] text-white' 
                                                : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold mb-4">Filtres</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">Prix</label>
                                        <div className="flex gap-2">
                                            <Input type="number" placeholder="Min" className="w-1/2" />
                                            <Input type="number" placeholder="Max" className="w-1/2" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">Marques</label>
                                        <div className="space-y-2">
                                            {['Nike', 'Adidas', 'Puma'].map((brand, index) => (
                                                <label key={index} className="flex items-center">
                                                    <input type="checkbox" className="mr-2" />
                                                    {brand}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Search and Sort */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" placeholder="Rechercher dans cette catégorie..." />
                                </div>

                                <Button variant="outline" className="flex items-center gap-2">
                                    Trier par
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
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
                        <ProductListGrid
                            products={categoryData}
                            isLoading={isLoading}
                            gridColumn={3}
                        />

                        {/* Load More */}
                        <div className="text-center mt-8">
                            <Button variant="outline" className="px-8">
                                Charger plus de produits
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProductsPage;