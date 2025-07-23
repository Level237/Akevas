import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import Select from 'react-select';
import { useUpdateCategoriesMutation } from '@/services/sellerService';
import { toast } from 'sonner';
interface CategoryOption {
  id: number;
  category_name: string;
}

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  options: CategoryOption[];
  selected: number[];
  onChange: (selected: number[]) => void;
  onValidate: () => void;
  loading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  options,
  selected,
  onChange,
  loading = false,
}) => {
  const [updateCategories, { isLoading: isUpdating }] = useUpdateCategoriesMutation();
  const [isSaving, setIsSaving] = React.useState(false);

  const categoryOptions = options.map(opt => ({
    value: opt.id,
    label: opt.category_name,
  }));

  const handleUpdateCategories = async () => {
    setIsSaving(true);
    const formData = new FormData();
    const categories = JSON.stringify(selected);
    formData.append('categories', categories);
    await updateCategories(formData);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Catégories de votre boutique mises à jour avec succès !");
      window.location.href = '/seller/dashboard';
    }, 1200);
  };

  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none overflow-visible animate-fade-in">
        <div className="relative w-full  rounded-3xl bg-gradient-to-br from-orange-50 via-pink-50 to-violet-50 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header sticky */}
          <div className="sticky top-0 z-10 flex items-center  max-sm:items-start justify-between px-8 pt-8 pb-2 bg-gradient-to-br from-orange-50 via-pink-50 to-violet-50 bg-opacity-80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-pink-400 p-3 shadow-lg">
                <svg className="w-7 h-7 max-sm:w-4 max-sm:h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h4.5v4.5h-4.5v-4.5zm0 12h4.5v4.5h-4.5v-4.5zm12-12h4.5v4.5h-4.5v-4.5zm0 12h4.5v4.5h-4.5v-4.5z" />
                </svg>
              </span>
              <div>
                <h2 className="text-2xl max-sm:text-lg font-extrabold text-orange-600 leading-tight">Catégories de la boutique</h2>
                <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Optimisez la visibilité de votre boutique en sélectionnant les catégories pertinentes.</p>
              </div>
            </div>
            <DialogClose asChild>
              <button
                className="text-gray-400 max-sm:hidden hover:text-gray-700 bg-white rounded-full p-2 shadow transition"
                aria-label="Fermer"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogClose>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 px-8 pb-8 pt-2">
            {/* Left: Illustration */}
        
            {/* Right: Form */}
            <div className="w-full flex flex-col justify-center">
              {/* Bloc 1 : Titre et description */}
              <div className="bg-white  rounded-3xl shadow-2xl p-6 md:p-10 border border-orange-100 mb-6 max-h-[80vh]">
                <label className="block max-sm:text-sm text-lg font-semibold text-gray-700 mb-3">
                  Sélectionnez la catégorie de votre boutique
                </label>
                {/* Bloc 2 : Sélection */}
                <div className="mb-6 w-full">
                  <Select
                    isMulti
                    options={categoryOptions}
                    value={categoryOptions.filter(opt => selected.includes(opt.value))}
                    onChange={vals => onChange(vals.map(v => v.value))}
                    placeholder="Choisissez une ou plusieurs catégories..."
                    className="w-full text-sm"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: 48,
                        borderRadius: 12,
                        borderColor: '#ed7e0f',
                        boxShadow: 'none',
                      }),
                      multiValue: (base) => ({
                        ...base,
                        background: 'linear-gradient(90deg, #ed7e0f 0%, #ed7e0f 100%)',
                        color: '#fff',
                        borderRadius: 8,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        maxHeight: 240, // Limite la hauteur du menu déroulant
                        overflowY: 'auto', // Ajoute un overflow scroll si besoin
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: 220, // Limite la hauteur de la liste des options
                        overflowY: 'auto', // Ajoute un overflow scroll si besoin
                      }),
                    }}
                  />
                </div>
                {/* Bloc 3 : Tags sélectionnés */}
              
                {/* Bloc 4 : Actions */}
                <div className="flex flex-col md:flex-row gap-3 mt-4">
              
                  <button
                    className="w-full md:w-auto p-3 text-sm bg-[#6e0a13]  text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    onClick={handleUpdateCategories}
                    disabled={loading || selected.length === 0 || isUpdating || isSaving}
                    type="button"
                  >
                    {(isUpdating || isSaving) ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                  <button
                    className="w-full p-3 text-sm md:w-auto bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:from-gray-200 hover:to-gray-400 text-gray-700 font-bold py-3 rounded-xl transition  shadow focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                    onClick={onClose}
                    type="button"
                  >
                    Annuler
                  </button>
                </div>
                <div className="mt-6 text-xs text-gray-400 text-center border-t pt-4">
                  Vous pouvez modifier ces catégories à tout moment depuis votre espace vendeur.
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;