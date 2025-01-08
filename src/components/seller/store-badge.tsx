import { Badge } from "@/components/ui/badge"
import { Crown, Package, Recycle, Tags } from 'lucide-react'

interface StoreBadgeProps {
  isPremium?: boolean
  isWholesale?: boolean
  isThrift?: boolean
}

export function StoreBadges({ isPremium, isWholesale, isThrift }: StoreBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isPremium && (
        <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white gap-1">
          <Crown className="h-3.5 w-3.5" />
          Premium Seller
        </Badge>
      )}
      {isWholesale && (
        <Badge variant="secondary" className="gap-1">
          <Package className="h-3.5 w-3.5" />
          Wholesale
        </Badge>
      )}
      {isThrift && (
        <Badge variant="secondary" className="gap-1">
          <Recycle className="h-3.5 w-3.5" />
          Thrift Store
        </Badge>
      )}
    </div>
  )
}

