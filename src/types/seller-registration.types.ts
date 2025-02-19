export interface SellerFormData {
  // Informations personnelles
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthPlace: string;
    nationality: string;
  };

  identityInfo: {
    identity_card_in_front: string | null;
    identity_card_in_back: string | null;
    identity_card_with_the_person: string | null;
  };
  // Informations de la boutique
  shopInfo: {
    shopName: string;
    description: string;
    category: string[];
    logo: string | null;
    images: string[];
    gender: number;
  };
  // Informations bancaires
  bankInfo: {
    sellerType: string;
    productType: string;

  };
  securityInfo: {
    password: string;
    confirmPassword: string;
  };
  // Informations d'adresse
  addressInfo: {
    street: string | null;
    city: string | null;
  };
}
