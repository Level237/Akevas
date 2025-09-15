import { useParams } from 'react-router-dom';
import { ChevronRight, PackageX} from 'lucide-react';
import TopBar from '@/components/ui/topBar';
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetCategoryProductsByUrlQuery, useGetCategoryByUrlQuery } from '@/services/guardService';
import AsyncLink from '@/components/ui/AsyncLink';
import defaultHeroImage from "@/assets/dress.jpg"
import Footer from '@/components/ui/footer';
import ProductListContainer from '@/components/frontend/ProductListContainer';

const CategoryProductsPage = () => {
    const { url } = useParams<{ url: string }>();
    const { data: categoryData, isLoading } = useGetCategoryProductsByUrlQuery(url);
    console.log(categoryData)
    const { data: category } = useGetCategoryByUrlQuery(url);
    const hasProducts = !isLoading && categoryData.data && categoryData.data.length > 0;

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
                {hasProducts ? (
                    <ProductListContainer
                        products={categoryData.data}
                        isLoadingOverride={isLoading}
                        presetCategoryIds={category?.id ? [category.id] : []}
                        showCategories={false}
                        hero={null}
                        getPageUrlOverride={(pageNumber) => {
                            const params = new URLSearchParams(window.location.search);
                            params.set('page', pageNumber.toString());
                            // Pour la page catégorie, on n’ajoute pas le paramètre categories
                            // On garde les autres filtres pertinents
                            const min = params.get('min_price');
                            const max = params.get('max_price');
                            const colors = params.get('colors');
                            const attribut = params.get('attribut');
                            const gender = params.get('gender');
                            const seller = params.get('seller_mode');
                            const bulk = params.get('bulk_price_range');
                            const clean = new URLSearchParams();
                            clean.set('page', pageNumber.toString());
                            if (min) clean.set('min_price', min);
                            if (max) clean.set('max_price', max);
                            if (colors) clean.set('colors', colors);
                            if (attribut) clean.set('attribut', attribut);
                            if (gender) clean.set('gender', gender);
                            if (seller === 'true') clean.set('seller_mode', 'true');
                            if (bulk) clean.set('bulk_price_range', bulk);
                            return `?${clean.toString()}`;
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <PackageX className="w-16 h-16 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h2>
                        <p className="text-gray-600">Aucun produit n'est disponible dans cette catégorie pour le moment.</p>
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    );
};

export default CategoryProductsPage;