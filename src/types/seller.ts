export interface Seller {
  id: string
  firstName: string
  email: string
  avatar: string,
  shop:{ shop_name:string | null,shop_profile:string | null,products_count:number | null,status:boolean | null},
  role: number,
  
  created_at: string
}