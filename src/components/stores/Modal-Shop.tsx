import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { useGetShopQuery } from "@/services/guardService";
import { ExternalLink,Star, X, PackageOpen, ShoppingBag, Clock, MapPin, UserPlus, Badge, Heart } from "lucide-react";
import { StoreBadges } from "../seller/store-badge";
import { Button } from "../ui/button";
import { Category,Product } from "@/types/products";
import AsyncLink from "../ui/AsyncLink";
import { memo, useCallback, useMemo } from "react";

export default memo(function ModalShop({isModalOpen,setIsModalOpen,shopId}:{isModalOpen:boolean,setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>,shopId:string}) {
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);
  const {data:{data:shop}={},isLoading}=useGetShopQuery(shopId, {
    skip: !isModalOpen
  })
 
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${shop?.shop?.shop_profile})`,
    backgroundPosition: "cover",
    backgroundSize: "cover"
  }), [shop?.shop?.shop_profile]);

  if (!isModalOpen) return null;

  return (
    <>
      <div className="flex justify-center items-center">
        <div onClick={closeModal} className='fixed top-0 z-[999999999999999999999] backdrop-blur-sm bg-[#5a525263] inset-0 w-full h-full' />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-0 top-[5%] z-[99999999999999999999999999] mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-x-auto"
        >
          {isLoading ? (
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Header Skeleton */}
                <div className="relative h-72 w-full bg-gray-200 animate-pulse">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="h-8 w-48 bg-gray-300 rounded-md mb-4" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-20 bg-gray-300 rounded-md" />
                      <div className="h-6 w-20 bg-gray-300 rounded-md" />
                      <div className="h-6 w-20 bg-gray-300 rounded-md" />
                    </div>
                    <div className="h-8 w-32 bg-gray-300 rounded-md" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
                <div className="md:col-span-3">
                  {/* Categories Skeleton */}
                  <div className="mb-6">
                    <div className="h-6 w-48 bg-gray-200 rounded-md mb-4" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>

                  <div className="my-6 h-[1px] bg-gray-200" />

                  {/* Products Skeleton */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6 rounded-xl border bg-gray-50 p-4">
                  <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-[1px] bg-gray-200" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-5 w-5 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded-md mb-2" />
                        <div className="h-3 w-16 bg-gray-200 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <div className="relative h-72 w-full" style={backgroundStyle}>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className='flex items-end justify-between'>
                          <div>
                          <h2 className="text-3xl font-bold">{shop.shop.shop_key}</h2>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg">{shop.shop.review_average}</span>
                          </div>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90">
                            15234 followers
                          </span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90">
                            {shop.shop.products_count} products
                          </span>
                        </div>
                        <div className="mt-4">
                          <StoreBadges
                            isPremium={true}
                            isWholesale={true}
                            isThrift={true}
                          />
                        </div>
                          </div>

                          <div className='max-sm:hidden'>
                            <Button className='bg-transparent max-sm:text-sm hover:bg-black hover:text-white' variant={'outline'}>Suivre la boutique<UserPlus/></Button>
                          </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white  transition-colors hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
                <div className="md:col-span-3">
                  <div className="mb-6">
                    <div className='flex max-sm:mb-6 items-center justify-between'>
                    <h3 className="mb-4 max-sm:mb-0 text-lg font-semibold">Categories de la boutique</h3>
                    <AsyncLink to={`/shop/${shop.shop.shop_id}`}>
                    <Button className="px-12 ma max-sm:flex hidden bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2">
                      Visiter
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    </AsyncLink>
                   
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      {!isLoading && shop.shop.categories.map((category:Category) => (
                          <div
                              key={category.id}
                          className="rounded-lg border bg-gray-50 p-3 text-center"
                        >
                          <div className="text-sm font-medium">{category.category_name}</div>
                          <div className="text-xs text-gray-500">{12} products</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    {!isLoading && shop.shop.products_count > 0 && (
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Featured Products</h3>
                      <Button variant="outline">View All Products</Button>
                    </div>
                    )}
                    <ProductGrid products={shop.shop.products} />
                  </div>
                </div>

                <div className="space-y-6 rounded-xl border bg-gray-50 p-4">
                  <AsyncLink to={`/shop/${shop.shop.shop_id}`}>
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2">
                      Visiter la boutique
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </AsyncLink>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ShoppingBag className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Total Produits</div>
                        <div className="text-sm text-gray-500">{shop.shop.products_count}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Membre depuis</div>
                        <div className="text-sm text-gray-500">{ new Date(shop.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Localisation</div>
                        <div className="text-sm text-gray-500">{shop.shop.town}, Cameroun</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="mb-2 font-medium">Taux de réponse</div>
                      <div className="text-2xl font-bold text-green-600">97.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
)
const ProductGrid = memo(function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 12 * 0.1 }}
      className="group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
        <img
          src={product.product_profile}
          alt={product.product_name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <h4 className="mb-2 line-clamp-2 text-sm font-medium">
        {product.product_name}
      </h4>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{product.product_price} FCFA</span>
        <Badge className="text-xs">
          12 sold
        </Badge>
      </div>
    </motion.div>
  );
});
