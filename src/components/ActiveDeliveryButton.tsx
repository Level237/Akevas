import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ActiveDeliveryButton = ({ orderId }: { orderId: string }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(`/delivery/countdown/${orderId}`)}
            className="fixed bottom-20 right-4 flex items-center gap-2 bg-[#ed7e0f] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#d97100] transition-all transform hover:scale-105 z-50"
        >
            <Clock size={20} className="animate-pulse" />
            <span>Livraison en cours</span>
        </button>
    )
}

export default ActiveDeliveryButton 