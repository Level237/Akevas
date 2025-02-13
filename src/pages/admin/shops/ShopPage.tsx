import { ListSellersContainer } from "@/components/dashboard/admin/seller/list-sellers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, Plus} from "lucide-react"


export default function AdminShopPage() {
  return (
    <main className="p-4 md:p-6 mt-16 max-sm:w-[100vw]">
    <div className="flex  justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Shops</h1>
      <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
        <Plus className="mr-2 h-4 w-4" /> Add Shop
      </Button>
    </div>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input className="pl-8" placeholder="Search shops..." />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>
     <ListSellersContainer/>
    </div>
  </main>
  )
}
