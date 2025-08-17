import { Category, Product } from "./products"

export type Image = {
  id: number,
  path: string
}

export interface Seller {
  id: string
  firstName: string,
  lastName: string,
  phone_number: string,
  identity_card_in_front: string | null,
  identity_card_in_back: string | null,
  identity_card_with_the_person: string | null,
  notifications_is_count: number | null,
  email: string
  avatar: string,
  feedbacks: any[] | null,
  shop: {
    shop_id: string | null,
    shop_name: string | null,
    shop_description: string | null,
    shop_key: string | null,
    categories: Category[] | null,
    shop_profile: string | null,
    products_count: number | null,
    products: Product[] | null,
    isPublished: boolean | null,
    gender: string | null,
    images: Image[] | null,
    isSubscribe: number,
    subscribe_id: number | null,
    coins: string,
    town: string | null,
    quarter: string | null,
    state: string | null,
    review_average: number | null,
    reviewCount: number | null,
    visitTotal: number | null,
    level: string | null,
    cover: string | null,
    orders_count: number | null,
    total_earnings: number | null,
    orders: any[] | null
  },
  role_id: number,

  created_at: string
}

export interface SellerResponse {
  data: {
    data: Seller | null;
  },
  isLoading: boolean
}
