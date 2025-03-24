import { Category, Product } from "./products"

export type Image={
  id:number,
  path:string
}

export interface Seller {
  id: string
  firstName: string,
  phone_number:string,
  identity_card_in_front:string | null,
  identity_card_in_back:string | null,
  identity_card_with_the_person:string | null,
  email: string
  avatar: string,
  shop:{
    shop_id:string | null, 
    shop_name:string | null,
    shop_description:string | null,
    shop_key:string | null,
    categories:Category[] | null,
    shop_profile:string | null,
    products_count:number | null,
    review_average:number | null,
    reviewCount:number | null,
    products:Product[] | null,
    isPublished:boolean | null,
    orders_count:number | null,
    images:Image[] | null,
    town:string | null,
    quarter:string | null,
    state:string | null,
    level:string | null,
    cover:string | null
  },
  role_id: number,
  
  created_at: string
}

export interface SellerResponse {
  data:{
    data: Seller |null;
  },
  isLoading:boolean
}
