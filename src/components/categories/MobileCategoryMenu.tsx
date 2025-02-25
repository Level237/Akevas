import AsyncLink from "../ui/AsyncLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useGetCurrentHomeByGenderQuery } from "@/services/guardService";
import { Category } from "@/types/products";
import { useState, useMemo, useCallback } from "react";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCategories, setCurrentGenderId } from '@/store/features/categorySlice';
import { RootState } from '@/store';

// Déplacer le composant de catégories dans un composant séparé
const CategoryGrid = React.memo(({ categories }: { categories: Category[] }) => (
    <div className="grid grid-cols-2 gap-4">
        {categories.map((category: Category) => (
            <AsyncLink 
                key={category.id} 
                to={`/category/${category.category_url}`} 
                className="group relative overflow-hidden rounded-xl"
            >
                <div className="aspect-square overflow-hidden rounded-xl">
                    <img 
                        src={category.category_profile} 
                        alt={category.category_name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-medium text-lg">{category.category_name}</h3>
                </div>
            </AsyncLink>
        ))}
    </div>
));

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ed7e0f]"></div>
    </div>
);

const MobileCategoryMenu = () => {
    const dispatch = useDispatch();
    const { categories, currentGenderId } = useSelector((state: RootState) => state.categories);
    
    const {data: {data: currentGender} = {}, isLoading} = useGetCurrentHomeByGenderQuery(currentGenderId, {
        skip: !currentGenderId,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
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
        dispatch(setCurrentGenderId(Number(value)));
    }, [dispatch]);

    const currentCategories = categories[currentGenderId];

    return (
        <div className="overflow-y-auto h-full pb-20">
            <Tabs defaultValue={currentGenderId.toString()} onValueChange={handleTabChange} className="w-full">
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

                <TabsContent value={currentGenderId.toString()} className="mt-0">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        currentCategories && <CategoryGrid categories={currentCategories} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default React.memo(MobileCategoryMenu);