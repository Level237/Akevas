export interface SellerFormData {
  // Informations personnelles
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idCardFront?: File;
    idCardBack?: File;
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
  };
  // Informations bancaires
  bankInfo: {
    bankName: string;
    accountHolder: string;
    iban: string;
    swift: string;
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
