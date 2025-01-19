
import {  Navigate, Outlet, useLocation} from 'react-router-dom'

export  const  PrivateRoute=()=> {
    
    const token="NDJHF"
    const location=useLocation()


    return (
        token ? <Outlet/> : <Navigate to="/login" state={{ from:location }} replace/>
    )
}