import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";

// Components & UI
import AsyncLink from "../ui/AsyncLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import OptimizedImage from "../OptimizedImage";

// Services & Types
import { useGetCurrentHomeByGenderQuery } from "@/services/guardService";
import { Category } from "@/types/products";
import { setCurrentGenderId } from '@/store/features/categorySlice';
import { RootState } from '@/store';

// ✅ COMPOSANT GRILLE MÉMOÏSÉ (Déjà bien fait, on le garde)
const CategoryGrid = React.memo(({ categories, onClick }: { categories: Category[], onClick?: () => void }) => {
    if (!categories || categories.length === 0) {
        return <div className="text-center text-gray-500 py-8">Aucune catégorie trouvée.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:mt-12">
            {categories.map((category) => (
                <AsyncLink
                    key={category.id}
                    to={`/c/${category.category_url}`}
                    OnClick={onClick}
                    className="group relative overflow-hidden rounded-xl block"
                >
                    <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                        <OptimizedImage
                            src={category.category_profile}
                            alt={category.category_name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"

                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h3 className="text-white font-medium text-lg drop-shadow-md">{category.category_name}</h3>
                    </div>
                </AsyncLink>
            ))}
        </div>
    );
});
CategoryGrid.displayName = 'CategoryGrid';

const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>
        ))}
    </div>
);

// ✅ COMPOSANT PRINCIPAL OPTIMISÉ
const MobileCategoryMenu = React.memo(({ onClick }: { onClick?: () => void }) => {
    const dispatch = useDispatch();

    // On lit uniquement l'ID actuel du store. Pas besoin de lire les catégories du store.
    const currentGenderId = useSelector((state: RootState) => state.categories.currentGenderId);

    // ✅ REQUÊTE UNIQUE ET SÉCURISÉE
    // RTK Query gère automatiquement le cache. Si on a déjà vu "Homme", c'est instantané.
    const {
        data: genderData,
        isLoading,
        isFetching
    } = useGetCurrentHomeByGenderQuery(currentGenderId, {
        skip: !currentGenderId,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    // ✅ EXTRACTION DIRECTE DES DONNÉES (Plus de dispatch manuel dans useEffect)
    // On s'adapte à la structure de ta réponse API (ajuste '.data.categories' si ta structure est différente)
    const categoriesToDisplay = useMemo(() => {
        return genderData?.data?.categories || genderData?.categories || [];
    }, [genderData]);

    const handleTabChange = useCallback((value: string) => {
        // ✅ Mise à jour simple et immédiate. Pas de setTimeout artificiel.
        dispatch(setCurrentGenderId(Number(value)));
    }, [dispatch]);

    // ✅ GESTION INTELLIGENTE DU SKELETON
    // On affiche le skeleton SEULEMENT au tout premier chargement (isLoading)
    // OU si on change d'onglet ET que les données ne sont PAS encore en cache (isFetching && !genderData)
    const shouldShowSkeleton = isLoading || (isFetching && !genderData);

    return (
        <div className="overflow-y-auto h-full pb-20 no-scrollbar">
            <Tabs
                value={currentGenderId.toString()}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="w-full grid grid-cols-3 bg-transparent border-b mb-6">
                    <TabsTrigger
                        value="1"
                        className={cn(
                            "pb-4 text-base font-medium transition-all",
                            "data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        HOMME
                    </TabsTrigger>
                    <TabsTrigger
                        value="2"
                        className={cn(
                            "pb-4 text-base font-medium transition-all",
                            "data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        FEMME
                    </TabsTrigger>
                    <TabsTrigger
                        value="3"
                        className={cn(
                            "pb-4 text-base font-medium transition-all",
                            "data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        ENFANT
                    </TabsTrigger>
                </TabsList>

                {/* ✅ ANIMATE PRESENCE POUR DES TRANSITIONS FLUIDES SANS SQUELETON ARTIFICIEL */}
                <AnimatePresence mode="wait">
                    <TabsContent value={currentGenderId.toString()} className="mt-0" forceMount>
                        {shouldShowSkeleton ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <LoadingSkeleton />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`content-${currentGenderId}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <CategoryGrid categories={categoriesToDisplay} onClick={onClick} />
                            </motion.div>
                        )}
                    </TabsContent>
                </AnimatePresence>
            </Tabs>
        </div>
    );
});

MobileCategoryMenu.displayName = 'MobileCategoryMenu';

export default MobileCategoryMenu;