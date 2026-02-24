import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

import { toast } from 'sonner';
import { useAdminUpdateTownMutation, useGetTownQuery } from '@/services/adminService';
import { useParams } from 'react-router-dom';

export default function EditTownPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id)
    const { data: town, isLoading } = useGetTownQuery(id);
    const [updateTown] = useAdminUpdateTownMutation()
    const [formData, setFormData] = useState({
        town_name: town?.town_name || '',
    });

    useEffect(() => {
        if (town) {
            setFormData({
                town_name: town.town_name,
            });
        }
    }, [town]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const body: any = {
                town_name: formData.town_name,
            }
            //body.append('code', formData.town_name.substring(0, 3).toUpperCase());
            await updateTown({
                id: id,
                body: body

            });

            toast.success('Ville mise à jour avec succès');
            navigate('/admin/cities');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour de la ville');
        }
    };

    return (
        <div className="p-6 mt-16">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/cities')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Modifier une ville</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de la ville</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="town_name">Nom de la ville</Label>
                                {!isLoading && (
                                    <Input
                                        id="town_name"
                                        name="town_name"
                                        value={formData.town_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, town_name: e.target.value }))}
                                        placeholder="Entrez le nom de la ville"
                                        required
                                    />
                                )}
                            </div>



                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/cities')}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#ed7e0f] hover:bg-[#d66d00] text-white"
                                //disabled={isLoading}
                                >
                                    {/*{isLoading ? 'Création en cours...' : 'Créer la catégorie'}*/}
                                    Mettre à jour
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 