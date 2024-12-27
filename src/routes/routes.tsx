import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import LoginPage from "@/pages/auth/LoginPage";

export const routes=createBrowserRouter([{
    path:'/',
    element:<Homepage/>
},{
    path:'/login',
    element:<LoginPage/>
}

])