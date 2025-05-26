
import {  Outlet, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import { useCheckAuthQuery } from '@/services/auth'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'

//import { useCheckTokenQuery } from '@/services/checkService'
export const GuardRoute = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate()
    const { data, isLoading } = useCheckAuthQuery()
    
    if (isLoading) {
        return <IsLoadingComponents isLoading={isLoading}/>
    }

    

    
        return (
            data?.isAuthenticated === false && <Outlet />
        )
    
}