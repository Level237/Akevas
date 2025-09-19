import { useGetUserQuery } from "@/services/auth";
import { AppDispatch } from "@/store";
import { setUserRole } from "@/store/authSlice";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"

export const AuthenticatePage = () => {


    //const { data: userData, isLoading, isSuccess } = useGetUserQuery('Auth')
    const { data: userData, isLoading, isSuccess } = useGetUserQuery('Auth');
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    console.log('me')
    console.log(userData)

    useEffect(() => {

        const timer = setTimeout(() => {

            if (!isLoading && isSuccess) {
                const userRoleState = {
                    'userRole': userData?.role_id
                }
                dispatch(setUserRole(userRoleState))
                switch (userData?.role_id) {
                    case 1:
                        window.location.href = '/admin/dashboard';
                        break;
                    case 2:
                        navigate('/seller/dashboard')
                        break;
                    case 3:
                        navigate('/user/dashboard')
                        break;
                    case 4:
                        navigate('/delivery/dashboard')
                        break;
                }

            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [isLoading, userData, dispatch, navigate, isSuccess])
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center">
            <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </section>

    )
}