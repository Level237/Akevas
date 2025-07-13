import { useConfirmOrNotShopMutation, useGetSellerQuery } from '@/services/adminService';
import { Seller } from '@/types/seller';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import { Check, X, MapPin, Phone, Mail, Globe, ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom';
import { CheckStateSeller } from './list-sellers';

interface DetailSellerProps{
    shop:Seller,
    isLoading:boolean
}

// Ajout du composant ImageViewer
const ImageViewer = ({ src, onClose }: { src: string; onClose: () => void }) => {
  if (!src || src === "/placeholder.svg") return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={src}
          alt="Image en plein écran"
          className="max-w-full max-h-[90vh] object-contain"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};

export default function DetailSeller({shop,isLoading}:DetailSellerProps) {
  const [confirmOrNotShop, {isLoading:isConfirm}] = useConfirmOrNotShopMutation();
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const confirm = async (state: string) => {
    if (state === "1") {
      const data = {
        state: state,
        isPublished: true,
        shop_level:"2",
        isSeller:true
      };
      await confirmOrNotShop({
        shop_id: shop.shop.shop_id,
        formData: data
      });
      navigate("/admin/shops")
    }
  }

  const decline=async()=>{
    if (rejectReason.trim()) {
      const data = {
        state: "2",
        isPublished: false,
        isSeller:false,
        shop_level:"1",
        user_id:shop.id,
        message: rejectReason
      };
      const res=await confirmOrNotShop({
        shop_id: shop.shop.shop_id,
        formData: data
      });
      console.log(res)
      setOpenRejectDialog(false);
      navigate("/admin/shops")
    }
  }

  const handleImageClick = (imageSrc: string | undefined) => {
    if (imageSrc && imageSrc !== "/placeholder.svg") {
      setSelectedImage(imageSrc);
    }
  };

  return (
    <>
      {isLoading &&
        <div className="flex mt-24 justify-center items-center">
          <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }

      {!isLoading &&  
        <div>
          {/* Bouton retour */}
          <div className="mb-4">
            <Button
              variant="ghost"
              className="flex items-center cursor-pointer gap-2"
              onClick={() => navigate("/admin/shops")}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste des boutiques
            </Button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Détails de la boutique</h1>
            <div className="space-x-2 max-sm:flex max-sm:flex-col max-sm:gap-4">
              {shop.shop.state!=="2"  && shop.shop.state!=="1" && (
                <Button disabled={isConfirm}  onClick={()=>setOpenRejectDialog(true)} variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
                  <X className="mr-2 h-4 w-4" /> Rejeter
                </Button>
              )}
              {shop.shop.state!=="1" && (
                <Button disabled={isConfirm}  onClick={()=>confirm("1")} variant="outline" className="bg-green-100 hover:bg-green-200 text-green-600">
                  {isLoading ?  <div className="animate-spin inline-block w-5 h-5 size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                  </div>: <><Check className="mr-2 h-4 w-4" /> Approuver</>}
                </Button>
              )}
              <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Rejeter la boutique</DialogTitle>
                    <DialogDescription>
                      Veuillez expliquer le motif du rejet de cette boutique. Cette information sera envoyée au vendeur.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder="Saisissez le motif du rejet..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenRejectDialog(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => decline()}
                      disabled={!rejectReason.trim()}
                    >
                      Confirmer le rejet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{shop?.shop.shop_name}</CardTitle>
                <CardDescription>Nom de la boutique visible : <span className='font-bold text-black'>{shop?.shop.shop_key}</span> </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedImage && (
                  <ImageViewer 
                    src={selectedImage} 
                    onClose={() => setSelectedImage(null)} 
                  />
                )}
                <div className="mb-6">
                  <img
                    src={shop?.shop.shop_profile || "/placeholder.svg"}
                    alt={shop?.shop.shop_name || ""}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(shop?.shop.shop_profile || "")}
                  />
                </div>
                <h2 className='text-xl font-semibold mb-4'>Galerie de la boutique</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {shop?.shop.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img.path || "/placeholder.svg"}
                      alt={`${shop.shop.shop_name} gallery image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(img.path)}
                    />
                  ))}
                </div>
                <h2 className='text-xl font-semibold mb-4'>Document personnel du vendeur</h2>
                <div className='grid grid-cols-3 gap-4'>
                  {[
                    shop?.identity_card_in_front,
                    shop?.identity_card_in_back,
                    shop?.identity_card_with_the_person
                  ].map((src, index) => (
                    <div key={index}>
                      <img
                        src={src || "/placeholder.svg"}
                        alt={shop?.shop.shop_name || ""}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(src || "")}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mt-6">À propos de {shop?.shop.shop_name}</h2>
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
                  <div className='flex flex-wrap gap-2'>
                    {shop.shop.categories?.map((category,index)=>(
                      <p className='text-sm bg-gray-100 p-2 rounded-md' key={index}>{category.category_name}</p>
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

export function DetailSellerContainer(){
  const { id } = useParams();
  const { data: { data: shop } = {}, isLoading } = useGetSellerQuery(id);

  return <DetailSeller shop={shop} isLoading={isLoading}/>
}
