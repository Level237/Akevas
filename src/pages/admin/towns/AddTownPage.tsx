import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

import { toast } from 'sonner';
import { useAdminAddTownMutation } from '@/services/adminService';

export default function AddTownPage() {
    const navigate = useNavigate();

    const [createTown] = useAdminAddTownMutation()
    const [formData, setFormData] = useState({
        town_name: '',
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            await createTown({
                'town_name': formData.town_name,
                'code': formData.town_name.substring(0, 3).toUpperCase(),
            });
            toast.success('Ville créée avec succès');
            navigate('/admin/cities');
        } catch (error) {
            toast.error('Erreur lors de la création de la ville');
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
                <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle ville</h1>
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
                                <Input
                                    id="town_name"
                                    value={formData.town_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, town_name: e.target.value }))}
                                    placeholder="Entrez le nom de la ville"
                                    required
                                />
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
                                    Créer la ville
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 