import { useConfirmOrNotShopMutation, useGetSellerQuery } from '@/services/adminService';
import { Seller } from '@/types/seller';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Check, X, MapPin, Phone, Mail, Globe, Package, Users, DollarSign } from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom';
import { CheckStateSeller } from './list-sellers';
import { useState } from 'react';



interface DetailSellerProps{
    shop:Seller,
    isLoading:boolean
}

export default function DetailSeller({shop,isLoading}:DetailSellerProps) {
  const [confirmOrNotShop, {isLoading:isConfirm,isSuccess}] = useConfirmOrNotShopMutation();
  //const [stateSeller,setSeller]=useState(null)
  const navigate=useNavigate()
  const confirm = async (state: string) => {
    if (state === "1") {
      const data = {
        state: state,
        isPublished: true,
        isSeller:true
      };
     const response= await confirmOrNotShop({
        shop_id: shop.shop.shop_id,
        formData: data
      });
      
      
          navigate("/admin/shops")
      
    }else{
       const data = {
        state: state,
        isPublished: false,
        isSeller:false
      };
     const response= await confirmOrNotShop({
        shop_id: shop.shop.shop_id,
        formData: data
      });
      
      
          navigate("/admin/shops")
    }
  }
  return (
       <>
        {isLoading &&
          <div className="flex mt-24 justify-center items-center">
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
          </div>}
       

    
          {!isLoading &&  
          <div><div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Détails de la boutique</h1>
      <div className="space-x-2 max-sm:flex max-sm:flex-col max-sm:gap-4">
        {shop.shop.state!=="2"  && shop.shop.state!=="1" && <Button disabled={isConfirm}  onClick={()=>confirm("2")}  variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
          <X className="mr-2 h-4 w-4" /> Rejeter
        </Button>}
        
        {shop.shop.state!=="1" && <Button disabled={isConfirm}  onClick={()=>confirm("1")} variant="outline" className="bg-green-100 hover:bg-green-200 text-green-600">
          {isLoading ?  <div className="animate-spin inline-block w-5 h-5 size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>: <><Check className="mr-2 h-4 w-4" /> Approuver</>}
          
        </Button>}
        
      </div>
    </div>
     <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{shop?.shop.shop_name}</CardTitle>
          <CardDescription>Nom de la boutique visible : <span className='font-bold text-black'>{shop?.shop.shop_key}</span> </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <img
              src={shop?.shop.shop_profile || "/placeholder.svg"}
              alt={shop?.shop.shop_name || ""}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {shop?.shop.images?.map((img, index) => (
              <img
                key={index}
                src={img.path || "/placeholder.svg"}
                alt={`${shop.shop.shop_name} gallery image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">À propos de {shop?.shop.shop_name}</h2>
            <p>{shop?.shop.shop_description}</p>
            <div className="grid gap-2">
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" /> {shop?.phone_number}
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> {shop?.email}
              </p>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> {shop?.shop.town}
              </p>
              <p className="flex items-center">
                <Globe className="mr-2 h-4 w-4" /> {shop?.shop.quarter}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du propriétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{shop?.firstName}</p>
              <p className="text-sm text-gray-500">{shop?.email}</p>
              <p className="text-sm text-gray-500">{shop?.phone_number}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statut de la boutique</CardTitle>
          </CardHeader>
          <CardContent>
            
             <CheckStateSeller state={shop.shop.state || null} />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Categorie de la boutique</CardTitle>
          </CardHeader>
          <CardContent>
            
             <CheckStateSeller state={shop.shop.state || null} />
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
          
         }
   
       </>
  )
}

export function DetailSellerContainer(){
  const { id } = useParams();
const { data: { data: shop } = {}, isLoading } = useGetSellerQuery(id);

    return <DetailSeller shop={shop} isLoading={isLoading}/>
}
