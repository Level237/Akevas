import { useGetUserQuery } from "@/services/auth";
import { useCheckTokenQuery } from "@/services/checkService"
import { AppDispatch } from "@/store";
import { getUserRole } from "@/store/authSlice";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"

export const AuthenticatePage=()=>{
    const {token}=useParams()
    const {data:userData}=useGetUserQuery('Auth')
    const navigate=useNavigate()
    const dispatch=useDispatch<AppDispatch>();
    const {data:checkTokenData}=useCheckTokenQuery(token ?? '')

    useEffect(()=>{
        if(checkTokenData?.valid===0){
            navigate(-1);
        }else if(checkTokenData?.valid===1){
            dispatch(getUserRole(userData?.role_id))
           switch(userData?.role_id){
            case 1:
                navigate('/admin/dashboard')
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
    },[checkTokenData?.valid, navigate, userData?.role_id, dispatch])
    return(
        <div>
            <h1>Authenticate</h1>
        </div>
    )
}