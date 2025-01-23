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
import DashboardProductListPage from "@/pages/seller/dashboard/ProductListPage";
import DeliveryRegisterPage from "@/pages/auth/delivery-registration/DeliveryRegisterPage";
import VehicleInfoPage from "@/pages/auth/delivery-registration/VehicleInfoPage";
import DeliveryZonePage from "@/pages/auth/delivery-registration/DeliveryZonePage";
import DocumentsPage from "@/pages/auth/delivery-registration/DocumentsPage";
import ValidationPage from "@/pages/auth/delivery-registration/ValidationPage";
import DeliveryGenerationPage from "@/pages/auth/delivery-registration/DeliveryGenerationPage";
import PersonalInfoPage from "@/pages/auth/seller-registration/PersonalInfoPage";
import SecurityInfoPage from "@/pages/auth/seller-registration/SecurityInfoPage";
import ShopInfoPage from "@/pages/auth/seller-registration/ShopInfoPage";
import BankInfoPage from "@/pages/auth/seller-registration/BankInfoPage";
import AddressInfoPage from "@/pages/auth/seller-registration/AddressInfoPage";
import DeliveryDashboard from "@/pages/delivery/DashboardPage";
import DeliveriesPage from "@/pages/delivery/DeliveryPage";
import DeliveryRootDashboard from "@/components/Layouts/DeliveryRootDashboard";
import { PrivateRoute } from "@/pages/auth/private-route";
import SellerGuidePage from "@/pages/seller/SellerGuidePage";
import DashboardAdminPage from "@/pages/admin/DashboardPage";

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
    path: '/delivery/register',
    element: <DeliveryRegisterPage />
  },
  {
    path: '/delivery/vehicle',
    element: <VehicleInfoPage />
  },
  {
    path: '/delivery/zone',
    element: <DeliveryZonePage />
  },
  {
    path: '/delivery/documents',
    element: <DocumentsPage />
  },
  {
    path: '/delivery/validation',
    element: <ValidationPage />
  },
  {
    path: '/delivery/generating',
    element: <DeliveryGenerationPage />
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
    path: '/seller/create-product',
    element: <CreateProductPage />
  },
  {
    path: '/seller/boost',
    element: <StoreBoostPage />
  },
  {
    path: '/seller/products',
    element: <DashboardProductListPage  />
  },
  {
    path: '/seller/guide',
    element: <SellerGuidePage />
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
  },
  {
    path:"/dashboard/admin",
    element:<DashboardAdminPage/>
  },
  {
    path: '/',
    element: <DeliveryRootDashboard><PrivateRoute/></DeliveryRootDashboard>,
    children:[
      {
        path: 'delivery/dashboard',
        element: <DeliveryDashboard />
      },{
        path:'delivery/orders',
        element: <DeliveriesPage />
      },
    ]
  }
]);