import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";


import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import StorePage from "@/pages/StorePage";
import CheckoutPage from "@/pages/CheckoutPage";

import { PrivateRoute } from "@/pages/auth/private-route";
import DashboardAdminPage from "@/pages/admin/DashboardPage";
import ShopsPage from "@/pages/ShopsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AdminRootDashboard from "@/components/Layouts/AdminRootDashboard";
import AdminProductListPage from "@/pages/admin/products/ProductPage";
import AdminShopDetailPage from "@/pages/admin/shops/ShopDetailPage";
import AdminShopPage from "@/pages/admin/shops/ShopPage";
import { AuthenticatePage } from "@/pages/auth/AuthenticatePage";
import { GuardRoute } from "@/pages/auth/guard-route";
import CurrentHomeByGenderPage from "@/pages/gender/CurrentHomeByGenderPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import UserDashboardPage from "@/pages/user/DashboardPage";
import ListDeveryPage from "@/pages/admin/delivery/ListDeveryPage";
import DeliveryDetailPage from "@/pages/admin/delivery/DeliveryDetailPage";
import PaymentPage from "@/pages/payment/PaymentPage";
import SuccessPage from "@/pages/payment/SuccessPage";
import OrderDetailPage from "@/pages/user/OrderDetailPage";
import OrdersPage from "@/pages/user/OrdersPage";
import ListCustomerPage from "@/pages/admin/customers/ListCustomerPage";
import ListOrdersPage from "@/pages/admin/orders/ListOrdersPage";
import LoginPage from "@/pages/auth/LoginPage";
import AdminLoginPage from "@/pages/admin/LoginPage";
import AccountPage from "@/pages/AccountPage";
import CategoryProductsPage from "@/pages/category/CategoryProductsPage";
import UserRootDashboard from "@/components/Layouts/UserRootDashboard";
import ListReviewPage from "@/pages/admin/reviews/ListReviewPage";
import ListFeedbackPage from "@/pages/admin/feedbacks/ListFeedbackPage";
import ListShopReviewPage from "@/pages/admin/reviews/ListShopReviewPage";
import SucessPaymentPage from "@/pages/payment/notchpay/SucessPaymentPage";
import MobileMoneyPaymentPage from "@/pages/user/MobileMoneyPaymentPage";
import AddShopPage from "@/pages/admin/shops/add-shop";
import CatalogPage from "@/pages/CatalogPage";
import LegalTermsPage from "@/pages/LegalTerms";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsOfUsePage from "@/pages/TermsOfUse";
  export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/legal-terms',
    element: <LegalTermsPage />
  },
  {
    path:'/privacy-policy', 
    element:<PrivacyPolicyPage/>
  },
  {
    path: '/terms-of-use',
    element: <TermsOfUsePage />
  },
  {
    path: '/c/:url',
    element: <CategoryProductsPage />
  },
  {
    path: '/catalog/:shopKey',
    element: <CatalogPage />
  },
  {
    path: '/login',
    element: <GuardRoute><LoginPage /></GuardRoute>
  },
  {
    path: '/admin/login',
    element: <GuardRoute><AdminLoginPage /></GuardRoute>
  },
  {
    path: '/register',
    element: <GuardRoute><RegisterPage /></GuardRoute>
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
    path: '/cart',
    element: <CartPage />
  },
  {
    path: '/checkout',
    element: <><CheckoutPage /><PrivateRoute /></>
  },
  {
    path: '/payment',
    element: <PaymentPage />
  },
  {
    path: '/checkout/success',
    element: <SuccessPage />
  },
  {
    path: '/shop/:id',
    element: <StorePage />
  },
  {
    path: "/",
    element: <AdminRootDashboard><PrivateRoute /></AdminRootDashboard>,
    children: [
      {
        path: "admin/dashboard",
        element: <DashboardAdminPage />
      }, {
        path: "admin/products",
        element: <AdminProductListPage />
      }, {
        path: "admin/shops/:id",
        element: <AdminShopDetailPage />
      }, {
        path: "admin/shops",
        element: <AdminShopPage />
      }, {
        path: "admin/delivery",
        element: <ListDeveryPage />
      },
      {
        path: "admin/delivery/:id",
        element: <DeliveryDetailPage />
      }, {
        path: "admin/customers",
        element: <ListCustomerPage />
      }, {
        path: "admin/orders",
        element: <ListOrdersPage />
      },
      {
        path:"admin/reviews/products",
        element:<ListReviewPage/>
      },
      {
        path:"admin/reviews/shops",
        element:<ListShopReviewPage/>
      },
      {
        path:"admin/feedbacks",
        element:<ListFeedbackPage/>
      },
      {
        path:"admin/shop/new",
        element:<AddShopPage/>
      }
    ]
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
  {
    path: '/home',
    element: <CurrentHomeByGenderPage />
  },
  {
    path: '/',
    element: <UserRootDashboard><PrivateRoute /></UserRootDashboard>,

    children: [
      {
        path: 'user/dashboard',
        element: <UserDashboardPage />
      }, {
        path: 'user/orders/:id',
        element: <OrderDetailPage />
      }, {
        path: 'user/orders',
        element: <OrdersPage />
      }, {
        path: 'account',
        element: <AccountPage />
      },{
        path:'/checkout/state',
        element:<SucessPaymentPage/>
      },
    ]
  },
  {
    path:'/pay/mobile-money',
    element:<MobileMoneyPaymentPage/>
  }
]);