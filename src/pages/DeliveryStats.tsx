import TopBar from '@/components/ui/topBar'
import Header from '@/components/ui/header'
import { TrendingUp, Package, Timer, DollarSign } from 'lucide-react'
import { useState } from 'react'
import MobileNav from '@/components/ui/mobile-nav'
const DeliveryStats = () => {
    const [timeFrame, setTimeFrame] = useState('week')

    // Simulation des données statistiques (à remplacer par des données réelles)
    const stats = {
        totalDeliveries: 45,
        completionRate: 98,
        averageTime: "25 min",
        earnings: "1250 €",
        weeklyProgress: [
            { day: 'Lun', deliveries: 8 },
            { day: 'Mar', deliveries: 12 },
            { day: 'Mer', deliveries: 7 },
            { day: 'Jeu', deliveries: 10 },
            { day: 'Ven', deliveries: 8 },
            { day: 'Sam', deliveries: 0 },
            { day: 'Dim', deliveries: 0 },
        ]
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC]">


            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Statistiques de livraison
                    </h1>
                    <p className="text-gray-600">
                        Aperçu de vos performances de livraison
                    </p>
                </div>

                {/* Sélecteur de période */}
                <div className="flex gap-4 mb-6">
                    {['week', 'month', 'year'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimeFrame(period)}
                            className={`px-4 py-2 rounded-lg ${timeFrame === period
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600'
                                }`}
                        >
                            {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
                        </button>
                    ))}
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Package className="text-blue-500" size={24} />
                            <span className="text-sm text-gray-500">Total livraisons</span>
                        </div>
                        <h3 className="text-2xl font-bold">{stats.totalDeliveries}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="text-green-500" size={24} />
                            <span className="text-sm text-gray-500">Taux de réussite</span>
                        </div>
                        <h3 className="text-2xl font-bold">{stats.completionRate}%</h3>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Timer className="text-orange-500" size={24} />
                            <span className="text-sm text-gray-500">Temps moyen</span>
                        </div>
                        <h3 className="text-2xl font-bold">{stats.averageTime}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="text-purple-500" size={24} />
                            <span className="text-sm text-gray-500">Gains totaux</span>
                        </div>
                        <h3 className="text-2xl font-bold">{stats.earnings}</h3>
                    </div>
                </div>

                {/* Graphique des livraisons */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Livraisons par jour</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {stats.weeklyProgress.map((day) => (
                            <div key={day.day} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-blue-100 rounded-t"
                                    style={{ height: `${(day.deliveries / 12) * 100}%` }}
                                >
                                    <div
                                        className="w-full bg-blue-500 rounded-t transition-all duration-300"
                                        style={{ height: `${(day.deliveries / 12) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 mt-2">{day.day}</span>
                                <span className="text-xs text-gray-500">{day.deliveries}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <MobileNav />
        </div>
    )
}

export default DeliveryStats 