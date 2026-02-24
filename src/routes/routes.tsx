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
import OrderDetailPage from "@/pages/user/OrderDetailPage";
import OrdersPage from "@/pages/user/OrdersPage";
import ListCustomerPage from "@/pages/admin/customers/ListCustomerPage";
import ListOrdersPage from "@/pages/admin/orders/ListOrdersPage";
import LoginPage from "@/pages/auth/LoginPage";
import AdminLoginPage from "@/pages/admin/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
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
import ProductDetailPageAdmin from "@/components/dashboard/admin/products/ProductDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ListCategoriesPage from "@/pages/admin/categories/ListCategoriesPage";
import CreateCategoryPage from "@/pages/admin/categories/CreateCategoryPage";
import EditCategoryPage from "@/pages/admin/categories/EditCategoryPage";
import PaymentTicketPage from "@/pages/user/PaymentTicketPage";
import AdminOrderDetailPage from "@/pages/admin/orders/OrderDetailPage";
import ContactPage from "@/pages/ContactPage";
import PaymentSuccessPage from "@/pages/payment/PaymentSuccessPage";
import PaymentCancelPage from "@/pages/payment/PaymentCancelPage";
import PaymentErrorPage from "@/pages/payment/PaymentErrorPage";
import AdminAccountPage from "@/pages/admin/account";
import ProfilePage from "@/pages/user/ProfilePage";
import AppLayout from "@/components/Layouts/AppLayout";
import ListTownPage from "@/pages/admin/towns/ListTownPage";
import AddTownPage from "@/pages/admin/towns/AddTownPage";
import EditTownPage from "@/pages/admin/towns/EdtTownPage";
import ListQuarterPage from "@/pages/admin/quarters/ListQuarterPage";



export const routes = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Homepage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }, {
        path: 'legal-terms',
        element: <LegalTermsPage />
      },
    ]
  },


  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />
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
    path: '/',
    element: <GuardRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/admin/login',
        element: <AdminLoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: '/verify-otp',
        element: <OtpVerificationPage />
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />
      }
    ]
  },
  {
    path: '/authenticate',
    element: <AuthenticatePage />
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
    path: '/payment/success',
    element: <PaymentSuccessPage />,
  },
  {
    path: '/payment/cancel',
    element: <PaymentCancelPage />,
  },
  {
    path: '/payment/error',
    element: <PaymentErrorPage />,
  },
  {
    path: '/shop/:id',
    element: <StorePage />
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminRootDashboard />,
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
            path: "admin/cities",
            element: <ListTownPage />
          },
          {
            path: "admin/quarters",
            element: <ListQuarterPage />
          },
          {
            path: "admin/city/:id",
            element: <EditTownPage />
          },
          {
            path: "admin/city/add",
            element: <AddTownPage />
          },
          {
            path: "admin/products/:url",
            element: <ProductDetailPageAdmin />
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
            path: "admin/reviews/products",
            element: <ListReviewPage />
          },
          {
            path: "admin/reviews/shops",
            element: <ListShopReviewPage />
          },
          {
            path: "admin/feedbacks",
            element: <ListFeedbackPage />
          },
          {
            path: "admin/shop/new",
            element: <AddShopPage />
          },
          {
            path: "admin/categories",
            element: <ListCategoriesPage />
          },
          {
            path: "admin/category/new",
            element: <CreateCategoryPage />
          },
          {
            path: "admin/categories/:id/edit",
            element: <EditCategoryPage />
          },
          {
            path: "/admin/order/:id",
            element: <AdminOrderDetailPage />
          }, {
            path: "/admin/account",
            element: <AdminAccountPage />
          }
        ]
      },
    ],
  },
  {
    path: '/',
    element: <Homepage />,

  }, {
    path: '/shops',
    element: <ShopsPage />
  },
  {
    path: 'notifications',
    element: <NotificationsPage />
  },


  {
    path: '/home',
    element: <CurrentHomeByGenderPage />
  },
  {
    path: '/',
    element: <PrivateRoute />,

    children: [
      {
        element: <UserRootDashboard />,
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
          },
          {
            path: 'user/profile',
            element: <ProfilePage />
          },
          {
            path: 'account',
            element: <AccountPage />
          }, {
            path: '/checkout/state',
            element: <SucessPaymentPage />
          },
          {
            path: "/user/payment/:ref",
            element: <PaymentTicketPage />
          },
          {
            path: '/pay/mobile-money',
            element: <MobileMoneyPaymentPage />
          },
        ]
      }


    ]
  },

  {
    path: '/contact',
    element: <ContactPage />
  },

],

);