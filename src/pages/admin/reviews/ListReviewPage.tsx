import ListReviewContainer from "@/components/dashboard/admin/reviews/ListReviews"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"


export default function ListReviewPage(){

   
    return (

        <>
                <main className="p-4 md:p-6 mt-16">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Commentaires</h1>
               
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
                <ListReviewContainer />
            </div>
        </main>
        </>
    )
}