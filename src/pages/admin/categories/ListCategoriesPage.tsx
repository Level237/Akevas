import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Folder, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OptimizedImage from '@/components/OptimizedImage'
import { useNavigate } from 'react-router-dom'

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
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <Button 
          className="bg-[#ed7e0f] hover:bg-[#d66d00] text-white"
          onClick={() => navigate('/admin/category/new')}
        >
          Ajouter une catégorie
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
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
                        <AvatarFallback>
                          {category.category_name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{category.category_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-700">
                    {category.products_count} produits
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {category.category_url}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2"
                    onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 mr-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => navigate(`/admin/categories/${category.category_url}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isLoading && (!categories || categories.length === 0) && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
} 