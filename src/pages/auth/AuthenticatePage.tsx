import { useGetUserQuery } from "@/services/auth";
import { AppDispatch, RootState } from "@/store";
import { getUserRole } from "@/store/authSlice";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"

export const AuthenticatePage=()=>{
   const [query] = useSearchParams();
    const tokenUrl = query.get('token'); 
    const {data:userData,isLoading,isSuccess}=useGetUserQuery('Auth')
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>();
    const token=useSelector((state:RootState)=>state.auth.usedToken)
  
   useEffect(()=>{

     const timer = setTimeout(() => {
    
        if(!isLoading && isSuccess){
            const userRoleState={
                'userRole':userData?.role_id
            }
            dispatch(getUserRole(userRoleState))
            switch(userData?.role_id){
                case 1:
                    window.location.href = '/admin/dashboard';
                    break;
                case 2:
                    navigate('/seller/dashboard')
                    break;
                case 3:
                    navigate('/user')
                    break;
                case 4:
                    navigate('/delivery/dashboard')
                    break;
            }
            
        }
    }, 4000);
return () => clearTimeout(timer);
    },[isLoading,tokenUrl,token,userData,dispatch,navigate,isSuccess])
    return(
        <div>
            <h1>gg</h1>
        </div>
    )
}