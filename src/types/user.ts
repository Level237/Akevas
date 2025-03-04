export interface User {
   birthDate: string;
   created_at: string;
   email: string;
   residence: string | null;
   email_verified_at: string | null;
   firstName: string;
   id: number;
   identity_card_in_back: string | null;
   identity_card_in_front: string | null;
   identity_card_with_the_person: string | null;
   isDelivery: number | null;
   isSeller: number | null;
   isWholesaler: number | null;
   lastName: string;
   nationality: string;
   phone_number: string;
   profile: string | null;
   role_id: number;
   updated_at: string;
   userName: string | null;
}