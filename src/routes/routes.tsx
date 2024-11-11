import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";

export const routes=createBrowserRouter([{
    path:'/',
    element:<Homepage/>
}])