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
    identity_card_in_front?: string;
    identity_card_in_back?: string;
    identity_card_with_the_person?: string;
  };
  // Informations de la boutique
  shopInfo: {
    shopName: string;
    description: string;
    category: string[];
    logo?: File;
    images?: File[];
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
    street: string;
    city: string;
  };
}
