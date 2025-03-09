
import { TrendingUp, Package, Timer, DollarSign, Calendar } from 'lucide-react'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import MobileNav from '@/components/ui/mobile-nav'
import { useGetStatOverwiewQuery, useGetStatByDayQuery } from '@/services/auth'
const DeliveryStats = () => {

    const { data } = useGetStatOverwiewQuery("Auth")
    const { data: dataByDay } = useGetStatByDayQuery("Auth")
    console.log(dataByDay);
    // Simulation des données statistiques (à remplacer par des données réelles)

    const chartData = Object.entries(dataByDay || {}).map(([day, value]) => ({
        day: day,
        color: "#e7e7e7",
        deliveries: value
    }))
    const chartConfig: ChartConfig = {
        data: chartData,
        xKey: { label: "Jour", icon: Calendar },
    } as ChartConfig
    const stats = {
        totalDeliveries: data?.total_orders,
        completionRate: 98,
        averageTime: data?.average_duration,
        earnings: data?.total_earnings,
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
                <div className="bg-white p-6 mb-12 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Livraisons par jour</h3>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="deliveries" fill="#ed7e0f" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
            <MobileNav />
        </div>
    )
}

export default DeliveryStats 