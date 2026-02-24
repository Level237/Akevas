import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Edit, Trash2 } from 'lucide-react'
import { useListQuartersQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Quarter } from '@/types/quarter'

export default function ListQuarters({ quarters, isLoading }: { quarters: Quarter[], isLoading: boolean }) {
    const navigate = useNavigate();
    console.log(quarters)
    if (isLoading) {
        return <IsLoadingComponents isLoading={isLoading} />
    }

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom du quartier</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && quarters?.map((quarter) => (
                            <TableRow key={quarter.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{quarter.quarter_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-gray-600">{quarter.town_name}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button onClick={() => navigate(`/admin/quarter/${quarter.id}`)} variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {!isLoading && quarters?.map((quarter) => (
                    <Card key={quarter.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {quarter.quarter_name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{quarter.town_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-4 flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 h-10"
                                    onClick={() => navigate(`/admin/quarter/${quarter.id}`)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Supprimer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!isLoading && quarters?.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun quartier trouvé</p>
                </div>
            )}
        </div>
    )
}

export function ListQuartersContainer() {
    const { data: { data: quarters } = {}, isLoading } = useListQuartersQuery('admin')
    return <ListQuarters quarters={quarters} isLoading={isLoading} />
}
