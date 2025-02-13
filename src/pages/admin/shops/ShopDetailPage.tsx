import { DetailSellerContainer } from "@/components/dashboard/admin/seller/detail-seller";
import { useGetSellerQuery } from "@/services/adminService";
import { useParams } from "react-router-dom";



export default function AdminShopDetailPage() {
   
  return (
    <main className="p-4 md:p-6 mt-16">
      <DetailSellerContainer/>
  </main>
  )
}
