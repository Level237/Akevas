import React from 'react'
import { Sidebar } from '../dashboard/admin/layouts/Sidebar'
import { Header } from '../dashboard/admin/layouts/Header'

export default function AdminRootDashboard({children}:{children:React.ReactNode}) {
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
