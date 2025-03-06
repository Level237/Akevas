import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import DeliveryRegisterPage from "@/pages/auth/delivery-registration/DeliveryRegisterPage";
import VehicleInfoPage from "@/pages/auth/delivery-registration/VehicleInfoPage";
import DeliveryZonePage from "@/pages/auth/delivery-registration/DeliveryZonePage";
import DocumentsPage from "@/pages/auth/delivery-registration/DocumentsPage";
import ValidationPage from "@/pages/auth/delivery-registration/ValidationPage";
import DeliveryGenerationPage from "@/pages/auth/delivery-registration/DeliveryGenerationPage";
import DeliveryDashboard from "@/pages/delivery/DashboardPage";
import DeliveriesPage from "@/pages/delivery/DeliveryPage";
import DeliveryRootDashboard from "@/components/Layouts/DeliveryRootDashboard";
import { PrivateRoute } from "@/pages/auth/private-route";
import ShopsPage from "@/pages/ShopsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import { GuardRoute } from "@/pages/auth/guard-route";
import DeliveryGuidePage from "@/pages/DeliveryGuidePage";
import { AuthenticatePage } from "@/pages/auth/AuthenticatePage";
import DeliveryHistory from "@/pages/DeliveryHistory";
import DeliveryStats from "@/pages/DeliveryStats";
import OrderDetailPage from "@/pages/OrderDetailPage";
import DeliveryOrders from "@/pages/DeliveryOrders";
import Account from "@/pages/Account";
import DeliveryCountDownPage from "@/pages/DeliveryCountDownPage";
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
    path: '/authenticate',
    element: <AuthenticatePage />
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
    path: '/delivery/guide',
    element: <DeliveryGuidePage />
  },
  {
    path: '/',
    element: <DeliveryRootDashboard><PrivateRoute /></DeliveryRootDashboard>,
    children: [
      {
        path: 'dashboard',
        element: <DeliveryDashboard />
      }, {
        path: 'delivery/orders',
        element: <DeliveriesPage />
      },

    ]
  },
  {
    path: '/order/:orderId',
    element: <OrderDetailPage />
  },
  {
    path: '/delivery/stats',
    element: <DeliveryStats />
  },
  {
    path: '/delivery/countdown/:orderId',
    element: <DeliveryCountDownPage />
  },
  {
    path: '/delivery/history',
    element: <DeliveryHistory />
  },
  {
    path: '/orders',
    element: <DeliveryOrders />
  },
  {
    path: '/',
    element: <Homepage />,

  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: 'shops',
    element: <ShopsPage />
  },
  {
    path: 'notifications',
    element: <NotificationsPage />
  },
]);