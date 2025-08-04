import { useEffect, useState, useRef } from 'react'
import { Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react'
import MobileNav from './ui/mobile-nav'
import { useTakeOrderMutation, useCompleteOrderMutation } from '../services/auth'
import { format } from 'date-fns'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo from '../assets/logo.png'
interface CountdownProps {
    orderId: string
    onTimeUp?: () => void
}

interface DeliveryReport {
    orderId: string
    startTime: Date
    endTime: Date
    expectedDuration: number // en secondes
    actualDuration: number // en secondes
    isOvertime: boolean
}

const DeliveryCountdown = ({ orderId }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
    const [showReportModal, setShowReportModal] = useState<boolean>(false)
    const [deliveryReport, setDeliveryReport] = useState<DeliveryReport | null>(null)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [takeOrder, { isLoading: isTakingOrder }] = useTakeOrderMutation()
    const reportRef = useRef<HTMLDivElement>(null)
    const [completeOrder] = useCompleteOrderMutation()

    useEffect(() => {
        const savedEndTime = localStorage.getItem(`countdown_end_${orderId}`)
        const savedStartTime = localStorage.getItem(`countdown_start_${orderId}`)

        if (savedEndTime && savedStartTime) {
            const endTime = parseInt(savedEndTime)
            const currentTime = new Date().getTime()
            const remaining = endTime - currentTime
            setStartTime(new Date(parseInt(savedStartTime)))
            setTimeLeft(Math.floor(remaining / 1000))
            setIsRunning(true)
        }
    }, [orderId])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isRunning])

    const startCountdown = async () => {
        const duration = 60 * 60 // 10 minutes en secondes (pour test)
        const now = new Date()
        const endTime = new Date().getTime() + duration * 1000

        setTimeLeft(duration)
        setIsRunning(true)
        setStartTime(now)

        localStorage.setItem(`countdown_end_${orderId}`, endTime.toString())
        localStorage.setItem(`countdown_start_${orderId}`, now.getTime().toString())
        await takeOrder(orderId)
    }

    const generateReport = () => {
        if (!startTime) return null

        const endTime = new Date()
        const expectedDuration = 60 * 60 // 1 heure en secondes
        const actualDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
        const isOvertime = actualDuration > expectedDuration

        return {
            orderId,
            startTime,
            endTime,
            expectedDuration,
            actualDuration,
            isOvertime
        }
    }


    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(Math.abs(seconds) / 3600)
        const minutes = Math.floor((Math.abs(seconds) % 3600) / 60)
        const remainingSeconds = Math.abs(seconds) % 60
        const sign = seconds < 0 ? '-' : ''
        return `${sign}${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    const handleDeliveryComplete = async () => {
        const report = generateReport()
        await completeOrder({ orderId, actualDuration: formatDuration(report?.actualDuration || 0) })
        setDeliveryReport(report)
        setShowConfirmModal(false)
        cancelCountdown()
        setShowReportModal(true)


    }


    const generatePDF = async () => {
        if (!reportRef.current || !deliveryReport) return

        try {
            // Augmenter la résolution
            const canvas = await html2canvas(reportRef.current, {
                scale: 2, // Augmente la résolution
                useCORS: true, // Permet le chargement d'images externes
                logging: false, // Désactive les logs
                backgroundColor: '#ffffff', // Assure un fond blanc
                imageTimeout: 0, // Pas de timeout pour le chargement des images
                onclone: (document) => {
                    // Optimiser les polices pour l'impression
                    const element = document.querySelector('[ref="reportRef"]')
                    if (element) {
                        (element as HTMLElement).style['-webkit-font-smoothing' as any] = 'antialiased'
                    }
                }
            })

            const imgData = canvas.toDataURL('image/jpeg', 1.0) // Utiliser JPEG avec qualité maximale
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true // Compression pour réduire la taille du fichier
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            // Calculer les dimensions pour maintenir le ratio tout en maximisant la taille
            const imgWidth = pageWidth - 20 // Marges de 10mm de chaque côté
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // Centrer l'image sur la page
            const x = 10 // Marge gauche de 10mm
            const y = (pageHeight - imgHeight) / 2 // Centrer verticalement

            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST')
            pdf.save(`rapport-livraison-${orderId}.pdf`)
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error)
        }
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

    const cancelCountdown = () => {
        setTimeLeft(0)
        setIsRunning(false)
        localStorage.removeItem(`countdown_end_${orderId}`)
        localStorage.removeItem(`countdown_start_${orderId}`)
    }

    return (
        <div className="bg-white mx-24 max-sm:mx-4 rounded-lg  shadow-sm p-6 mb-6">

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
                            {isTakingOrder ? <Loader2 className="animate-spin" size={20} /> : "Démarrer la livraison"}
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

            {/* Modal de rapport */}
            {showReportModal && deliveryReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        {/* Contenu du rapport à convertir en PDF */}
                        <div ref={reportRef} className="bg-white p-8">
                            <div className="flex items-center justify-center mb-6">
                                <img src={logo} alt="logo" className="w-16 h-16" />
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">Rapport de Livraison</h2>
                                <p className="text-gray-600">Commande #{orderId}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Début de la livraison</p>
                                            <p className="font-medium">
                                                {format(deliveryReport.startTime, 'dd/MM/yyyy HH:mm:ss')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Fin de la livraison</p>
                                            <p className="font-medium">
                                                {format(deliveryReport.endTime, 'dd/MM/yyyy HH:mm:ss')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Durée prévue</p>
                                            <p className="font-medium">
                                                {formatDuration(deliveryReport.expectedDuration)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Durée réelle</p>
                                            <p className="font-medium">
                                                {formatDuration(deliveryReport.actualDuration)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Statut</p>
                                            <p className={`font-medium ${deliveryReport.isOvertime ? 'text-red-600' : 'text-green-600'}`}>
                                                {deliveryReport.isOvertime ? 'Dépassement de temps' : 'Dans les temps'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2 mb-10">
                            <button
                                onClick={generatePDF}
                                className="flex-1 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg text-center hover:bg-[#ed7e0f]/90"
                            >
                                Télécharger le PDF
                            </button>
                            <button
                                onClick={() => {
                                    setShowReportModal(false)
                                    window.location.href = '/'
                                }}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryCountdown 