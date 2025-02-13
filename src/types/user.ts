export interface User {
   birthDate: string;
   created_at: string;
   email: string;
   email_verified_at: string | null;
   firstName: string;
   id: number;
   identity_card_in_back: string;
   identity_card_in_front: string;
   identity_card_with_the_person: string;
   isDelivery: number;
   isSeller: number;
   isWholesaler: null | number;
   lastName: string;
   nationality: string;
   phone_number: string;
   profile: string | null;
   role_id: number;
   updated_at: string;
   userName: string | null;
}