import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import MobileNav from '@/components/ui/mobile-nav'
import HomeGuard from '@/components/HomeGuard'
import { useCheckAuthQuery } from '@/services/auth'
import { useState } from 'react'
import { Search, MapPin, Package, Clock } from 'lucide-react'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { useNavigate } from 'react-router-dom'
import HomeAuth from '@/components/HomeAuth'

const Homepage = () => {
  const { data, isLoading, isError } = useCheckAuthQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()


  if (isLoading) return <IsLoadingComponents isLoading={isLoading} />
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopBar />
      <Header />

      {!data?.isAuthenticated ? (
        <HomeGuard />
      ) : (
        <HomeAuth />
      )}

      <MobileNav />
    </div>
  )
}

export default Homepage