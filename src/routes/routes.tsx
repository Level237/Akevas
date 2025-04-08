import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import StoreGenerationPage from "@/pages/auth/seller-registration/StoreGenerationPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import IdentityInfoPage from "@/pages/auth/seller-registration/IdentityInfoPage";
import ProductListPage from "@/pages/ProductListPage";


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
import SellerCatalog from "@/pages/SellerCatalog";
import AccountPage from "@/pages/Account";
import OrdersPage from "@/pages/seller/OrdersPage";
import UpdateShopPage from "@/pages/seller/UpdateShopPage";
import CheckoutPage from "@/pages/seller/CheckoutPage";
import RechargePage from "@/pages/seller/RechargePage";
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/seller/pro',
    element: <StoreBoostPage />
  },
  {
    path: '/login',
    element: <GuardRoute><LoginPage /></GuardRoute>
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
    path: '/checkout',
    element: <CheckoutPage />
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
        path: '/recharge',
        element: <RechargePage />
      },
      {
        path:'/seller/update-docs',
        element:<UpdateShopPage/>
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