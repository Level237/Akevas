import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import StoreGenerationPage from "@/pages/auth/seller-registration/StoreGenerationPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import IdentityInfoPage from "@/pages/auth/seller-registration/IdentityInfoPage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";

import StorePage from "@/pages/StorePage";
import StoreBoostPage from "@/pages/seller/StoreBoostPage";
import CreateProductPage from "@/pages/seller/CreateProductPage";
import DashboardProductListPage from "@/pages/seller/dashboard/ProductListPage";
import PersonalInfoPage from "@/pages/auth/seller-registration/PersonalInfoPage";
import SecurityInfoPage from "@/pages/auth/seller-registration/SecurityInfoPage";
import ShopInfoPage from "@/pages/auth/seller-registration/ShopInfoPage";

import AddressInfoPage from "@/pages/auth/seller-registration/AddressInfoPage";
import { PrivateRoute } from "@/pages/auth/private-route";
import SellerGuidePage from "@/pages/seller/SellerGuidePage";
import ShopsPage from "@/pages/ShopsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import { AuthenticatePage } from "@/pages/auth/AuthenticatePage";
import SellerTypePage from "@/pages/auth/seller-registration/SellerTypePage";
import { GuardRoute } from "@/pages/auth/guard-route";
import SellerRootDashboard from "@/components/Layouts/SellerRootDashboard";
import StoreEditorPage from "@/pages/seller/StoreEditorPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import SellerCatalog from "@/pages/SellerCatalog";
import AccountPage from "@/pages/Account";
import OrdersPage from "@/pages/seller/OrdersPage";
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
    path: '/register',
    element: <GuardRoute><RegisterPage /></GuardRoute>
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
    path: '/seller-registration/identity-info',
    element: <IdentityInfoPage />
  },
  {
    element: <SellerRootDashboard><PrivateRoute /></SellerRootDashboard>,
    children: [
      {
        path: '/seller/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/seller/create-product',
        element: <CreateProductPage />
      },
      {
        path: "/orders",
        element: <OrdersPage />
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
        element: <DashboardProductListPage />
      },
      {
        path: '/catalogue',
        element: <SellerCatalog />
      },
      {
        path: '/account',
        element: <AccountPage />
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
    path: '/produit/:url',
    element: <ProductDetailPage />
  },


  {
    path: '/shop/:id',
    element: <StorePage />
  },


  {
    path: '/',
    element: <Homepage />,

  }, {
    path: 'shops',
    element: <ShopsPage />
  },
  {
    path: 'notifications',
    element: <NotificationsPage />
  },
  {
    path: '/authenticate',
    element: <AuthenticatePage />
  },


]);