import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import StoreGenerationPage from "@/pages/auth/seller-registration/StoreGenerationPage";
import DashboardPage from "@/pages/seller/DashboardPage";
import IdentityInfoPage from "@/pages/auth/seller-registration/IdentityInfoPage";


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
import { AuthenticatePage } from "@/pages/auth/AuthenticatePage";
import SellerTypePage from "@/pages/auth/seller-registration/SellerTypePage";
import { GuardRoute } from "@/pages/auth/guard-route";
import SellerRootDashboard from "@/components/Layouts/SellerRootDashboard";
import StoreEditorPage from "@/pages/seller/StoreEditorPage";
import SellerCatalog from "@/pages/SellerCatalog";
import AccountPage from "@/pages/Account";
import OrdersPage from "@/pages/seller/OrdersPage";
import OrderDetailPage from "@/pages/seller/OrderDetailPage";
import UpdateShopPage from "@/pages/seller/UpdateShopPage";
import CheckoutBoostPage from "@/pages/seller/CheckoutBoostPage";
import RechargePage from "@/pages/seller/RechargePage";
import CheckoutRechargePage from "@/pages/seller/CheckoutPage";
import MobileMoneyPaymentPage from "@/pages/MobileMoneyPaymentPage";
import StoreCustomizationPage from "@/pages/StoreCustomizationPage";
import HelpCenterPage from "@/pages/HelpCenterPage";
import ReviewsPage from "@/pages/seller/ReviewsPage";
import EditProductPage from "@/pages/seller/EditProductPage";
import NotificationsPage from "@/pages/dashboard/seller/notifications";
import ConfirmationPage from "@/pages/seller/ConfirmationPage";
import NotFoundPage from "@/pages/NotFoundPage";
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  },
  {
    path: '/payment/mobile-money',
    element: <MobileMoneyPaymentPage />
  },
  {
    path: '/seller/pro',
    element: <StoreBoostPage />
  },
  {
    path: '/coins/confirmation',
    element: <ConfirmationPage />
  },
  {
    path: '/coins/ticket/:ref',
    element: <ConfirmationPage />
  },
  {
    path: '/',
    element: <GuardRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/authenticate',
        element: <AuthenticatePage />
      },
      {
        path: '/seller-registration/personal-info',
        element: <PersonalInfoPage />
      }, {
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
    ]
  },


  {
    path: '/help',
    element: <HelpCenterPage />
  },

  {
    path: '/checkout/boost',
    element: <CheckoutBoostPage />
  },
  {
    path: '/checkout/recharge',
    element: <CheckoutRechargePage />
  },

  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <SellerRootDashboard />,
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
            path: '/seller/product/edit/:url',
            element: <EditProductPage />
          },
          {
            path: "/orders",
            element: <OrdersPage />
          },
          {
            path: '/seller/orders/:orderId',
            element: <OrderDetailPage />
          },
          {
            path: '/recharge',
            element: <RechargePage />
          },
          {
            path: '/seller/update-docs',
            element: <UpdateShopPage />
          },
          {
            path: '/shop-reviews',
            element: <ReviewsPage />
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
          },
          {
            path: '/shop/customize',
            element: <StoreCustomizationPage />
          },

          {
            path: 'seller/notifications',
            element: <NotificationsPage />
          },
          {
            path: 'seller/notifications/:notificationId',
            element: <NotificationsPage />
          },
        ]
      },

    ]
  },
  {
    path: '/seller/guide',
    element: <SellerGuidePage />
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




]);