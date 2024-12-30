import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";
import SellerRegistration from "@/pages/auth/SellerRegistration";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/connexion',
    element: <LoginPage />
  },
  {
    path: '/devenir-vendeur',
    element: <SellerRegistration />
  }
]);