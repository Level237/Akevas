import { useConfirmOrNotDeliveryMutation, useGetDeliveryQuery,  } from '@/services/adminService';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Check, X,Phone, Mail, Globe} from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom';
import { Quarter, Delivery } from '@/types/delivery';




interface DetailDeliveryProps{
    delivery:Delivery,
    isLoading:boolean
}

export default function DetailDelivery({delivery,isLoading}:DetailDeliveryProps) {
  const [confirmOrNotDelivery, {isLoading:isConfirm}] = useConfirmOrNotDeliveryMutation();
  const navigate=useNavigate()
  const confirm = async (state: string) => {
    if (state === "1") {
      const data = {
        isDelivery: 1,
      };
 
      
    await confirmOrNotDelivery({
        delivery_id: 23,
        formData: data
      });
      
      
          navigate("/admin/delivery")
      
    }else{
       const data = {
        isDelivery: 0,
      };
     await confirmOrNotDelivery({
        delivery_id: delivery.id,
        formData: data
      });
      
      
          navigate("/admin/delivery")
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
       <Button disabled={isConfirm}  onClick={()=>confirm("2")}  variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
          <X className="mr-2 h-4 w-4" /> Rejeter
        </Button>
        
       <Button disabled={isConfirm}  onClick={()=>confirm("1")} variant="outline" className="bg-green-100 hover:bg-green-200 text-green-600">
          {isLoading ?  <div className="animate-spin inline-block w-5 h-5 size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>: <><Check className="mr-2 h-4 w-4" /> Approuver</>}
        
        </Button>
        
      </div>
    </div>
     <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{delivery.firstName} {delivery.lastName}</CardTitle>
          <CardDescription>Email : <span className='font-bold text-black'>{delivery.email}</span> </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <img
              src={delivery.vehicle.vehicle_image || "/placeholder.svg"}
              alt={delivery.vehicle.vehicle_model || ""}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
         
          <h2 className='text-xl font-semibold mb-4'>Document personnel du vendeur</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <img src={delivery.identity_card_in_front || "/placeholder.svg"} alt={delivery.vehicle.vehicle_model || ""} width={200} height={200} className="w-full h-32 object-cover rounded-lg" />
            </div>
           
            <div>
              <img src={delivery.identity_card_with_the_person || "/placeholder.svg"} alt={delivery.vehicle.vehicle_model || ""} width={200} height={200} className="w-full h-32 object-cover rounded-lg" />
            </div>
            <div>
              <img src={delivery.drivers_license || "/placeholder.svg"} alt={delivery.vehicle.vehicle_model || ""} width={200} height={200} className="w-full h-32 object-cover rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mt-6">Model du véhicule</h2>
            <p>{delivery.vehicle.vehicle_model}</p>
            <div className="grid gap-2">
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" /> {delivery.phone_number}
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> {delivery.email}
              </p>
              
              <p className="flex items-center">
                <Globe className="mr-2 h-4 w-4" /> {delivery.vehicle.vehicle_number}
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
              <p className="font-semibold">{delivery.firstName}</p>
              <p className="text-sm text-gray-500">{delivery.email}</p>
              <p className="text-sm text-gray-500">{delivery.phone_number}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statut du livreur</CardTitle>
          </CardHeader>
          <CardContent>
            {delivery.isDelivery===0 && <div className='bg-red-100 text-red-700 p-2 w-fit rounded-md'>non approuvé</div>}
            {delivery.isDelivery===1 && <div className='bg-green-100 text-green-700 p-2 w-fit rounded-md'>Approuvé</div>}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Quartier de livraison</CardTitle>
          </CardHeader>
          <CardContent>
              <div className='flex flex-wrap gap-2'>
             {delivery.vehicle.quarters?.map((quarter:Quarter,index:number)=>(
              <p className='text-sm bg-gray-100 p-2 rounded-md' key={index}>{quarter.quarter_name}</p>
             ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
          
         }
   
       </>
  )
}

export function DetailDeliveryContainer(){
  const { id } = useParams();
const { data: { data: delivery } = {}, isLoading } = useGetDeliveryQuery(id);

    return <DetailDelivery delivery={delivery} isLoading={isLoading}/>
}
