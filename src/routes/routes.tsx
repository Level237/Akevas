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
import CreateProductPage from "@/pages/seller/CreateProductPage";
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

import AddressInfoPage from "@/pages/auth/seller-registration/AddressInfoPage";
import DeliveryDashboard from "@/pages/delivery/DashboardPage";
import DeliveriesPage from "@/pages/delivery/DeliveryPage";
import DeliveryRootDashboard from "@/components/Layouts/DeliveryRootDashboard";
import { PrivateRoute } from "@/pages/auth/private-route";
import SellerGuidePage from "@/pages/seller/SellerGuidePage";
import DashboardAdminPage from "@/pages/admin/DashboardPage";
import ShopsPage from "@/pages/ShopsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AdminRootDashboard from "@/components/Layouts/AdminRootDashboard";
import AdminProductListPage from "@/pages/admin/products/ProductPage";
import AdminShopDetailPage from "@/pages/admin/shops/ShopDetailPage";
import AdminShopPage from "@/pages/admin/shops/ShopPage";
import { AuthenticatePage } from "@/pages/auth/AuthenticatePage";
import SellerTypePage from "@/pages/auth/seller-registration/SellerTypePage"; 
import { GuardRoute } from "@/pages/auth/guard-route";
import SellerRootDashboard from "@/components/Layouts/SellerRootDashboard";
import StoreEditorPage from "@/pages/seller/StoreEditorPage";
import MensPage from "@/pages/MensPage";
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/login',
    element: <GuardRoute><LoginPage /></GuardRoute>
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
    path: '/seller-registration/seller-type',
    element: <SellerTypePage />
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
    element:<SellerRootDashboard><PrivateRoute/></SellerRootDashboard>,
    children:[
{
    path: '/seller/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/seller/create-product',
    element: <CreateProductPage />
  },
  {
    path: '/seller/pro',
    element: <StoreBoostPage />
  },
  {

    path: '/shop/editor',
    element: <StoreEditorPage />
  },
  {
    path: '/seller/products',
    element: <DashboardProductListPage  />
  }
    ]
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
    path: '/shop/:id',
    element: <StorePage />
  },
  {
    path:"/",
    element:<AdminRootDashboard><PrivateRoute/></AdminRootDashboard>,
    children:[
      {
        path:"admin/dashboard",
        element:<DashboardAdminPage/>
      },{
        path:"admin/products",
        element:<AdminProductListPage/>
      },{
        path:"admin/shops/:id",
        element:<AdminShopDetailPage/>
      },{
        path:"admin/shops",
        element:<AdminShopPage/>
      }
    ]
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
  },
  {
    path: '/',
    element: <Homepage />,
    
  },{
    path: 'shops',
    element: <ShopsPage />
  },
  {
    path: 'notifications',
    element: <NotificationsPage />
  },
  {
    path:'/authenticate',
    element:<AuthenticatePage/>
  },
  {
    path:'/accueil-homme',
    element:<MensPage/>
  }
]);