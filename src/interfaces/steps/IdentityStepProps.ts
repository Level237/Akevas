import { SellerFormData } from "@/types/seller-registration.types";


export interface IdentityStepProps {
    data: SellerFormData['identityInfo'];
    onUpdate: (data: Partial<SellerFormData>) => void;
  }