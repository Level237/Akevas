type image={
  id:number,
  path:string
}

export interface Seller {
  id: string
  firstName: string,
  phone_number:string,
  email: string
  avatar: string,
  shop:{
    shop_id:string | null, 
    shop_name:string | null,
    shop_description:string | null,
    shop_key:string | null,
    shop_profile:string | null,
    products_count:number | null,
    isPublished:boolean | null,
    images:image[] | null,
    town:string | null,
    quarter:string | string,
  },
  role: number,
  
  created_at: string
}

