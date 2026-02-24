import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Edit, Trash2 } from 'lucide-react'
import { useAdminListTownQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Town } from '@/types/town'



export default function ListTowns({ towns, isLoading }: { towns: Town[], isLoading: boolean }) {

    const navigate = useNavigate();
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
                            <TableHead>Nom de la ville</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && towns.map((town) => (
                            <TableRow key={town.id}>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{town.town_name}</span>

                                    </div>
                                </TableCell>


                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button onClick={() => navigate(`/admin/city/${town.id}`)} variant="ghost" size="icon" className="h-8 w-8">
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
                {!isLoading && towns.map((town) => (
                    <Card key={town.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            {/* Header with Avatar and Status */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">

                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {town.town_name}
                                        </h3>

                                    </div>
                                </div>

                            </div>

                            {/* Contact Information */}


                            {/* Actions */}
                            <div className="px-4 pb-4 flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 h-10"
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
            {!isLoading && towns?.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune ville trouvée</p>
                </div>
            )}
        </div>
    )
}

export function ListTownsContainer() {
    const { data: towns, isLoading } = useAdminListTownQuery('admin')
    return <ListTowns towns={towns} isLoading={isLoading} />
}
