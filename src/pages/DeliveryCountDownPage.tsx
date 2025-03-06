import DeliveryCountdown from "@/components/DeliveryCountdown"
import { useParams } from "react-router-dom"


const DeliveryCountDownPage = () => {
    const { orderId } = useParams()

    const onTimeUp = () => {

    }
    return <DeliveryCountdown orderId={orderId || ''} onTimeUp={onTimeUp} />
}

export default DeliveryCountDownPage