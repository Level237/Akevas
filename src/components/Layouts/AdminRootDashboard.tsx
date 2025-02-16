import React from 'react'
import { Sidebar } from '../dashboard/admin/layouts/Sidebar'
import { Header } from '../dashboard/admin/layouts/Header'
import { useGetUserQuery } from '@/services/auth'
import { Navigate } from 'react-router-dom'
export default function AdminRootDashboard({children}:{children:React.ReactNode}) {
  const {data:userData}=useGetUserQuery('Auth')
  if(userData?.role_id!==1){
    return (
      <Navigate to={`/`} />
    )
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Header />
        {children}
      </div>
    </div>
  )
}
