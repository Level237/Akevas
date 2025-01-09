import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";


import StoreGenerationPage from "@/pages/auth/seller-registration/StoreGenerationPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import IdentityInfoPage from "@/pages/auth/seller-registration/IdentityInfoPage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import StorePage from "@/pages/StorePage";
import CheckoutPage from "@/pages/CheckoutPage";
import StoreBoostPage from "@/pages/seller/StoreBoostPage";
import CreateProductPage from "@/pages/seller/dashboard/CreateProductPage";
import DeliveryRegisterPage from "@/pages/auth/delivery-registration/DeliveryRegisterPage";
import VehicleInfoPage from "@/pages/auth/delivery-registration/VehicleInfoPage";
import SellerRegistration from "@/pages/auth/SellerRegistration";
import PersonalInfoPage from "@/pages/auth/seller-registration/PersonalInfoPage";
import SecurityInfoPage from "@/pages/auth/seller-registration/SecurityInfoPage";
import ShopInfoPage from "@/pages/auth/seller-registration/ShopInfoPage";
import BankInfoPage from "@/pages/auth/seller-registration/BankInfoPage";
import AddressInfoPage from "@/pages/auth/seller-registration/AddressInfoPage";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/delivery/register',
    element: <DeliveryRegisterPage />
  },
  {
    path: '/auth/delivery/vehicle',
    element: <VehicleInfoPage />
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
    path:'/seller-registration/identity-info',
    element: <IdentityInfoPage />
  },
  {
    path: '/seller/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/seller/dashboard/create-product',
    element: <CreateProductPage />
  },
  {
    path: '/seller/boost',
    element: <StoreBoostPage />
  },
  {
    path: '/delivery/register',
    element: <DeliveryRegisterPage />
  },
  {
    path: '/delivery/register/vehicle',
    element: <VehicleInfoPage />
  },
  {
    path: '/products',
    element: <ProductListPage />
  },
  {
    path: '/products/:id',
    element: <ProductDetailPage />
  },
  {
    path: '/cart',
    element: <CartPage />
  },
  {
    path: '/checkout',
    element: <CheckoutPage />
  },
  {
    path: '/stores/:code',
    element: <StorePage />
  }
]);