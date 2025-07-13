import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Folder, Eye, Plus, Package, Link as LinkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import OptimizedImage from '@/components/OptimizedImage'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { useAllCategoriesQuery } from '@/services/adminService'

interface Category {
  id: number;
  category_name: string;
  products_count: number;
  category_profile: string;
  category_url: string;
}

export default function ListCategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useAllCategoriesQuery('admin');

  if (isLoading) {
    return <IsLoadingComponents isLoading={isLoading} />;
  }

  return (
    <div className="p-6 mt-16 max-sm:p-4">
      <div className="flex justify-between items-center mb-6 max-sm:flex-col max-sm:gap-4">
        <h1 className="text-2xl font-bold text-gray-900 max-sm:text-xl">Catégories</h1>
        <Button 
          className="bg-[#ed7e0f] hover:bg-[#d66d00] text-white"
          onClick={() => navigate('/admin/category/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <div className="space-y-6">
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Nombre de produits</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading && categories && categories.categories.length > 0 && categories.categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {category.category_profile ? (
                          <OptimizedImage
                            src={category.category_profile}
                            alt={category.category_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="text-sm font-medium">
                            {category.category_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{category.category_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {category.products_count} produits
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 font-mono">
                      {category.category_url}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/categories/${category.category_url}`)}
                      >
                        <Eye className="h-4 w-4" />
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
          {!isLoading && categories && categories.categories.length > 0 && categories.categories.map((category: Category) => (
            <Card key={category.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Header with Avatar and Category Name */}
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {category.category_profile ? (
                      <OptimizedImage
                        src={category.category_profile}
                        alt={category.category_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-sm font-medium">
                        {category.category_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {category.category_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Package className="h-3 w-3 text-gray-400" />
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {category.products_count} produits
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* URL Information */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {category.category_url}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => navigate(`/admin/categories/${category.category_url}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 px-3"
                    onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
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
        {!isLoading && (!categories || categories.categories.length === 0) && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
} 