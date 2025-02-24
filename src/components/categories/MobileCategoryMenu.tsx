import AsyncLink from "../ui/AsyncLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useGetCurrentHomeByGenderQuery } from "@/services/guardService";
import { Category } from "@/types/products";
import { useState,useMemo } from "react";
import React from "react";
    const MobileCategoryMenu = () => {
        const [currentGenderId,setCurrentGenderId]=useState<number>(1)
 const {data:{data:currentGender}={},isLoading}=useGetCurrentHomeByGenderQuery(currentGenderId,{
  skip:!currentGenderId,
  refetchOnMountOrArgChange:true,
  refetchOnFocus:false,
  refetchOnReconnect:false
 })
    console.log(currentGender)

      const renderCategories=useMemo(()=>{
      if(!currentGender) return null
      return currentGender.categories.map((category:Category)=>(
        <AsyncLink key={category.id} to={`/category/${category.category_url}`} className="group relative overflow-hidden rounded-xl">
          <div className="aspect-square overflow-hidden rounded-xl">
            <img src={category.category_profile} alt={category.category_name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h3 className="text-white font-medium text-lg">{category.category_name}</h3>
          </div>
        </AsyncLink>
      ))
    },[currentGender])
  return (
    <div className="overflow-y-auto h-full pb-20">
      <Tabs defaultValue={currentGenderId.toString()} onValueChange={(value)=>setCurrentGenderId(Number(value))} className="w-full">
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

        {/* Contenu FEMME */}
        <TabsContent value={currentGenderId.toString()} className="mt-0">
          <div className="grid grid-cols-2 gap-4 px-4">
            {!isLoading && currentGender.id===currentGenderId && renderCategories}
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default React.memo(MobileCategoryMenu);