export interface SellerFormData {
  // Informations personnelles
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idCardFront?: File;
    idCardBack?: File;
    idCardPassport?: File;
    birthDate: string;
    birthPlace: string;
    nationality: string;
  };
  // Informations de la boutique
  shopInfo: {
    shopName: string;
    description: string;
    category: string;
    subCategory: string;
    logo?: File;
  };
  // Informations bancaires
  bankInfo: {
    sellerType: string;
    productType: string;

  };
  // Informations d'adresse
  addressInfo: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}
