import { useEffect, useState } from 'react'
import { Clock, AlertCircle, XCircle } from 'lucide-react'
import Header from './ui/header'
import MobileNav from './ui/mobile-nav'
interface CountdownProps {
    orderId: string
    onTimeUp?: () => void
}

const DeliveryCountdown = ({ orderId, onTimeUp }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)

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

    const handleDeliveryComplete = () => {
        // Ici vous pouvez ajouter la logique pour marquer la livraison comme terminée
        cancelCountdown()
        setShowConfirmModal(false)
        // Rediriger vers la page des livraisons ou le dashboard
        window.location.href = '/dashboard'
    }

    return (
        <div className="bg-white rounded-lg  shadow-sm p-6 mb-6">
            <Header />
            <div className="flex items-center mt-20 gap-3 mb-6">
                <Clock className="text-[#ed7e0f]" size={24} />
                <h2 className="text-lg  font-semibold">Temps de livraison restant</h2>
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
                        <>
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors w-full flex items-center justify-center gap-2"
                            >
                                Terminer la livraison
                            </button>
                            <button
                                onClick={cancelCountdown}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                                <XCircle size={20} />
                                <span>Annuler la livraison</span>
                            </button>
                        </>
                    )}
                </div>
                <MobileNav />
            </div>

            {/* Modal de confirmation */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Confirmer la fin de livraison</h3>
                        <div className="mb-6">
                            <div className="flex items-start gap-2 text-red-600 mb-4">
                                <AlertCircle className="w-5 h-5 mt-1" />
                                <p className="text-sm">
                                    Attention : En cas de fausse déclaration de livraison terminée,
                                    votre compte sera immédiatement suspendu et vous ne pourrez plus
                                    effectuer de livraisons sur la plateforme.
                                </p>
                            </div>
                            <p className="text-gray-600">
                                Êtes-vous sûr d'avoir bien livré la commande #{orderId} ?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeliveryComplete}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryCountdown 