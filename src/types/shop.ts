import { Category, Product } from "./products";
import { Image } from "./seller";   


export interface Shop {
    shop_id: string;
    shop_name: string;
    shop_description: string;
    shop_profile: string;
    shop_key: string;
    review_average:number | null,
    reviewCount:number | null,
    products_count: number;
    products: Product[];
    town: string;
    categories: Category[];
    images: Image[];
    quarter: string;

}
