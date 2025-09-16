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
import { useQueryState } from 'nuqs';

const CategoryProductsPage = () => {
    const { url } = useParams<{ url: string }>();
    const { data: category } = useGetCategoryByUrlQuery(url);
    // URL filters (no categories here)
    const [pageParam] = useQueryState('page', { defaultValue: '1', parse: (v) => v || '1', serialize: (v) => v });
    const currentPage = parseInt(pageParam || '1', 10);
    const [minPrice] = useQueryState('min_price', { defaultValue: 0, parse: (v) => parseInt(v, 10) || 0, serialize: (v) => v.toString() });
    const [maxPrice] = useQueryState('max_price', { defaultValue: 500000, parse: (v) => parseInt(v, 10) || 500000, serialize: (v) => v.toString() });
    const [selectedColors] = useQueryState('colors', { defaultValue: [], parse: (v) => v ? v.split(',') : [], serialize: (a) => a.length ? a.join(',') : '' });
    const [selectedAttributes] = useQueryState('attribut', { defaultValue: [], parse: (v) => v ? v.split(',').map((x)=>parseInt(x,10)).filter(n=>!isNaN(n)) : [], serialize: (a) => a.length ? a.join(',') : '' });
    const [selectedGenders] = useQueryState('gender', { defaultValue: [], parse: (v) => v ? v.split(',').map((x)=>parseInt(x,10)).filter(n=>!isNaN(n)) : [], serialize: (a) => a.length ? a.join(',') : '' });
    const [isSellerMode] = useQueryState('seller_mode', { defaultValue: false, parse: (v) => v === 'true', serialize: (v) => v ? 'true' : '' });
    const [selectedBulkPriceRange] = useQueryState('bulk_price_range', { defaultValue: '', parse: (v) => v || '', serialize: (v) => v || '' });

    const { data: categoryData, isLoading } = useGetCategoryProductsByUrlQuery({
        url: url as string,
        page: currentPage,
        min_price: minPrice,
        max_price: maxPrice,
        colors: selectedColors,
        attribut: selectedAttributes,
        gender: selectedGenders,
        seller_mode: isSellerMode,
        bulk_price_range: selectedBulkPriceRange
    });
    const hasProducts = !isLoading && categoryData && categoryData.productList && categoryData.productList.length > 0;

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
                        products={categoryData.productList}
                        isLoadingOverride={isLoading}
                        totalPagesOverride={categoryData.totalPagesResponse}
                        currentPageOverride={currentPage}
                        presetCategoryIds={category?.data?.id ? [category.data.id] : []}
                        showCategories={false}
                        hero={null}
                        getPageUrlOverride={(pageNumber) => {
                            const params = new URLSearchParams(window.location.search);
                            // Reconstruire sans le paramètre categories
                            const clean = new URLSearchParams();
                            clean.set('page', pageNumber.toString());
                            const min = params.get('min_price');
                            const max = params.get('max_price');
                            const colors = params.get('colors');
                            const attribut = params.get('attribut');
                            const gender = params.get('gender');
                            const seller = params.get('seller_mode');
                            const bulk = params.get('bulk_price_range');
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