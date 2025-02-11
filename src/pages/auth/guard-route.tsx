import { useSelector } from 'react-redux'
import {  useNavigate} from 'react-router-dom'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'
//import { useCheckTokenQuery } from '@/services/checkService'
export  const  GuardRoute=({children}:{children:React.ReactNode})=> {
    const navigate=useNavigate()
    const token=useSelector((state:RootState)=>state.auth.usedToken)
    //const {data,isLoading}=useCheckTokenQuery()
    const [isLoading, setIsLoading] = useState(true);   

    useEffect(()=>{
        if(!token){
            navigate('/login')
        }else{
            navigate(-1)
        }
        setIsLoading(false);
    },[token,navigate])
    if (isLoading || token) {
        return  <section className="h-screen w-full flex flex-col items-center justify-center">
                <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
        </section>;
    }
    return (
        <div>
            {children}
        </div>
    )
}