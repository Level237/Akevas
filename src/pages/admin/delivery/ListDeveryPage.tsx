import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, Plus} from "lucide-react"
import { ListDeliveriesContainer } from "@/components/dashboard/admin/deliveries/list-deliveries"

export default function ListDeveryPage() {
  return (
    <main className="p-4 md:p-6 mt-16">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Livreurs</h1>
      <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
        <Plus className="mr-2 h-4 w-4" /> Ajouter un livreur
      </Button>
    </div>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input className="pl-8" placeholder="Search products..." />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>
      <ListDeliveriesContainer/>
    </div>
  </main>
  )
}
