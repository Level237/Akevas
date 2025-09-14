import AsyncLink from "../ui/AsyncLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useGetCurrentHomeByGenderQuery, useGetCategoriesQuery } from "@/services/guardService";
import { Category } from "@/types/products";
import { useCallback,useState } from "react";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCategories, setCurrentGenderId } from '@/store/features/categorySlice';
import { RootState } from '@/store';
import { motion } from "framer-motion";
import OptimizedImage from "../OptimizedImage";

// Déplacer le composant de catégories dans un composant séparé
const CategoryGrid = React.memo(({ categories }: { categories: Category[] }) => (
    <div className="grid sm:grid-cols-2 md:mt-12 md:grid-cols-3 gap-4">
        {categories.map((category: Category) => (
            <AsyncLink
                key={category.id}
                to={`/c/${category.category_url}`}
                className="group relative overflow-hidden rounded-xl"
            >
                <div className="aspect-square overflow-hidden rounded-xl">
                    <OptimizedImage
                        src={category.category_profile}
                        alt={category.category_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-medium text-lg">{category.category_name}</h3>
                </div>
            </AsyncLink>
        ))}
    </div>
));



const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>
        ))}
    </div>
);

const MobileCategoryMenu = React.memo(() => {
    const dispatch = useDispatch();
    const { categories, currentGenderId } = useSelector((state: RootState) => state.categories);
    
    const [isTabChanging, setIsTabChanging] = useState(false);

    const { data: { data: currentGender } = {}, isLoading } = useGetCurrentHomeByGenderQuery(currentGenderId, {
        skip: !currentGenderId,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    });

    const {  isLoading: categoriesLoading } = useGetCategoriesQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    // Mettre à jour le store quand les données arrivent
    React.useEffect(() => {
        if (currentGender?.categories) {
            dispatch(setCategories({
                genderId: currentGenderId,
                categories: currentGender.categories
            }));
        }
    }, [currentGender?.categories, currentGenderId, dispatch]);

    const handleTabChange = useCallback((value: string) => {
        setIsTabChanging(true);
        dispatch(setCurrentGenderId(Number(value)));
        
        // Court délai pour montrer le skeleton
        setTimeout(() => {
            setIsTabChanging(false);
        }, 300);
    }, [dispatch]);

    const currentCategories = categories[currentGenderId];

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="overflow-y-auto h-full pb-20">
            <Tabs 
                defaultValue={currentGenderId.toString()} 
                onValueChange={handleTabChange} 
                className="w-full"
            >
                <TabsList className="w-full grid grid-cols-3 bg-transparent border-b mb-6">
                    <TabsTrigger
                        value="1"
                        className={cn(
                            "pb-4 text-base data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        HOMME
                    </TabsTrigger>
                    <TabsTrigger
                        value="2"
                        className={cn(
                            "pb-4 text-base data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        FEMME
                    </TabsTrigger>
                    <TabsTrigger
                        value="3"
                        className={cn(
                            "pb-4 text-base data-[state=active]:text-[#ed7e0f] data-[state=active]:border-b-2 data-[state=active]:border-[#ed7e0f] rounded-none"
                        )}
                    >
                        ENFANT
                    </TabsTrigger>
                </TabsList>

                <TabsContent 
                    value={currentGenderId.toString()} 
                    className="mt-0"
                    asChild
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: 0.15,
                            ease: "easeOut"
                        }}
                    >
                        {(categoriesLoading || isTabChanging) ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                            >
                                <LoadingSkeleton />
                            </motion.div>
                        ) : (
                            currentCategories && <CategoryGrid categories={currentCategories} />
                        )}
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
});

MobileCategoryMenu.displayName = 'MobileCategoryMenu';

export default MobileCategoryMenu;