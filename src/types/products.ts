import { Image } from "./seller";

export interface Product {
    id: string,
    product_name: string,
    product_price: string,
    product_quantity: number,
    shop_key: string,
    product_description: string,
    product_profile: string,
    shop_profile: string,
    product_url: string,
    shop_created_at: string,
    shop_id: string,
    review_average:number | null,
    reviewCount:number | null,
    product_images: Image[],
    product_categories: Category[],
    residence: string,
    product_attributes: string[] | null,
    product_variants: string[] | null,
    variants: Variant[] | null,
    status: boolean,
    created_at: string,
}

export type Variant = {
    id: string,
    variant_name: string,
    image: string,
    price: string,
    images: string[] | null,
}
export type Category = {
    id: string,
    category_name: string,
    products_count: number | null,
    category_url: string,
    category_profile: string,
    category_description: string,
    category_parent_id: string,
    category_created_at: string,
}