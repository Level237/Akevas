import { Category, Product } from "./products";
import { Image } from "./seller";   


export interface Shop {
    shop_id: string;
    shop_name: string;
    shop_description: string;
    shop_profile: string;
    shop_key: string;
    products_count: number;
    products: Product[];
    coins:string;
    town: string;
    categories: Category[];
    images: Image[];
    quarter: string;

}
