import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import MobileNav from '@/components/ui/mobile-nav'
import HomeGuard from '@/components/HomeGuard'
import { useCheckAuthQuery } from '@/services/auth'
import { useState, useEffect } from 'react'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import HomeAuth from '@/components/HomeAuth'
import ActiveDeliveryButton from '@/components/ActiveDeliveryButton'


const Homepage = () => {
  const { data, isLoading } = useCheckAuthQuery()
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null)

  useEffect(() => {
    // Vérifier s'il y a une livraison active en cherchant dans le localStorage
    const checkActiveDelivery = () => {
      const allKeys = Object.keys(localStorage)
      const deliveryKey = allKeys.find(key => key.startsWith('countdown_end_'))

      if (deliveryKey) {
        const orderId = deliveryKey.replace('countdown_end_', '')
        const endTime = parseInt(localStorage.getItem(deliveryKey) || '0')

        if (endTime > new Date().getTime()) {
          setActiveDelivery(orderId)
        } else {
          setActiveDelivery(null)
        }
      } else {
        setActiveDelivery(null)
      }
    }

    checkActiveDelivery()
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkActiveDelivery, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) return <IsLoadingComponents isLoading={isLoading} />

  return (
    <div className="min-h-screen mb-20 bg-[#F8F9FC]">
      <TopBar />
      <Header />

      {!data?.isAuthenticated ? (
        <HomeGuard />
      ) : (
        <HomeAuth />
      )}

      {activeDelivery && <ActiveDeliveryButton orderId={activeDelivery} />}

      <MobileNav />
    </div>
  )
}

export default Homepage