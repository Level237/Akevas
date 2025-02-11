import { useSelector } from 'react-redux'
import {  Navigate, Outlet, useLocation} from 'react-router-dom'
import { RootState } from '@/store'
//import { useCheckTokenQuery } from '@/services/checkService'
export  const  PrivateRoute=()=> {
    
    const token=useSelector((state:RootState)=>state.auth.usedToken)
    //const {data,isLoading}=useCheckTokenQuery()
    const location=useLocation()
    

    return (
        token ? <Outlet/> : <Navigate to="/login" state={{ from:location }} replace/>
    )
}