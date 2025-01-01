import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import SellerRegistration from "@/pages/auth/SellerRegistration";
import PersonalInfoPage from "@/pages/auth/seller-registration/PersonalInfoPage";
import SecurityInfoPage from "@/pages/auth/seller-registration/SecurityInfoPage";
import ShopInfoPage from "@/pages/auth/seller-registration/ShopInfoPage";
import BankInfoPage from "@/pages/auth/seller-registration/BankInfoPage";
import AddressInfoPage from "@/pages/auth/seller-registration/AddressInfoPage";
import StoreGenerationPage from "@/pages/auth/seller-registration/StoreGenerationPage";
import DashboardPage from "@/pages/seller/DashboardPage";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/seller-registration/personal-info',
    element: <PersonalInfoPage />
  },
  {
    path: '/seller-registration/security-info',
    element: <SecurityInfoPage />
  },
  {
    path: '/seller-registration/shop-info',
    element: <ShopInfoPage />
  },
  {
    path: '/seller-registration/bank-info',
    element: <BankInfoPage />
  },
  {
    path: '/seller-registration/address-info',
    element: <AddressInfoPage />
  },
  {
    path: '/seller-registration/generating',
    element: <StoreGenerationPage />
  },
  {
    path: '/seller/dashboard',
    element: <DashboardPage />
  }
]);