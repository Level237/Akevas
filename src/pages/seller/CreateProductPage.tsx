import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  X,
  Save,
  AlertCircle,
  Loader2,
  Image,
  Package,
  Palette,
  Ruler
} from 'lucide-react';
import vendor from '@/assets/vendor.jpg'  
import { useAddProductMutation } from '@/services/sellerService';
import { useGetAttributeValuesQuery, useGetCategoryByGenderQuery, useGetSubCategoriesQuery, useGetTownsQuery } from '@/services/guardService';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';

// Nouvelle interface pour mieux typer les attributs
interface ProductAttribute {
  id: number;
  name: string;
  affectsPrice: boolean; // Nouveau champ pour différencier les types d'attributs
  values: Array<{
    id: number;
    value: string;
    hex?: string;
    price?: number; // Prix spécifique pour les attributs qui affectent le prix
  }>;
}

interface ProductVariant {
  id: string;
  variant_name: string;
  attribute_value_id: number[];
  price: number;
  images: File[];
  stock?: number; // Optionnel: pour gérer le stock par variant
}

// Nouvelle interface pour les variations structurées
interface Variation {
  id: string;
  color: {
    id: number;
    name: string;
    hex: string;
  };
  size?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  shoeSize?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  images: File[];
  price: number;
}

const CreateProductPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<'simple' | 'variable' | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);

  console.log(getAttributes)
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [sizeSearchTerm, setSizeSearchTerm] = useState('');
  const [weightSearchTerm, setWeightSearchTerm] = useState('');
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);
  const [showSizeSuggestions, setShowSizeSuggestions] = useState(false);
  const [showWeightSuggestions, setShowWeightSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'attributes'>('product');
  const [gender, setGender] = useState<number>(0)
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [productType, setProductType] = useState<'simple' | 'variable'>('simple');
  const [addProduct, { isLoading: isLoadingAddProduct }] = useAddProductMutation()
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender)
  const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender })
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  //console.log(getAttributes?.[3]?.groups)
  // Ajout des pointures par catégorie
  const shoeSizes = {
    'Bébé': ['16', '17', '18'],
    'Enfant': ['28', '30', '32', '34', '35', '36', '37'],
    'Adulte': ['38', '39', '40', '41', '42', '43', '44', '45']
  };

  //console.log(selectedSubCategories)
  // Liste des catégories disponibles
  console.log(variants)
  // Initialisation des attributs avec la propriété affectsPrice
  useEffect(() => {
    if (getAttributes) {
      setAttributes(
        getAttributes.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          affectsPrice: attr.name === 'Taille', // La taille affecte le prix, la couleur non
          values: []
        }))
      );
    }

    if (!attributes.some(attr => attr.affectsPrice)) {
      setAttributes([
        ...attributes,
        {
          id: 2,
          name: 'Taille',
          affectsPrice: true,
          values: []
        }
      ]);
    } else {
      // Si on a déjà un attribut qui affecte le prix, on le remplace par Taille
      setAttributes(attributes.map(attr => 
        attr.affectsPrice 
          ? { ...attr, name: 'Taille', id: 2 }
          : attr
      ));
    }
    setVariants([]);
    setVariationFrames([]);
    addVariationFrame();
  }, [getAttributes]);

  // Nouvelle fonction pour gérer la sélection/déselection des catégories
  const handleChangeCategories = (selected: number[]) => {
    setSelectedCategories(selected);
  };

  const handleChangeSubCategories = (selected: number[]) => {
    setSelectedSubCategories(selected);
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAttributeValue = (attributeId: number, value: string, valueId?: number, hex?: string) => {
    const newAttributes = [...attributes];
    const attrIndex = newAttributes.findIndex(attr => attr.id === attributeId);

    if (attrIndex !== -1) {
      // Pour les valeurs qui ne viennent pas de l'API (taille et poids),
      // on génère un ID unique négatif pour éviter les conflits avec les IDs de l'API
      const newValueId = valueId || -(Date.now());

      const newValue = {
        id: newValueId,
        value: value,
        hex: hex
      };

      if (!newAttributes[attrIndex].values.some(v => v.value === value)) {
        newAttributes[attrIndex].values.push(newValue);
        setAttributes(newAttributes);
        generateVariants(newAttributes);
      }
    }
  };
  //console.log(variants)
  const removeAttributeValue = (attributeId: number, valueToRemove: string) => {
    const newAttributes = [...attributes];
    const attrIndex = newAttributes.findIndex(attr => attr.id === attributeId);

    if (attrIndex !== -1) {
      newAttributes[attrIndex].values = newAttributes[attrIndex].values.filter(
        v => v.value !== valueToRemove
      );
      setAttributes(newAttributes);
      generateVariants(newAttributes);
    }
  };

  const generateVariants = (attrs: ProductAttribute[]) => {
    const generateCombinations = (attributes: ProductAttribute[]): { name: string; ids: number[]; price: number }[] => {
      if (attributes.length === 0) return [{ name: '', ids: [], price: Number(price) || 0 }];

      const [first, ...rest] = attributes;
      const restCombinations = generateCombinations(rest);

      return first.values.flatMap(value =>
        restCombinations.map(combo => ({
          name: combo.name ? `${value.value}-${combo.name}` : value.value,
          ids: [value.id, ...combo.ids],
          price: Number(price) || 0 // Utiliser le prix général comme valeur initiale
        }))
      );
    };

    const activeAttrs = attrs.filter(attr => attr.values.length > 0);
    const combinations = generateCombinations(activeAttrs);

    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      variant_name: combo.name,
      attribute_value_id: combo.ids,
      price: combo.price,
      images: []
    }));

    setVariants(newVariants);
  };

  const handleVariantImageUpload = (variantId: string, files: FileList) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, images: [...variant.images, ...Array.from(files)] }
        : variant
    ));
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, images: variant.images.filter((_, idx) => idx !== imageIndex) }
        : variant
    ));
  };

  const getFilteredColors = () => {
    if (!getAttributes || !getAttributes[0]?.values) return [];
    return getAttributes[0].values.filter((color: any) =>
      color.value.toLowerCase().includes(colorSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[0].id)?.values
        .some(v => v.value === color.value)
    );
  };

  const getFilteredSizes = () => {
    if (!getAttributes || !getAttributes[1]?.values) return [];
    return getAttributes[1].values.filter((size: any) =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[1].id)?.values
        .some(v => v.value === size.value)
    );
  };


  const getFilteredWeights = () => {
    if (!getAttributes || !getAttributes[2]) return [];
    return getAttributes[2].values.filter((size: any) =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[2].id)?.values.some(v => v.value === size.value)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des champs requis
    if (!name.trim()) {
      alert("Le nom du produit est requis");
      return;
    }

    if (selectedProductType === 'simple' && (!price || Number(price) <= 0)) {
      alert("Le prix doit être supérieur à 0");
      return;
    }

    if (selectedProductType === 'simple' && (!stock || Number(stock) <= 0)) {
      alert("Le stock doit être supérieur à 0");
      return;
    }

    if (gender === 0) {
      alert("Le genre du produit est requis");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Veuillez sélectionner au moins une catégorie");
      return;
    }

    if (selectedSubCategories.length === 0) {
      alert("Veuillez sélectionner au moins une sous-catégorie");
      return;
    }

    if (!city) {
      alert("La ville cible est requise");
      return;
    }

    if (!whatsappNumber.trim()) {
      alert("Le numéro WhatsApp est requis");
      return;
    }

    if (selectedProductType === 'simple' && !featuredImage) {
      alert("Une photo mise en avant est requise");
      return;
    }

    // Afficher les variations structurées
    if (selectedProductType === 'variable' && variations.length > 0) {
      console.log('Variations structurées:', variations);
      
      // Afficher un résumé des variations dans la console
      variations.forEach((variation, index) => {
        console.log(`\nVariation ${index + 1}:`);
        console.log(`- ID: ${variation.id}`);
        console.log(`- Couleur: ${variation.color.name} (${variation.color.hex})`);
        if (variation.size) {
          console.log(`- Taille: ${variation.size.name}`);
          console.log(`  Quantité: ${variation.size.quantity}`);
          console.log(`  Prix: ${variation.size.price} FCFA`);
        }
        if (variation.shoeSize) {
          console.log(`- Pointure: ${variation.shoeSize.name}`);
          console.log(`  Quantité: ${variation.shoeSize.quantity}`);
          console.log(`  Prix: ${variation.shoeSize.price} FCFA`);
        }
        console.log(`- Nombre d'images: ${variation.images.length}`);
        console.log(`- Prix total: ${variation.price} FCFA`);
      });
    }

    try {
      const formData = new FormData()
      formData.append('product_name', name);
      formData.append('product_price', price);
      formData.append('product_quantity', stock);
      formData.append('product_description', description);
      formData.append('product_gender', gender.toString());
      formData.append('whatsapp_number', whatsappNumber);
      formData.append('product_residence', city);

      if (featuredImage) {
        formData.append('product_profile', featuredImage);
      }

      images.forEach(image => formData.append('images[]', image));
      selectedCategories.forEach(category => formData.append('categories[]', category.toString()));
      selectedSubCategories.forEach(subCategory => formData.append('sub_categories[]', subCategory.toString()));

      // Ajouter les variations au formData
      if (variations.length > 0) {
        // Regrouper les variations par couleur pour éviter la duplication des images
        const variationsByColor = variations.reduce((acc, variation) => {
          const colorKey = variation.color.id;
          if (!acc[colorKey]) {
            acc[colorKey] = {
              color: variation.color,
              images: variation.images,
              variations: []
            };
          }
          acc[colorKey].variations.push({
            id: variation.id,
            size: variation.size,
            shoeSize: variation.shoeSize,
            price: variation.price
          });
          return acc;
        }, {} as Record<number, {
          color: { id: number; name: string; hex: string };
          images: File[];
          variations: Array<{
            id: string;
            size?: { id: number; name: string; quantity: number; price: number };
            shoeSize?: { id: number; name: string; quantity: number; price: number };
            price: number;
          }>;
        }>);

        // Ajouter les variations groupées par couleur
        formData.append('variations', JSON.stringify(Object.values(variationsByColor)));
        
        // Ajouter les images des variations par couleur
        Object.values(variationsByColor).forEach((colorGroup, colorIndex) => {
          colorGroup.images.forEach((image, imageIndex) => {
            formData.append(`color_${colorGroup.color.id}_image_${imageIndex}`, image);
          });
        });
      }
      
      // Afficher le contenu du formData pour vérification
      console.log('Contenu du formData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleChangeGender = (value: string) => {
    setGender(Number(value))
  };

  const handleCityChange = (value: string) => {
    setCity(value);
  };

  // Fonction pour mettre à jour le prix d'un attribut
  const updateAttributePrice = (attributeId: number, valueId: number, price: number) => {
    setAttributes(prevAttributes => 
      prevAttributes.map(attr => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: attr.values.map(val => 
              val.id === valueId ? { ...val, price } : val
            )
          };
        }
        return attr;
      })
    );
  };

  // Fonction pour gérer l'ajout de taille
  const handleAddSize = (attributeId: number) => {
    setAttributes(prevAttributes => 
      prevAttributes.map(attr => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: [...attr.values, { id: Date.now(), value: sizeSearchTerm, price: 0 }]
          };
        }
        return attr;
      })
    );
    setSizeSearchTerm('');
  };

  const [variationFrames, setVariationFrames] = useState<Array<{
    id: string;
    colorId?: number;
    sizes: Array<{
      id: number;
      quantity: number;
    }>;
    shoeSizes: Array<{
      id: number;
      quantity: number;
    }>;
    images: File[];
  }>>([]);

  // Effet pour générer les variations quand les tailles ou couleurs changent
  useEffect(() => {
    if (variationFrames.length > 0) {
      generateVariations();
    }
  }, [variationFrames]);

  const [sizePrices, setSizePrices] = useState<Record<number, number>>({});
  const [shoeSizePrices, setShoeSizePrices] = useState<Record<number, number>>({});
  const [globalColorPrice, setGlobalColorPrice] = useState<number>(0);

  // Fonction pour obtenir toutes les tailles uniques sélectionnées
  const getUniqueSizes = () => {
    const sizeIds = new Set<number>();
    variationFrames.forEach(frame => {
      frame.sizes.forEach(size => sizeIds.add(size.id));
    });
    return Array.from(sizeIds);
  };

  // Fonction pour obtenir toutes les pointures uniques sélectionnées
  const getUniqueShoeSizes = () => {
    const sizeIds = new Set<number>();
    variationFrames.forEach(frame => {
      frame.shoeSizes.forEach(size => sizeIds.add(size.id));
    });
    return Array.from(sizeIds);
  };

  const addVariationFrame = () => {
    setVariationFrames([
      ...variationFrames,
      {
        id: `frame-${Date.now()}`,
        sizes: [],
        shoeSizes: [],
        images: []
      }
    ]);
  };

  const updateVariationFrame = (frameId: string, updates: Partial<typeof variationFrames[0]>) => {
    setVariationFrames(variationFrames.map(frame => 
      frame.id === frameId ? { ...frame, ...updates } : frame
    ));
  };

  const addSizeToVariation = (frameId: string, sizeId: number, quantity: number) => {
    setVariationFrames(variationFrames.map(frame => {
      if (frame.id === frameId) {
        const existingSize = frame.sizes.find(s => s.id === sizeId);
        if (existingSize) {
          return {
            ...frame,
            sizes: frame.sizes.map(s => 
              s.id === sizeId ? { ...s, quantity: s.quantity + quantity } : s
            )
          };
        }
        return {
          ...frame,
          sizes: [...frame.sizes, { id: sizeId, quantity }]
        };
      }
      return frame;
    }));
  };

  const addShoeSizeToVariation = (frameId: string, sizeId: number, quantity: number) => {
    setVariationFrames(variationFrames.map(frame => {
      if (frame.id === frameId) {
        const existingSize = frame.shoeSizes.find(s => s.id === sizeId);
        if (existingSize) {
          return {
            ...frame,
            shoeSizes: frame.shoeSizes.map(s => 
              s.id === sizeId ? { ...s, quantity: s.quantity + quantity } : s
            )
          };
        }
        return {
          ...frame,
          shoeSizes: [...frame.shoeSizes, { id: sizeId, quantity }]
        };
      }
      return frame;
    }));
  };

  const removeSizeFromVariation = (frameId: string, sizeId: number) => {
    setVariationFrames(variationFrames.map(frame => 
      frame.id === frameId 
        ? { ...frame, sizes: frame.sizes.filter(s => s.id !== sizeId) }
        : frame
    ));
  };

  const removeShoeSizeFromVariation = (frameId: string, sizeId: number) => {
    setVariationFrames(variationFrames.map(frame => 
      frame.id === frameId 
        ? { ...frame, shoeSizes: frame.shoeSizes.filter(s => s.id !== sizeId) }
        : frame
    ));
  };

  const removeVariationFrame = (frameId: string) => {
    setVariationFrames(variationFrames.filter(frame => frame.id !== frameId));
  };

  const handleVariationImageUpload = (frameId: string, files: FileList) => {
    setVariationFrames(variationFrames.map(frame =>
      frame.id === frameId
        ? { ...frame, images: [...frame.images, ...Array.from(files)] }
        : frame
    ));
  };

  const removeVariationImage = (frameId: string, imageIndex: number) => {
    setVariationFrames(variationFrames.map(frame =>
      frame.id === frameId
        ? { ...frame, images: frame.images.filter((_, idx) => idx !== imageIndex) }
        : frame
    ));
  };

  // Fonction pour générer toutes les combinaisons possibles
  const generateVariations = () => {
    const colors = variationFrames.map(frame => frame.colorId).filter(Boolean);
    const sizes = getUniqueSizes();
    const shoeSizes = getUniqueShoeSizes();

    const newVariations: typeof variationFrames = [];

    // Pour chaque couleur, créer une variation avec toutes ses tailles
    colors.forEach(colorId => {
      const existingFrame = variationFrames.find(frame => frame.colorId === colorId);
      if (existingFrame) {
        // Si c'est une variation avec des tailles
        if (existingFrame.sizes.length > 0) {
          existingFrame.sizes.forEach(size => {
            newVariations.push({
              id: `frame-${Date.now()}-${colorId}-${size.id}`,
              colorId,
              sizes: [size],
              shoeSizes: [],
              images: existingFrame.images
            });
          });
        }
        // Si c'est une variation avec des pointures
        if (existingFrame.shoeSizes.length > 0) {
          existingFrame.shoeSizes.forEach(size => {
            newVariations.push({
              id: `frame-${Date.now()}-${colorId}-${size.id}`,
              colorId,
              sizes: [],
              shoeSizes: [size],
              images: existingFrame.images
            });
          });
        }
      }
    });

    // Filtrer les variations existantes pour éviter les doublons
    const uniqueVariations = newVariations.filter(newVar => 
      !variationFrames.some(existing => 
        existing.colorId === newVar.colorId && 
        (existing.sizes.some(s => newVar.sizes.some(ns => ns.id === s.id)) ||
         existing.shoeSizes.some(s => newVar.shoeSizes.some(ns => ns.id === s.id)))
      )
    );

    setVariationFrames([...variationFrames, ...uniqueVariations]);
  };

  const updateSizePrice = (sizeId: number, price: number) => {
    setSizePrices(prev => ({ ...prev, [sizeId]: price }));
    
    // Mettre à jour toutes les variations qui contiennent cette taille
    setVariationFrames(prevFrames => 
      prevFrames.map(frame => ({
        ...frame,
        sizes: frame.sizes.map(size => 
          size.id === sizeId ? { ...size, price } : size
        )
      }))
    );
  };
 // Fonction pour mettre à jour le prix d'une pointure
 const updateShoeSizePrice = (sizeId: number, price: number) => {
  setShoeSizePrices(prev => ({ ...prev, [sizeId]: price }));
  
  // Mettre à jour toutes les variations qui contiennent cette pointure
  setVariationFrames(prevFrames => 
    prevFrames.map(frame => ({
      ...frame,
      shoeSizes: frame.shoeSizes.map(size => 
        size.id === sizeId ? { ...size, price } : size
      )
    }))
  );
};

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'simple' || type === 'variable') {
      setSelectedProductType(type);
      setShowModal(false);
    }
  }, [searchParams]);

  const handleProductTypeSelect = async (type: 'simple' | 'variable') => {
    setSelectedProductType(type);
  };

  const handleConfirmProductType = async () => {
    if (!selectedProductType) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler un chargement
      setProductType(selectedProductType);
      setShowModal(false);
      navigate(`?type=${selectedProductType}`);
    } catch (error) {
      console.error('Erreur lors de la sélection du type de produit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour générer les variations structurées
  useEffect(() => {
    const generateStructuredVariations = () => {
      const newVariations: Variation[] = [];

      variationFrames.forEach(frame => {
        const color = getAttributes?.[0]?.values.find((c: any) => c.id === frame.colorId);
        
        if (!color) return;

        // Cas 1: Variation couleur uniquement
        if (!attributes.some(attr => attr.affectsPrice)) {
          newVariations.push({
            id: frame.id,
            color: {
              id: color.id,
              name: color.value,
              hex: color.hex_color
            },
            images: frame.images,
            price: globalColorPrice
          });
        }
        
        // Cas 2: Variation couleur + taille
        if (frame.sizes.length > 0) {
          frame.sizes.forEach(sizeItem => {
            const size = getAttributes?.[1]?.values.find((s: any) => s.id === sizeItem.id);
            if (size) {
              newVariations.push({
                id: `${frame.id}-${size.id}`,
                color: {
                  id: color.id,
                  name: color.value,
                  hex: color.hex_color
                },
                size: {
                  id: size.id,
                  name: size.value,
                  quantity: sizeItem.quantity,
                  price: sizePrices[size.id] || 0
                },
                images: frame.images,
                price: sizePrices[size.id] || 0
              });
            }
          });
        }

        // Cas 3: Variation couleur + pointure
        if (frame.shoeSizes.length > 0) {
          frame.shoeSizes.forEach(shoeItem => {
            const shoeSize = getAttributes?.[3]?.values.find((s: any) => s.id === shoeItem.id);
            if (shoeSize) {
              newVariations.push({
                id: `${frame.id}-${shoeSize.id}`,
                color: {
                  id: color.id,
                  name: color.value,
                  hex: color.hex_color
                },
                shoeSize: {
                  id: shoeSize.id,
                  name: shoeSize.value,
                  quantity: shoeItem.quantity,
                  price: shoeSizePrices[shoeSize.id] || 0
                },
                images: frame.images,
                price: shoeSizePrices[shoeSize.id] || 0
              });
            }
          });
        }
      });

      setVariations(newVariations);
    };

    generateStructuredVariations();
  }, [variationFrames, getAttributes, attributes, globalColorPrice, sizePrices, shoeSizePrices]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de sélection du type de produit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 overflow-hidden shadow-xl">
            {/* Header avec bouton de fermeture */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                Choisir le type de produit
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Produit Simple */}
                <button
                  onClick={() => handleProductTypeSelect('simple')}
                  className={`w-full transition-all ${
                    selectedProductType === 'simple'
                      ? 'bg-[#ed7e0f]/5 ring-2 ring-[#ed7e0f]'
                      : 'hover:bg-gray-50 ring-1 ring-gray-200'
                  } rounded-xl p-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      selectedProductType === 'simple'
                        ? 'bg-[#ed7e0f]/10'
                        : 'bg-gray-100'
                    }`}>
                      <Package className="w-6 h-6 text-[#ed7e0f]" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">Produit Simple</h3>
                        {selectedProductType === 'simple' && (
                          <div className="px-2 py-1 rounded-full bg-[#ed7e0f]/10 text-[#ed7e0f] text-xs font-medium">
                            Sélectionné
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Un produit unique avec un seul prix et une seule référence. Idéal pour les produits sans variations.</p>
                    </div>
                  </div>
                </button>

                {/* Produit Variable */}
                <button
                  onClick={() => handleProductTypeSelect('variable')}
                  className={`w-full transition-all ${
                    selectedProductType === 'variable'
                      ? 'bg-[#ed7e0f]/5 ring-2 ring-[#ed7e0f]'
                      : 'hover:bg-gray-50 ring-1 ring-gray-200'
                  } rounded-xl p-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      selectedProductType === 'variable'
                        ? 'bg-[#ed7e0f]/10'
                        : 'bg-gray-100'
                    }`}>
                      <Palette className="w-6 h-6 text-[#ed7e0f]" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">Produit Variable</h3>
                        {selectedProductType === 'variable' && (
                          <div className="px-2 py-1 rounded-full bg-[#ed7e0f]/10 text-[#ed7e0f] text-xs font-medium">
                            Sélectionné
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Un produit configurable avec plusieurs variations, prix et stocks. Parfait pour les vêtements et chaussures.</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Footer avec bouton de confirmation */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleConfirmProductType}
                  disabled={!selectedProductType || isLoading}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    selectedProductType
                      ? 'bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Configuration en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Continuer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        {/* Header avec boutons d'action */}
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                  {productType === 'simple' ? 'Créer un produit simple' : 'Créer un produit variable'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {productType === 'simple' 
                    ? 'Ajoutez un nouveau produit sans variations' 
                    : 'Créez un produit avec plusieurs variations'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="px-4 py-2 text-gray-700 bg-white border rounded-xl hover:bg-gray-50">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500 font-medium flex items-center gap-2"
                >
                  {isLoadingAddProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <Save className="w-4 h-4" />
                      Publier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="md:col-span-2 space-y-6">
              {/* Informations de base */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-2xl font-medium border-0 border-b focus:ring-0 focus:border-[#ed7e0f]"
                  placeholder="Nom du produit"
                  required
                />

                {productType === 'simple' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Prix (Fcfa)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Quantité disponible"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Description détaillée du produit..."
                  />
                </div>
              </div>

              {/* Catégories et sous-catégories */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-4">Genre produit</label>
                  <Select name='gender' onValueChange={handleChangeGender} required>
                    <SelectTrigger className="bg-gray-50 border-0">
                      <SelectValue placeholder="Choisir un genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Homme</SelectItem>
                      <SelectItem value="2">Femme</SelectItem>
                      <SelectItem value="3">Enfant</SelectItem>
                      <SelectItem value="4">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gender !== 0 && (
                  <>
                    <div>
                      <label className="block text-lg font-semibold mb-4">Catégories</label>
                      {isLoadingCategoriesByGender ? (
                        <div className="flex items-center justify-center h-20">
                          <Loader2 className="w-6 h-6 animate-spin text-[#ed7e0f]" />
                        </div>
                      ) : (
                        <MultiSelect
                          options={categoriesByGender?.categories}
                          selected={selectedCategories}
                          onChange={handleChangeCategories}
                          placeholder="Sélectionner les catégories..."
                        />
                      )}
                    </div>

                    {selectedCategories.length > 0 && (
                      <div>
                        <label className="block text-lg font-semibold mb-4">Sous catégories</label>
                        {isLoadingSubCategoriesByParentId ? (
                          <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-6 h-6 animate-spin text-[#ed7e0f]" />
                          </div>
                        ) : (
                          <MultiSelect
                            options={subCategoriesByGender?.categories}
                            selected={selectedSubCategories}
                            onChange={handleChangeSubCategories}
                            placeholder="Sélectionner les sous-catégories..."
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Informations de contact */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Ex: +225 0123456789"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville cible</label>
                    <Select name='city' onValueChange={handleCityChange} required>
                      <SelectTrigger className="bg-gray-50 border-0">
                        <SelectValue placeholder="Sélectionnez votre ville de livraison" />
                      </SelectTrigger>
                      <SelectContent>
                        {townsLoading ? (
                          <SelectItem value="loading">Chargement des villes...</SelectItem>
                        ) : (
                          towns?.towns.map((town: { id: string, town_name: string }) => (
                            <SelectItem key={town.id} value={String(town.id)}>
                              {town.town_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {productType === 'simple' ? (
                <>
                  {/* Photo mise en avant pour produit simple */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Photo mise en avant</h2>
                    <div className="aspect-square w-64 h-64 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                      {featuredImage ? (
                        <div className="relative group h-64">
                          <img
                            src={URL.createObjectURL(featuredImage)}
                            alt="Featured product"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeFeaturedImage}
                              className="p-2 bg-white/90 rounded-full hover:bg-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-10 h-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Ajouter une photo</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFeaturedImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Galerie d'images pour produit simple */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Galerie d'images</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <label className="aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Ajouter</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section des attributs pour produit variable */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Attributs du produit</h2>
                    <p className="text-sm text-gray-500 mt-1">Configurez les variations de votre produit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => {
                        setAttributes([]);
                        setVariants([]);
                      }}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {/* Type de variation */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Type de variation</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAttributes(attributes.filter(attr => !attr.affectsPrice));
                        setVariants([]);
                        setVariationFrames([]);
                        addVariationFrame();
                        if (variationFrames.length > 0) {
                          setVariationFrames([{
                            id: variationFrames[0].id,
                            sizes: [],
                            shoeSizes: [],
                            images: []
                          }]);
                        } else {
                          addVariationFrame();
                        }
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        !attributes.some(attr => attr.affectsPrice)
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur uniquement</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!attributes.some(attr => attr.affectsPrice)) {
                          setAttributes([
                            ...attributes,
                            {
                              id: 2,
                              name: 'Taille',
                              affectsPrice: true,
                              values: []
                            }
                          ]);
                        } else {
                          setAttributes(attributes.map(attr => 
                            attr.affectsPrice 
                              ? { ...attr, name: 'Taille', id: 2 }
                              : attr
                          ));
                        }
                        setVariants([]);
                       setVariationFrames([]);
                       addVariationFrame();
                       // Remplacer la variation existante ou en créer une nouvelle si aucune n'existe
                       if (variationFrames.length > 0) {
                         setVariationFrames([{
                          id: variationFrames[0].id,
                           sizes: [],
                           shoeSizes: [],
                           images: []
                         }]);
                       } else {
                       addVariationFrame();
                      }
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        attributes.some(attr => attr.name === 'Taille')
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur et Taille</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!attributes.some(attr => attr.affectsPrice)) {
                          setAttributes([
                            ...attributes,
                            {
                              id: 3,
                              name: 'Pointure',
                              affectsPrice: true,
                              values: []
                            }
                          ]);
                        } else {
                          setAttributes(attributes.map(attr => 
                            attr.affectsPrice 
                              ? { ...attr, name: 'Pointure', id: 3 }
                              : attr
                          ));
                        }
                        setVariants([]);
                       setVariationFrames([]);
                       addVariationFrame();
                       // Remplacer la variation existante ou en créer une nouvelle si aucune n'existe
                       if (variationFrames.length > 0) {
                         setVariationFrames([{
                           id: variationFrames[0].id,
                           sizes: [],
                           shoeSizes: [],
                           images: []
                         }]);
                       } else {
                        addVariationFrame();
                       }
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        attributes.some(attr => attr.name === 'Pointure')
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur et Pointure</span>
                      </div>
                    </button>
                  </div>
                </div>

              

              
              
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Variations du produit</h2>
                  <p className="text-sm text-gray-500 mt-1">Configurez les différentes variations de votre produit</p>
                </div>

                {/* Liste des cadres de variation */}
                <div className="space-y-6">
                  {variationFrames.map((frame) => (
                    <div key={frame.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#ed7e0f]/10 flex items-center justify-center">
                            <span className="text-[#ed7e0f] font-semibold">
                              {variationFrames.indexOf(frame) + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Variation {variationFrames.indexOf(frame) + 1}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariationFrame(frame.id)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Première ligne : Couleur et Taille/Pointure */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Sélection de la couleur */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                            <Select
                              value={frame.colorId?.toString()}
                              onValueChange={(value) => updateVariationFrame(frame.id, { colorId: Number(value) })}
                            >
                              <SelectTrigger className="bg-gray-50">
                                <SelectValue placeholder="Choisir une couleur" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAttributes?.[0]?.values
                                  .filter((color: any) => !variationFrames.some(f => f.colorId === color.id && f.id !== frame.id))
                                  .map((color: any) => (
                                    <SelectItem key={color.id} value={color.id.toString()}>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-200"
                                          style={{ backgroundColor: color.hex_color }}
                                        />
                                        <span>{color.value}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                                
                          {/* Sélection de la taille ou pointure */}
                          {attributes.some(attr => attr.name === 'Taille') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                              <div className="space-y-3">
                                <Select
                                  onValueChange={(value) => {
                                    const sizeId = Number(value);
                                    const size = getAttributes?.[1]?.values.find((s: any) => s.id === sizeId);
                                    if (size) {
                                      const quantity = prompt(`Quantité pour la taille ${size.value}:`, "1");
                                      if (quantity && !isNaN(Number(quantity))) {
                                        addSizeToVariation(frame.id, sizeId, Number(quantity));
                                      }
                                    }
                                  }}
                                >
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Choisir une taille" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAttributes?.[1]?.values.map((size: any) => (
                                      <SelectItem key={size.id} value={size.id.toString()}>
                                        {size.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* Liste des tailles sélectionnées */}
                                <div className="flex flex-wrap gap-2">
                                  {frame.sizes.map((size) => {
                                    const sizeData = getAttributes?.[1]?.values.find((s: any) => s.id === size.id);
                                    return (
                                      <div key={size.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <span className="text-sm">{sizeData?.value}</span>
                                        <button
                                          onClick={() => removeSizeFromVariation(frame.id, size.id)}
                                          className="text-gray-400 hover:text-gray-600"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {attributes.some(attr => attr.name === 'Pointure') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Pointure</label>
                              <div className="space-y-3">
                                <Select
                                  onValueChange={(value) => {
                                    const sizeId = Number(value);
                                    const size = getAttributes?.[3]?.values.find((s: any) => s.id === sizeId);
                                    if (size) {
                                      const quantity = prompt(`Quantité pour la pointure ${size.value}:`, "1");
                                      if (quantity && !isNaN(Number(quantity))) {
                                        addShoeSizeToVariation(frame.id, sizeId, Number(quantity));
                                      }
                                    }
                                  }}
                                >
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Choisir une pointure" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAttributes?.[3]?.values.map((size: any) => (
                                      <SelectItem key={size.id} value={size.id.toString()}>
                                        {size.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* Liste des pointures sélectionnées */}
                                <div className="flex flex-wrap gap-2">
                                  {frame.shoeSizes.map((size) => {
                                    const shoeSizeData = getAttributes?.[3]?.values.find((s: any) => s.id === size.id);
                                    return (
                                      <div key={size.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <span className="text-sm">{shoeSizeData?.value}</span>
                                        <button
                                          onClick={() => removeShoeSizeFromVariation(frame.id, size.id)}
                                          className="text-gray-400 hover:text-gray-600"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Section images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Images de la variation</label>
                          <div className="grid grid-cols-4 gap-3">
                            {frame.images.map((image, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Variation ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-xl"
                                />
                                <button
                                  onClick={() => removeVariationImage(frame.id, idx)}
                                  className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50/80 hover:border-[#ed7e0f] transition-all group">
                              <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#ed7e0f]" />
                              <span className="text-xs text-gray-400 group-hover:text-[#ed7e0f]">Ajouter</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => e.target.files && handleVariationImageUpload(frame.id, e.target.files)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton Ajouter une variation */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={addVariationFrame}
                    className="px-4 py-3 bg-transparent border border-[#ed7e0f] hover:bg-[#ed7e0f]/5 text-[#ed7e0f] rounded-xl hover:bg-[#ed7e0f]/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter une variation
                  </button>
                </div>
              </div>

                {/* Section des prix par taille/pointure */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prix des variations</h3>
                  
                  {/* Prix global pour les variations de couleur uniquement */}
                  {!attributes.some(attr => attr.affectsPrice) && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Prix global pour toutes les couleurs</h4>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                        <input
                          type="number"
                          value={globalColorPrice || ''}
                          onChange={(e) => setGlobalColorPrice(Number(e.target.value))}
                          placeholder="Prix global (FCFA)"
                          className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Prix des tailles */}
                  {getUniqueSizes().length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Prix des tailles</h4>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {getUniqueSizes().map(sizeId => {
                          const size = getAttributes?.[1]?.values.find((s: any) => s.id === sizeId);
                          return (
                            <div key={sizeId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                              <span className="font-medium">{size?.value}</span>
                              <input
                                type="number"
                                value={sizePrices[sizeId] || ''}
                                onChange={(e) => updateSizePrice(sizeId, Number(e.target.value))}
                                placeholder="Prix (FCFA)"
                                className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Prix des pointures */}
                  {getUniqueShoeSizes().length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Prix des pointures</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getUniqueShoeSizes().map(sizeId => {
                          const size = getAttributes?.[3]?.values.find((s: any) => s.id === sizeId);
                          return (
                            <div key={sizeId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                              <span className="font-medium">{size?.value}</span>
                              <input
                                type="number"
                                value={shoeSizePrices[sizeId] || ''}
                                onChange={(e) => updateShoeSizePrice(sizeId, Number(e.target.value))}
                                placeholder="Prix (FCFA)"
                                className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                  {/* Liste des variations sélectionnées */}
                  {variationFrames.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Variations générées</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {variationFrames.map((frame) => {
                        const color = getAttributes?.[0]?.values.find((c: any) => c.id === frame.colorId);
                        const size = frame.sizes[0] ? getAttributes?.[1]?.values.find((s: any) => s.id === frame.sizes[0].id) : null;
                        const shoeSize = frame.shoeSizes[0] ? getAttributes?.[3]?.values.find((s: any) => s.id === frame.shoeSizes[0].id) : null;

                        return (
                          <div key={frame.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                              {frame.images.length > 0 ? (
                                <div className="relative w-20 h-20 flex-shrink-0">
                                  <img
                                    src={URL.createObjectURL(frame.images[0])}
                                    alt="Variation"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  {frame.images.length > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full px-2 py-0.5 border border-gray-100 shadow-sm">
                                      <span className="text-xs text-gray-500">+{frame.images.length - 1}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Image className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                {/* En-tête avec la couleur */}
                                {color && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <div
                                      className="w-5 h-5 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color.hex_color }}
                                    />
                                    <span className="text-base font-medium">{color.value}</span>
                                    {!attributes.some(attr => attr.affectsPrice) && (
                                      <span className="text-sm font-medium text-[#ed7e0f] ml-auto">
                                        {globalColorPrice || 0} FCFA
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Grille des tailles/pointures */}
                                <div className="space-y-3">
                                  {/* Tailles */}
                                  {frame.sizes.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {frame.sizes.map(sizeItem => {
                                        const sizeData = getAttributes?.[1]?.values.find((s: any) => s.id === sizeItem.id);
                                        return (
                                          <div key={sizeItem.id} className="bg-gray-50 rounded-lg p-2">
                                            <div className="text-sm font-medium">{sizeData?.value}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs text-gray-500">Qté: {sizeItem.quantity}</span>
                                              <span className="text-xs font-medium text-[#ed7e0f]">{sizePrices[sizeItem.id] || 0} FCFA</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Pointures */}
                                  {frame.shoeSizes.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {frame.shoeSizes.map(shoeItem => {
                                        const shoeSizeData = getAttributes?.[3]?.values.find((s: any) => s.id === shoeItem.id);
                                        return (
                                          <div key={shoeItem.id} className="bg-gray-50 rounded-lg p-2">
                                            <div className="text-sm font-medium">{shoeSizeData?.value}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs text-gray-500">Qté: {shoeItem.quantity}</span>
                                              <span className="text-xs font-medium text-[#ed7e0f]">{shoeSizePrices[shoeItem.id] || 0} FCFA</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => removeVariationFrame(frame.id)}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors self-start"
                              >
                                <X className="w-5 h-5 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};

export default CreateProductPage;