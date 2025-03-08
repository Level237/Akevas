
import { useState, useEffect } from 'react'

import Header from '@/components/ui/header'
import TopBar from '../ui/topBar'
import ActiveDeliveryButton from '../ActiveDeliveryButton'




export default function DeliveryRootDashboard({ children }: { children: React.ReactNode }) {
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  useEffect(() => {
    // Vérifier s'il y a une livraison active en cherchant dans le localStorage
    const checkActiveDelivery = () => {
      const allKeys = Object.keys(localStorage)
      const deliveryKey = allKeys.find(key => key.startsWith('countdown_end_'))

      if (deliveryKey) {
        const orderId = deliveryKey.replace('countdown_end_', '')
        const endTime = parseInt(localStorage.getItem(deliveryKey) || '0')
        setCurrentOrderId(orderId)

        if (endTime > new Date().getTime()) {
          setActiveDelivery(orderId)

        } else {
          setActiveDelivery(null)
          console.log("level")
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
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopBar />
      <Header />

      {/* Main Content */}



      {/* Main Dashboard */}

      {children}
      {activeDelivery && <ActiveDeliveryButton orderId={currentOrderId || ""} />}

    </div>
  )
}

