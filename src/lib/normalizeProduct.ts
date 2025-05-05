import { Product } from "@/types/products";

export const normalizeProduct = (product: Product) => {
    // Si le produit a des variations et que les champs sont null
    if (
      product.variations &&
      product.variations.length > 0 &&
      (
        !product.product_profile ||
        !product.product_price ||
        !product.product_quantity
      )
    ) {
      const firstVariation = product.variations[0] as any;
      // Si la variation a des attributs (cas 1)
      if (firstVariation?.attributes && firstVariation.attributes.length > 0) {
        const firstAttr = firstVariation.attributes[0];
        return {
          ...product,
          product_profile: firstVariation.images?.[0] || product.product_profile,
          product_price: firstAttr.price || product.product_price,
          product_quantity: firstAttr.quantity || product.product_quantity,
        };
      }
      // Si la variation a directement price/quantity (cas 2)
      return {
        ...product,
        product_profile: firstVariation.images?.[0] || product.product_profile,
        product_price: firstVariation.price || product.product_price,
        product_quantity: firstVariation.quantity || product.product_quantity,
      };
    }
    // Sinon, retourne le produit tel quel
    return product;
  };