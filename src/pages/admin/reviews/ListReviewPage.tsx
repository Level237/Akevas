import { useAdminListReviewsQuery } from "@/services/adminService"


export default function ListReviewPage(){

    const {data,isLoading}=useAdminListReviewsQuery("admin")
    console.log(data)
    return (

        <>
        
        </>
    )
}