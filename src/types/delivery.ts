export interface Delivery {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isDelivery: boolean;
    phone_number:string,
  identity_card_in_front:string | null,
  identity_card_with_the_person:string | null,
  role_id:number,
  created_at:string,
  vehicle:Vehicle,
}

export type Vehicle={
    id:number,
    vehicle_model:string,
    vehicle_number:string,
    vehicle_state:string,
    vehicle_type:string,
    vehicle_image:string,
}