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
    idCardFront?: File;
    idCardBack?: File;
    idCardPassport?: File;
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
