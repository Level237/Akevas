import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { toast } from 'sonner';
import { useAddQuarterMutation, useAdminListTownQuery } from '@/services/adminService';
import { Town } from '@/types/town';

export default function AddQuarterPage() {
    const navigate = useNavigate();

    const [createQuarter, { isLoading: isCreating }] = useAddQuarterMutation();
    const { data: towns, isLoading: isLoadingTowns } = useAdminListTownQuery('admin');

    const [formData, setFormData] = useState({
        quarter_name: '',
        town_id: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.town_id) {
            toast.error('Veuillez sélectionner une ville');
            return;
        }

        try {
            const res = await createQuarter({
                quarter_name: formData.quarter_name,
                town_id: parseInt(formData.town_id),
            });

            console.log(res)
            toast.success('Quartier créé avec succès');
            //navigate('/admin/quarters');
        } catch (error) {
            toast.error('Erreur lors de la création du quartier');
        }
    };

    return (
        <div className="p-6 mt-16">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/quarters')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau quartier</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du quartier</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="quarter_name">Nom du quartier</Label>
                                <Input
                                    id="quarter_name"
                                    value={formData.quarter_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, quarter_name: e.target.value }))}
                                    placeholder="Entrez le nom du quartier"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="town_id">Ville</Label>
                                <Select
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, town_id: value }))}
                                    value={formData.town_id}
                                >
                                    <SelectTrigger id="town_id">
                                        <SelectValue placeholder={isLoadingTowns ? "Chargement des villes..." : "Sélectionnez une ville"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {towns?.map((town: Town) => (
                                            <SelectItem key={town.id} value={town.id.toString()}>
                                                {town.town_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/quarters')}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#ed7e0f] hover:bg-[#d66d00] text-white"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Création en cours...' : 'Créer le quartier'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
