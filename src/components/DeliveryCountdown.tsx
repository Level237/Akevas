import { useEffect, useState } from 'react'
import { Clock, AlertCircle, XCircle } from 'lucide-react'
import Header from './ui/header'

interface CountdownProps {
    orderId: string
    onTimeUp?: () => void
}

const DeliveryCountdown = ({ orderId, onTimeUp }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)

    useEffect(() => {
        const savedEndTime = localStorage.getItem(`countdown_end_${orderId}`)

        if (savedEndTime) {
            const endTime = parseInt(savedEndTime)
            const currentTime = new Date().getTime()
            const remaining = Math.max(0, endTime - currentTime)

            if (remaining > 0) {
                setTimeLeft(Math.floor(remaining / 1000))
                setIsRunning(true)
            }
        }
    }, [orderId])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 1
                    if (newTime <= 0) {
                        clearInterval(interval)
                        setIsRunning(false)
                        onTimeUp?.()
                        return 0
                    }
                    return newTime
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isRunning, timeLeft, onTimeUp])

    const startCountdown = () => {
        const duration = 60 * 60 // 1 heure en secondes
        const endTime = new Date().getTime() + duration * 1000

        setTimeLeft(duration)
        setIsRunning(true)

        localStorage.setItem(`countdown_end_${orderId}`, endTime.toString())
    }

    const cancelCountdown = () => {
        setTimeLeft(0)
        setIsRunning(false)
        localStorage.removeItem(`countdown_end_${orderId}`)
    }

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getProgressPercentage = (): number => {
        return (timeLeft / (60 * 60)) * 100
    }

    // Calculer la circonférence du cercle
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (getProgressPercentage() / 100) * circumference

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Header />
            <div className="flex items-center gap-3 mb-6">
                <Clock className="text-[#ed7e0f]" size={24} />
                <h2 className="text-lg font-semibold">Temps de livraison restant</h2>
            </div>

            <div className="flex flex-col items-center justify-center">
                {/* Cercle de progression */}
                <div className="relative w-48 h-48">
                    {/* Cercle de fond */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            className="fill-none stroke-gray-100"
                            strokeWidth="12"
                        />
                        {/* Cercle de progression */}
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            className="fill-none transition-all duration-1000"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            stroke={timeLeft < 600 ? '#ef4444' : '#ed7e0f'}
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Affichage du temps au centre */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className="text-3xl font-bold"
                            style={{
                                color: timeLeft < 600 ? '#ef4444' : '#1f2937'
                            }}
                        >
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Alerte temps faible */}
                {timeLeft > 0 && timeLeft < 600 && (
                    <div className="flex items-center gap-2 text-red-600 mt-6">
                        <AlertCircle size={20} />
                        <span>Attention, moins de 10 minutes restantes !</span>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="mt-6 flex flex-col w-full gap-3">
                    {!isRunning && timeLeft === 0 && (
                        <button
                            onClick={startCountdown}
                            className="bg-[#ed7e0f] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d97100] transition-colors w-full"
                        >
                            Démarrer la livraison
                        </button>
                    )}

                    {isRunning && (
                        <button
                            onClick={cancelCountdown}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                            <XCircle size={20} />
                            <span>Annuler la livraison</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DeliveryCountdown 