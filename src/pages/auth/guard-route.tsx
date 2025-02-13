import { useSelector } from 'react-redux'
import {  useNavigate} from 'react-router-dom'
import { RootState } from '@/store'
import { useEffect } from 'react'

//import { useCheckTokenQuery } from '@/services/checkService'
export const GuardRoute = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate()
    const token = useSelector((state:RootState) => state.auth.usedToken)
    //const {data,isLoading}=useCheckTokenQuery()

    useEffect(() => {
        if(token) {
            navigate(-1)
        }
    }, [token, navigate])
    
    // Ne rendre le contenu que si l'utilisateur n'a pas de token
    if (token) {
        return null
    }

    return (
        <div>
            {children}
        </div>
    )
}