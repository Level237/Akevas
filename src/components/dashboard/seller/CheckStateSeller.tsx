import { Badge } from "@/components/ui/badge";

export function CheckStateSeller({ state }: { state: string | null }) {

    return (
        <Badge
            className={
                state === "1" ? "bg-green-100 text-green-700" : state === "0" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
            }
        >
            {state === "1" && "aprouvé"}
            {state === "0" && "non approuvé"}
            {state === "2" && "Rejeté"}
        </Badge>
    )
}