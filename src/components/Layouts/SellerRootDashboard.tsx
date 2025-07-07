import { useState, useEffect } from 'react';

import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/dashboard/seller/layouts/header';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import MobileNav from '../ui/mobile-nav';
import SidebarLeft from '../ui/SidebarLeft';



export default function SellerRootDashboard({ children }: { children: React.ReactNode }) {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: { data: sellerData } = {} } = useCurrentSellerQuery<SellerResponse>('seller')
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
      <SidebarLeft/>
      {/* En-tête avec navigation */}
      <Header sellerData={sellerData} isMobile={isMobile} setIsSidebarOpen={setIsSidebarOpen} />

      {children}
      <MobileNav />
    </div>
  )
}