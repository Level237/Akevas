import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X, Check } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByUrlQuery } from "@/services/guardService";
import { useTogglePublishMutation } from "@/services/adminService";
import { toast } from "sonner";
export default function ProductDetailPageAdmin() {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);
  const [togglePublish] = useTogglePublishMutation();
  const [isImageOpen, setIsImageOpen] = useState<string | null>(null);

  // Fonction pour déterminer le type de vente
  const getSaleTypeInfo = (product: any) => {
    if (product.isWholeSale) {
      return {
        type: 'wholesale',
        label: 'Vente en Gros',
        color: 'bg-purple-100 text-purple-700',
        icon: '🏪',
        description: 'Prix de gros disponible',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    } else {
      return {
        type: 'retail',
        label: 'Vente au Détail',
        color: 'bg-blue-100 text-blue-700',
        icon: '🛍️',
        description: 'Prix unitaire',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
  };

  console.log(product)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ed7e0f]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 text-gray-500">
        Produit introuvable.
      </div>
    );
  }

  const handleTogglePublish = async () => {
    const res = await togglePublish({ product_id: product.id });
    console.log(res);
    toast.success("Produit mise a jour avec succès");
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 py-8 px-4">
      {/* Header avec titre et CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{product.product_name}</h1>
          <div className="flex items-center gap-2 mb-3">
            {product.status == 1 ? (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Publié</span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">Non publié</span>
            )}
            <span className="text-xs text-gray-400">Ajouté le {new Date(product.created_at).toLocaleDateString()}</span>
          </div>

          {/* Indicateur type de vente */}
          {(() => {
            const saleInfo = getSaleTypeInfo(product);
            return (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${saleInfo.bgColor} ${saleInfo.borderColor} border`}>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${saleInfo.color}`}>
                  {saleInfo.icon} {saleInfo.label}
                </span>
                <span className="text-sm text-gray-600">{saleInfo.description}</span>
              </div>
            );
          })()}
        </div>
        <div className="flex gap-2">
          <Button

            className={product.status === 1 ? "bg-red-500" : "bg-green-500"}
            onClick={handleTogglePublish}
          //disabled={isToggling}
          >
            {product.status === 1 ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Dépublier le produit
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Publier le produit
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <X className="w-4 h-4 mr-2" /> Retour
          </Button>
        </div>
      </div>

      <Card>
        {/* Bannière type de vente pour les produits en gros */}


        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Colonne images */}
            <div className="md:w-1/3 flex flex-col items-center gap-4">
              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                {
                  product.variations.length > 0 ? (
                    <img
                      src={product.variations[0].images[0] || "/placeholder.svg"}
                      alt={product.product_name}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => setIsImageOpen(product.variations[0].images[0])}
                    />
                  ) : (
                    <img
                      src={product.product_profile || "/placeholder.svg"}
                      alt={product.product_name}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => setIsImageOpen(product.product_profile)}
                    />
                  )
                }
              </div>
              {/* Galerie verticale */}
              {product.images && product.images.length > 0 && (
                <div className="flex md:flex-col gap-2 w-full">
                  {product.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Produit ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded border cursor-pointer"
                      onClick={() => setIsImageOpen(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Colonne infos */}
            <div className="md:w-2/3 flex flex-col gap-6">
              {/* Titre produit */}
              <div>
                <h1 className="text-2xl font-bold mb-1">{product.product_name}</h1>
                <div className="flex items-center gap-2">
                  {product.status == 1 ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Publié</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">Non publié</span>
                  )}
                  <span className="text-xs text-gray-400">Ajouté le {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Section Boutique */}
              <div className="flex items-center max-sm:flex-col gap-4 bg-orange-50 border border-orange-100 rounded-xl p-4 my-2">
                <img
                  src={product.shop_profile || "/placeholder.svg"}
                  alt={product.shop_name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="font-bold text-orange-700">{product.shop_name}</div>
                  <div className="text-xs text-gray-500">
                    Inscrit le {product.shop_created_at ? new Date(product.shop_created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                  onClick={() => navigate(`/admin/shops/${product.shop_id}`)}
                >
                  Voir la boutique
                </Button>
              </div>

              {/* Grille infos produit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Prix :</span>
                  <div className="font-bold text-lg">
                    {product.product_price !== null
                      ? `${Number(product.product_price).toLocaleString()} FCFA`
                      : product.variations && product.variations.length > 0
                        ? (() => {
                          // Récupère tous les prix des variations
                          const allPrices = product.variations
                            .flatMap((v: any) => v.attributes?.map((a: any) => Number(a.price)) || [])
                            .filter((p: number) => !isNaN(p));
                          if (allPrices.length === 0) return "Non défini";
                          const min = Math.min(...allPrices);
                          const max = Math.max(...allPrices);
                          return min === max
                            ? `${min.toLocaleString()} FCFA`
                            : `À partir de ${min.toLocaleString()} FCFA`;
                        })()
                        : "Non défini"
                    }
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Stock :</span>
                  <div className="font-bold text-lg">{product.product_quantity}</div>
                </div>
                <div>
                  <span className="text-gray-500">Type de vente :</span>
                  <div className="mt-1">
                    {(() => {
                      const saleInfo = getSaleTypeInfo(product);
                      return (
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${saleInfo.color}`}>
                            {saleInfo.icon} {saleInfo.label}
                          </span>

                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Catégories :</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.product_categories?.map((cat: any) => (
                      <span key={cat.id} className="bg-gray-100 px-2 py-1 rounded text-xs">{cat.category_name}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Statut :</span>
                  <div>
                    {product.status == 1 ? (
                      <span className="text-green-600 font-semibold">Publié</span>
                    ) : (
                      <span className="text-gray-500 font-semibold">Non publié</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{product.product_description}</p>
              </div>

              {/* Variations si produit variable */}
              {!isLoading && product.variations && product.variations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Variations</h2>
                    {/* Indicateur type de vente dans les variations */}
                    {(() => {
                      const saleInfo = getSaleTypeInfo(product);
                      return (
                        <div className={`px-4 py-2 rounded-lg ${saleInfo.bgColor} ${saleInfo.borderColor} border`}>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${saleInfo.color}`}>
                            {saleInfo.icon} {saleInfo.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="space-y-4">
                    {product?.variations.map((variation: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-5 h-5 rounded-full border"
                            style={{ background: variation.color.hex }}
                            title={variation.color.name}
                          />
                          <span className="font-medium">{variation.color.name}</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-[300px] text-sm">
                            <thead>
                              <tr>
                                {variation.attributes && variation.attributes.length > 0 && (
                                  <th className="px-2 py-1 text-left">Taille</th>
                                )}
                                <th className="px-2 py-1 text-left">Prix</th>
                                <th className="px-2 py-1 text-left">Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variation.attributes ? variation.attributes.map((attr: any) => (
                                <tr key={attr.id}>
                                  <td className="px-2 py-1">{attr.value}</td>
                                  <td className="px-2 py-1">{Number(attr.price).toLocaleString()} FCFA</td>
                                  <td className="px-2 py-1">{attr.quantity}</td>
                                </tr>
                              )) :

                                <tr key={variation.id}>

                                  <td className="px-2 py-1">{variation.price} FCFA</td>
                                  <td className="px-2 py-1">{variation.quantity}</td>
                                </tr>

                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Galerie d'images */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Galerie d'images</CardTitle>
            {/* Indicateur type de vente dans la galerie */}
            {(() => {
              const saleInfo = getSaleTypeInfo(product);
              return (
                <div className={`px-4 py-2 rounded-lg ${saleInfo.bgColor} ${saleInfo.borderColor} border`}>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${saleInfo.color}`}>
                    {saleInfo.icon} {saleInfo.label}
                  </span>
                </div>
              );
            })()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Image principale */}
            <div className="relative group cursor-pointer" onClick={() => setIsImageOpen(product.product_profile)}>
              {
                product.variations.length > 0 ? (
                  <img
                    src={product.variations[0].images[0] || "/placeholder.svg"}
                    alt={product.product_name}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => setIsImageOpen(product.variations[0].images[0])}
                  />
                ) : (
                  <img
                    src={product.product_profile || "/placeholder.svg"}
                    alt={product.product_name}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => setIsImageOpen(product.product_profile)}
                  />
                )
              }
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
            </div>

            {/* Images additionnelles */}


            {product.variations?.map((variation: any) => (
              variation.images?.map((img: string, idx: number) => (
                <div key={`${variation.id}-${idx}`} className="relative group cursor-pointer" onClick={() => setIsImageOpen(img)}>
                  <img
                    src={img}
                    alt={`Image ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                </div>
              ))
            ))}
            {product.product_images?.map((img: any, idx: number) => (
              <div key={idx} className="relative group cursor-pointer" onClick={() => setIsImageOpen(img.path)}>
                <img
                  src={img.path}
                  alt={`Image ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image plein écran */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setIsImageOpen(null)}>
          <img src={isImageOpen} alt="Aperçu" className="max-w-full max-h-[90vh] rounded-lg" />
          <button className="absolute top-8 right-8 text-white" onClick={() => setIsImageOpen(null)}>
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
} 