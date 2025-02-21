import { Image } from "./seller";

export interface Product{
    id:string,
    product_name:string,
    product_price:string,
    product_quantity:number,
    shop_key:string,
    product_description:string,
    product_profile:string,
    shop_profile:string,
    shop_created_at:string,
    shop_id:string,
<<<<<<< HEAD
=======
    product_url:string,
>>>>>>> f5122a9 (update)
    product_images:Image[],
    product_categories:Category[],
    product_attributes:string[] | null,
    product_variants:string[] | null,
    status:boolean,
    created_at:string,
}

export type Category = {
    id:string,
    category_name:string,
}