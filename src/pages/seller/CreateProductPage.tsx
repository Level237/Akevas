import React, { useState, useEffect } from 'react';
import {
    Upload,
    Plus,
    X,
    Save,
    Loader2,
    Image,
} from 'lucide-react';

import { useAddProductMutation } from '@/services/sellerService';
import { useGetAttributeByCategoryQuery, useGetAttributeValueByGroupQuery, useGetAttributeValuesQuery, useGetCategoryByGenderQuery, useGetSubCategoriesQuery, useGetTownsQuery } from '@/services/guardService';
import VariationConfigModal from '@/components/VariationConfigModal';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select';
import { toast } from 'sonner';
import { compressMultipleImages } from '@/lib/imageCompression';
import ProductTypeModal from '@/components/ProductTypeModal';
import { skipToken } from '@reduxjs/toolkit/query';




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



// Nouvelle interface pour les variations structurées
interface Variation {
    id: string;
    productId: string;
    color: {
        id: number;
        name: string;
        hex: string;
    };
    sizes: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        isWholesale?: boolean; // Nouveau champ pour indiquer si cet attribut a des prix de gros
        wholesalePrices?: {
            min_quantity: number;
            wholesale_price: number;
        }[]; // Nouveau champ pour les prix de gros spécifiques à l'attribut
    }[];
    shoeSizes: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        isWholesale?: boolean;
        wholesalePrices?: {
            min_quantity: number;
            wholesale_price: number;
        }[];
    }[];
    images: File[];
    quantity: number;
    price: number;
}

const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeFromUrl = searchParams.get('type');
    const saleFromUrl = searchParams.get('sale');
    const [showModal, setShowModal] = useState(true);
    const [name, setName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [city, setCity] = useState('');
    const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");
    const { data: availableAttributes, isLoading } = useGetAttributeByCategoryQuery('guard');
    const [attributeValueWholesalePrices, setAttributeValueWholesalePrices] = useState<Record<number, Array<{ min_quantity: number; wholesale_price: number; }>>>({});
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [globalColorPrice, setGlobalColorPrice] = useState<number>(0);
    const [selectedAttributeType, setSelectedAttributeType] = useState<string | null>(null);

    // State for VariationConfigModal
    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
    const [pendingVariationData, setPendingVariationData] = useState<{
        frameId: any;
        attributeValueId: number;
        attributeValueName: string;
        colorName: string;
        colorHex: string;
    } | null>(null);
    const [attributeValuePrices, setAttributeValuePrices] = useState<Record<number, number>>({});
    const { data: getAttributeValueByGroup } = useGetAttributeValueByGroupQuery(selectedAttributeId ? selectedAttributeId.toString() : skipToken)
    const [isWholesale, setIsWholesale] = useState<boolean | null>(
        saleFromUrl ? (saleFromUrl === '1' ? true : false) : null
    );
    const [isOnlyWhole, setIsOnlyWhole] = useState<boolean | null>(
        searchParams.get('isOnlyWhole') ? (searchParams.get('isOnlyWhole') === '1' ? true : false) : null
    );
    const [wholesalePrices, setWholesalePrices] = useState<Array<{
        min_quantity: number;
        wholesale_price: number;
    }>>([{ min_quantity: 10, wholesale_price: 0 }]);
    const [variations, setVariations] = useState<Variation[]>([]);

    console.log(variations)
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    const [variants, setVariants] = useState<Variation[]>([]);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    console.log(variants)

    const [gender, setGender] = useState<number>(0)
    const [productType, setProductType] = useState<'simple' | 'variable'>(typeFromUrl === 'variable' ? 'variable' : 'simple');
    const [addProduct, { isLoading: isLoadingAddProduct }] = useAddProductMutation()
    const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender)
    const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender })
    const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
    //console.log(getAttributes?.[3]?.groups)
    // Ajout des pointures par catégorie


    //console.log(selectedSubCategories)
    // Liste des catégories disponibles

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

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const file = e.target.files[0];
                const maxSize = 2 * 1024 * 1024; // 2 Mo en octets

                let processedFile = file;

                if (file.size > maxSize) {
                    const { compressImage } = await import('@/lib/imageCompression');
                    processedFile = await compressImage(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 0.8,
                        maxSizeMB: 2,
                    });

                    toast.success("Image compressée avec succès", {
                        description: `Taille réduite de ${(file.size / 1024 / 1024).toFixed(1)}Mo à ${(processedFile.size / 1024 / 1024).toFixed(1)}Mo`,
                        duration: 3000,
                    });
                }

                setFeaturedImage(processedFile);
            } catch (error) {
                console.error('Erreur lors de la compression de l\'image:', error);
                toast.error("Erreur lors de la compression", {
                    description: "Veuillez essayer avec une autre image",
                    duration: 4000,
                });
            }
        }
    };

    const removeFeaturedImage = () => {
        setFeaturedImage(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            try {
                const files = e.target.files;
                const maxImages = 6; // Limite le nombre total d'images

                if (images.length + files.length > maxImages) {
                    toast.error(`Vous ne pouvez sélectionner que ${maxImages} images au total.`);
                    return;
                }

                // Compression multiple des images
                const compressedFiles = await compressMultipleImages(files, {
                    maxWidth: 1920,
                    maxHeight: 1080,
                    quality: 0.8,
                    maxSizeMB: 2,
                });

                setImages([...images, ...compressedFiles]);

                toast.success("Images compressées et ajoutées avec succès", {
                    description: `${files.length} image(s) ajoutée(s)`,
                    duration: 3000,
                });
            } catch (error) {
                console.error('Erreur lors de la compression des images:', error);
                toast.error("Erreur lors de la compression", {
                    description: "Veuillez essayer avec une autre image",
                    duration: 4000,
                });
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };



    const handleVariationModalConfirm = (data: { quantity: number; price: number; wholesalePrices?: Array<{ min_quantity: number; wholesale_price: number }> }) => {
        if (!pendingVariationData) return;

        const { frameId, attributeValueId, attributeValueName } = pendingVariationData;

        // Check if attribute value already exists in the frame
        setVariationFrames(prevFrames =>
            prevFrames.map(frame => {
                if (frame.id === frameId) {
                    const existingSizeIndex = frame.sizes.findIndex(s => s.id === attributeValueId);
                    if (existingSizeIndex >= 0) {
                        // Update existing
                        const newSizes = [...frame.sizes];
                        newSizes[existingSizeIndex] = { ...newSizes[existingSizeIndex], quantity: data.quantity };
                        return { ...frame, sizes: newSizes };
                    } else {
                        // Add new
                        return { ...frame, sizes: [...frame.sizes, { id: attributeValueId, name: attributeValueName, quantity: data.quantity, price: 0 }] };
                    }
                }
                return frame;
            })
        );

        // Update attribute value price
        if (data.price >= 0) {
            setAttributeValuePrices(prev => ({
                ...prev,
                [attributeValueId]: data.price
            }));
        }

        // If wholesale, save wholesale prices
        if (isWholesale && data.wholesalePrices) {
            setAttributeValueWholesalePrices(prev => ({
                ...prev,
                [attributeValueId]: data.wholesalePrices!
            }));
        }

        setIsVariationModalOpen(false);
        setPendingVariationData(null);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(variationFrames)
        // Validation des prix des variations
        if (selectedAttributeType === 'colorOnly') {
            if (!globalColorPrice || globalColorPrice <= 0) {
                toast.error('Veuillez remplir le prix global pour toutes les couleurs.');
                return;
            }
        } else if (selectedAttributeType === 'colorAndAttribute') {
            const uniqueAttributeValues = getUniqueAttributeValues();
            for (const attributeValueId of uniqueAttributeValues) {
                if (!attributeValuePrices[attributeValueId] || attributeValuePrices[attributeValueId] <= 0) {
                    toast.error(`Veuillez remplir le prix pour l'attribut ${attributeValueId}.`);
                    return;
                }
                if (isWholesale) {
                    const wholesalePrices = attributeValueWholesalePrices[attributeValueId];
                    if (!wholesalePrices || wholesalePrices.length === 0) {
                        toast.error(`Veuillez configurer au moins un palier de prix de gros pour l'attribut ${attributeValueId}.`);
                        return;
                    }
                    for (const wp of wholesalePrices) {
                        if (!wp.min_quantity || wp.min_quantity <= 0 || !wp.wholesale_price || wp.wholesale_price <= 0) {
                            toast.error(`Veuillez vérifier les prix de gros et les quantités minimales pour l'attribut ${attributeValueId}.`);
                            return;
                        }
                    }
                }
            }
        }



        // Validation pour les produits simples
        if (productType === 'simple') {
            if (!name.trim()) {
                toast.error('Le nom du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }
            if (!stock.trim()) {
                toast.error('La quantité de stock du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (!(isWholesale && isOnlyWhole) && (!price || Number(price) <= 0)) {
                toast.error('Le prix du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (!description.trim()) {
                toast.error('La description du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });

                return;
            }

            if (gender === 0) {
                toast.error('Le genre du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (selectedCategories.length === 0) {
                toast.error('La catégorie du produit est obligatoire', {
                    description: "Veuillez sélectionner au moins une catégorie",
                    duration: 4000, // ms
                });
                return;
            }

            if (selectedSubCategories.length === 0) {
                toast.error('La sous-catégorie du produit est obligatoire', {
                    description: "Veuillez sélectionner au moins une sous-catégorie",
                    duration: 4000, // ms
                });
                return;
            }

            if (!whatsappNumber.trim()) {
                toast.error('Le numéro de téléphone est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (!city) {
                toast.error('La ville du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            // Validation spécifique pour la vente en gros
            if ((productType === 'simple' || (productType === 'variable')) && isWholesale) {
                if (wholesalePrices.some(price => price.min_quantity <= 0 || price.wholesale_price <= 0)) {
                    toast.error('Les quantités minimales et les prix par lot doivent être spécifiés', {
                        description: "Veuillez remplir tous les champs obligatoires",
                        duration: 4000,
                    });
                    return;
                }
            }

            if (!featuredImage) {
                toast.error('L\'image de profil du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (images.length === 0) {
                toast.error('Veuillez ajouter des images', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }
        }

        // Validation pour les produits variables
        if (productType === 'variable') {
            if (!name.trim()) {
                toast.error('Le nom du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (!description.trim()) {
                toast.error('La description du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (gender === 0) {
                toast.error('Le genre du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (selectedCategories.length === 0) {
                toast.error('La catégorie du produit est obligatoire', {
                    description: "Veuillez sélectionner au moins une catégorie",
                    duration: 4000, // ms
                });
                return;
            }

            if (selectedSubCategories.length === 0) {
                toast.error('La sous-catégorie du produit est obligatoire', {
                    description: "Veuillez sélectionner au moins une sous-catégorie",
                    duration: 4000, // ms
                });
                return;
            }

            if (!whatsappNumber.trim()) {
                toast.error('Le numéro de téléphone est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            if (!city) {
                toast.error('La ville du produit est obligatoire', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            // Validation spécifique pour la vente en gros


            // Validation des variations
            if (variationFrames.length === 0) {
                toast.error('Veuillez ajouter des variations', {
                    description: "Veuillez remplir tous les champs obligatoires",
                    duration: 4000, // ms
                });
                return;
            }

            // Vérifier que chaque variation a une couleur et des images
            const invalidVariations = variationFrames.some(frame =>
                !frame.color.id || frame.images.length === 0 || frame.sizes.length === 0
            );

            if (invalidVariations) {
                toast.error('Une de vos variations est incomplete', {
                    description: "Veuillez ajouter au moins une image,une couleur et une taille pour chaque variation.",
                    duration: 4000, // ms
                });
                return;
            }

            // Vérifier les quantités pour les variations
            if (!attributes.some(attr => attr.affectsPrice)) {
                const invalidQuantities = variationFrames.some(frame =>
                    !frame.quantity || frame.quantity <= 0
                );

                if (invalidQuantities) {
                    toast.error('Veuillez remplir tous les champs obligatoires', {
                        description: "Tous les champs marqués d'un * sont requis.",
                        duration: 4000, // ms
                    });
                    return;
                }
            } else {
                // Vérifier les quantités pour les tailles/pointures
                const invalidSizes = variationFrames.some(frame =>
                    frame.sizes.some(size => !size.quantity || size.quantity <= 0) ||
                    frame.shoeSizes.some(size => !size.quantity || size.quantity <= 0)
                );

                if (invalidSizes) {
                    toast.error('Veuillez remplir tous les champs obligatoires', {
                        description: "Tous les champs marqués d'un * sont requis.",
                        duration: 4000, // ms
                    });
                    return;
                }
            }

            // Vérifier les prix
            if (!attributes.some(attr => attr.affectsPrice)) {
                if (!globalColorPrice || globalColorPrice <= 0) {
                    toast.error('Veuillez remplir tous les champs obligatoires', {
                        description: "Tous les champs marqués d'un * sont requis.",
                        duration: 4000, // ms
                    });
                    return;
                }
            } else {
                const invalidPrices = Object.values(sizePrices).some(price => !price || price <= 0) ||
                    Object.values(shoeSizePrices).some(price => !price || price <= 0);

                if (invalidPrices) {
                    toast.error('Veuillez remplir tous les champs obligatoires', {
                        description: "Tous les champs marqués d'un * sont requis.",
                        duration: 4000, // ms
                    });
                    return;
                }
            }
        }

        // Si toutes les validations sont passées, continuer avec la soumission
        try {
            const formData = new FormData()
            formData.append('product_name', name);
            formData.append('product_price', price);
            formData.append('product_quantity', stock);
            formData.append('product_description', description);
            formData.append('product_gender', gender.toString());
            formData.append('whatsapp_number', whatsappNumber);
            formData.append('product_residence', city);
            formData.append('type', productType);
            formData.append('is_wholesale', isWholesale ? '1' : '0');
            if (isOnlyWhole !== null) {
                formData.append('is_only_wholesale', isOnlyWhole ? '1' : '0');
            }

            // Ajouter les données de vente en gros si applicable
            if (isWholesale) {
                if (!isOnlyWhole) { // Only append product_price if not *only* wholesale
                    formData.append('product_price', price);
                }

                formData.append('wholesale_prices', JSON.stringify(wholesalePrices));
            }
            else {
                // If not wholesale, then product_price is always required.
                formData.append('product_price', price);
            }

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
                    const colorId = variation.color.id;
                    if (!acc[colorId]) {
                        acc[colorId] = {
                            color: variation.color,
                            images: [], // Initialise le tableau d'images pour ce groupe de couleurs
                            sizes: [],
                            shoeSizes: []
                        };
                    }

                    // Ajoute les images de la variation actuelle au groupe de couleurs
                    variation.images.forEach(image => {
                        // Évite d'ajouter des doublons si une image est déjà présente
                        if (!acc[colorId].images.some((existingImage: File) => existingImage.name === image.name)) {
                            acc[colorId].images.push(image);
                        }
                    });

                    if (selectedAttributeType === 'colorAndAttribute') {
                        if (variation.sizes && variation.sizes.length > 0) {
                            variation.sizes.forEach(size => {
                                const attributeValueId = size.id; // Assuming size.id is the attribute value ID


                                acc[colorId].sizes.push({
                                    id: size.id,
                                    name: size.name,
                                    quantity: size.quantity,
                                    price: attributeValuePrices[attributeValueId],
                                    is_wholesale: isWholesale,
                                    wholesale_prices: attributeValueWholesalePrices[attributeValueId] || []
                                });
                            });
                        }
                        if (variation.shoeSizes && variation.shoeSizes.length > 0) {
                            variation.shoeSizes.forEach(shoeSize => {
                                const attributeValueId = shoeSize.id; // Assuming shoeSize.id is the attribute value ID


                                acc[colorId].shoeSizes.push({
                                    id: shoeSize.id,
                                    name: shoeSize.name,
                                    quantity: shoeSize.quantity,
                                    price: attributeValuePrices[attributeValueId],
                                    is_wholesale: isWholesale,
                                    wholesale_prices: attributeValueWholesalePrices[attributeValueId] || []
                                });
                            });
                        }
                    } else if (selectedAttributeType === 'colorOnly') {
                        acc[colorId].price = globalColorPrice; // Set global price for color only variations
                        acc[colorId].quantity = variation.quantity;

                    }


                    return acc;
                }, {} as Record<string, any>);

                // Ajouter les variations groupées par couleur
                formData.append('variations', JSON.stringify(Object.values(variationsByColor)));

                // Ajouter les images des variations par couleur
                Object.values(variationsByColor).forEach((colorGroup: any) => {
                    colorGroup.images.forEach((image: File, imageIndex: number) => {
                        formData.append(`color_${colorGroup.color.id}_image_${imageIndex}`, image);
                    });
                });
            }

            // Afficher le contenu du formData pour vérification
            console.log('Contenu du formData:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const reponse = await addProduct(formData);
            console.log(reponse)
            toast.success('Produit créé avec succès', {
                description: "Vous pouvez désormais accéder à votre liste de produits",
                duration: 4000, // ms
            });
            navigate('/seller/products')
        } catch (error) {


            toast.error('Une erreur est survenue lors de la création du produit', {
                description: "Veuillez réessayer",
                action: {
                    label: "Réessayer",
                    onClick: () => window.location.href = "/seller/create-product"
                },
                duration: 4000, // ms
            });
            console.error(error);
        }
    };

    const handleChangeGender = (value: string) => {
        setGender(Number(value))
    };

    const handleCityChange = (value: string) => {
        setCity(value);
    };

    const addWholesalePrice = () => {
        setWholesalePrices(prev => [...prev, { min_quantity: 0, wholesale_price: 0 }]);
    };

    const removeWholesalePrice = (index: number) => {
        if (wholesalePrices.length > 1) {
            setWholesalePrices(prev => prev.filter((_, i) => i !== index));
        }
    };





    const [variationFrames, setVariationFrames] = useState<Variation[]>([]);

    // Effet pour générer les variations quand les tailles ou couleurs changent
    useEffect(() => {
        if (variationFrames.length > 0) {
            generateVariations();
        }
    }, [variationFrames, getAttributes, attributes, globalColorPrice, attributeValuePrices, selectedAttributeId, getAttributeValueByGroup]);

    const [sizePrices, setSizePrices] = useState<Record<number, number>>({});
    const [shoeSizePrices, setShoeSizePrices] = useState<Record<number, number>>({});

    console.log(setSizePrices, setShoeSizePrices)
    const getUniqueAttributeValues = () => {
        const attributeValueIds = new Set<number>();
        if (selectedAttributeType === 'colorAndAttribute' && selectedAttributeId && getAttributeValueByGroup) {
            variationFrames.forEach(frame => {
                frame.sizes.forEach(size => {
                    // Check if the size.id exists in the current selected attribute group's values
                    const isAttributeValue = getAttributeValueByGroup.some((group: { values: { id: number }[] }) =>
                        group.values.some((val: any) => val.id === size.id)
                    );
                    if (isAttributeValue) {
                        attributeValueIds.add(size.id);
                    }
                });
            });
        }
        return Array.from(attributeValueIds);
    };




    const addVariationFrame = () => {
        setVariationFrames(prevFrames => [
            ...prevFrames,
            {
                id: `frame-${Date.now()}`,
                productId: '',
                color: { id: 0, name: '', hex: '' }, // Default color
                sizes: [],
                shoeSizes: [],
                images: [],
                quantity: 0,
                price: 0,
            }
        ]);
    };

    const updateVariationFrame = (frameId: string, updates: Partial<Variation>) => {
        setVariationFrames(variationFrames.map(frame =>
            frame.id === frameId ? { ...frame, ...updates } : frame
        ));
    };



    const removeVariationFrame = (frameId: string) => {
        setVariationFrames(variationFrames.filter(frame => frame.id !== frameId));
    };

    const handleVariationImageUpload = async (frameId: string, files: FileList) => {
        try {
            // Limite le nombre d'images par variation (exemple : 3)
            const maxImages = 3;
            const currentFrame = variationFrames.find(frame => frame.id === frameId);
            const currentImages = currentFrame?.images || [];

            if (currentImages.length + files.length > maxImages) {
                toast.error(`Vous ne pouvez sélectionner que ${maxImages} images par variation.`);
                return;
            }

            // Compression multiple des images
            const compressedFiles = await compressMultipleImages(files, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.8,
                maxSizeMB: 2,
            });

            // Mise à jour des variations avec les images compressées
            setVariationFrames(variationFrames.map(frame =>
                frame.id === frameId
                    ? { ...frame, images: [...frame.images, ...compressedFiles] }
                    : frame
            ));

            toast.success("Images compressées et ajoutées avec succès", {
                description: `${files.length} image(s) ajoutée(s) à la variation`,
                duration: 3000,
            });

        } catch (error) {
            console.error('Erreur lors de la compression des images:', error);
            toast.error("Erreur lors de la compression", {
                description: "Veuillez essayer avec une autre image",
                duration: 4000,
            });
        }
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
        const colors = variationFrames.map(frame => frame.color).filter(Boolean);

        const newVariations: Variation[] = [];

        colors.forEach(color => {
            const existingFrame = variationFrames.find(frame => color.id && frame.color.id === color.id);
            if (existingFrame) {
                // Check if frame has any sizes or shoeSizes (attribute-based variation)
                const hasAttributes = existingFrame.sizes.length > 0 || existingFrame.shoeSizes.length > 0;

                if (hasAttributes) {
                    // Create variations for each size/shoeSize
                    const allAttributeValues = [...existingFrame.sizes, ...existingFrame.shoeSizes];

                    allAttributeValues.forEach(attrValue => {
                        newVariations.push({
                            id: `frame-${Date.now()}-${color.id}-${attrValue.id}`,
                            productId: '',
                            color: color,
                            sizes: existingFrame.sizes,
                            shoeSizes: existingFrame.shoeSizes,
                            images: existingFrame.images,
                            quantity: attrValue.quantity || 0,
                            price: attrValue.price || 0,
                        });
                    });
                } else {
                    // Handle color only variations
                    newVariations.push({
                        id: `frame-${Date.now()}`,
                        productId: '',
                        color: color,
                        sizes: [],
                        shoeSizes: [],
                        images: existingFrame.images,
                        quantity: existingFrame.quantity || 0,
                        price: existingFrame.price || 0,
                    });
                }
            }
        });

        // Filter existing variations to avoid duplicates
        const uniqueVariations = newVariations.filter(newVar =>
            !variationFrames.some(existing =>
                existing.color.id === newVar.color.id &&
                existing.sizes.length === newVar.sizes.length &&
                existing.shoeSizes.length === newVar.shoeSizes.length
            )
        );

        setVariations([...uniqueVariations]); // Update the main variations state
    };



    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'variable' || type === 'simple') {
            setProductType(type);
            setShowModal(false);
        }
    }, [searchParams]);



    const handleConfirmProductType = async (productType: 'simple' | 'variable', isWholesaleValue: boolean, isOnlyWholeValue: boolean | null) => {
        setProductType(productType);
        setIsWholesale(isWholesaleValue);
        setIsOnlyWhole(isOnlyWholeValue); // Set the new state
        setShowModal(false);
        // setCurrentStep(2); // Supprimé car géré par le modal
        const saleValue = isWholesaleValue ? '1' : '0';
        const isOnlyWholeParam = isOnlyWholeValue !== null ? `&isOnlyWhole=${isOnlyWholeValue ? '1' : '0'}` : '';
        navigate(`/seller/create-product?type=${productType}&sale=${saleValue}${isOnlyWholeParam}`, { replace: true });
    };

    // Effet pour générer les variations structurées
    useEffect(() => {
        const generateStructuredVariations = () => {
            const newVariations: Variation[] = [];

            variationFrames.forEach(frame => {
                const color = getAttributes?.[0]?.values.find((c: any) => c.id === frame.color.id);

                if (!color) return;

                // Cas 1: Variation couleur uniquement
                if (selectedAttributeType === 'colorOnly') {
                    newVariations.push({
                        id: frame.id,
                        productId: '',
                        color: {
                            id: frame.color.id,
                            name: color.value,
                            hex: color.hex_color
                        },
                        sizes: [],
                        shoeSizes: [],
                        images: frame.images.map(image => image as unknown as File),
                        quantity: frame.quantity || 0,
                        price: globalColorPrice || 0,
                    });
                } else if (selectedAttributeType === 'colorAndAttribute' && selectedAttributeId) {
                    frame.sizes.forEach(attributeValue => {
                        const attributeValueData = getAttributeValueByGroup?.flatMap((group: any) => group.values).find((val: any) => val.id === attributeValue.id);
                        if (attributeValueData) {
                            newVariations.push({
                                id: `variation-${frame.id}-${attributeValue.id}`,
                                productId: '',
                                color: {
                                    id: frame.color.id,
                                    name: color.value,
                                    hex: color.hex_color
                                },
                                sizes: [{ id: attributeValue.id, name: attributeValue.name, quantity: attributeValue.quantity, price: attributeValuePrices[attributeValue.id] || 0 }],
                                shoeSizes: [],
                                images: frame.images.map(image => image as unknown as File),
                                quantity: attributeValue.quantity || 0,
                                price: attributeValuePrices[attributeValue.id] || 0,
                            });
                        }
                    });
                }
            });

            setVariations(newVariations);
        };

        generateStructuredVariations();
    }, [variationFrames, getAttributes, attributes, globalColorPrice, attributeValuePrices, selectedAttributeId, getAttributeValueByGroup, selectedAttributeType]);

    // Effet pour gérer l'initialisation depuis l'URL
    useEffect(() => {
        if (typeFromUrl && saleFromUrl) {
            setIsWholesale(saleFromUrl === '1');
            setProductType(typeFromUrl as 'simple' | 'variable');
            setShowModal(false);
        }
    }, [searchParams]);








    const removeAttributeValueFromVariation = (frameId: string, attributeValueId: number) => {
        setVariationFrames(prevFrames =>
            prevFrames.map(frame =>
                frame.id === frameId
                    ? { ...frame, sizes: frame.sizes.filter(size => size.id !== attributeValueId) }
                    : frame
            )
        );
    };



    return (
        <div className="min-h-screen bg-gray-50 max-w-[1440px] mx-auto   max-sm:pb-16">
            {/* Modal de sélection du type de produit */}
            {showModal && (
                <ProductTypeModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmProductType}
                    initialProductType={null}
                    initialIsWholesale={isWholesale}
                    initialIsOnlyWhole={isOnlyWhole}
                />
            )}

            <form onSubmit={handleSubmit} className='' encType='multipart/form-data'>
                {/* Header avec boutons d'action */}
                <header className="sticky top-16 px-24 max-sm:px-0 z-30 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        {/* Version mobile */}
                        <div className="md:hidden">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/seller/products")}
                                    className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className='flex max-sm:flex-col'>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#6e0a13] to-orange-600 bg-clip-text text-transparent">
                                        {productType === 'simple' ? 'Produit simple' : 'Produit variable'}

                                    </h1>
                                    {isWholesale && (
                                        <span className="text-center gap-1 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium rounded-full">
                                            Vente en gros
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="p-2 bg-[#6e0a13] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500"
                                >
                                    {isLoadingAddProduct ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : <span className='max-sm:text-sm'>Publier</span>}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 text-center">
                                {productType === 'simple'
                                    ? 'Ajoutez un nouveau produit sans variations'
                                    : 'Créez un produit avec plusieurs variations'}
                            </p>
                        </div>

                        {/* Version desktop */}
                        <div className="hidden md:flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                                    {productType === 'simple' ? 'Créer un produit simple' : 'Créer un produit variable'}
                                    {isWholesale && (
                                        <span className="ml-3 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-full">
                                            📦 Vente en gros
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {productType === 'simple'
                                        ? 'Ajoutez un nouveau produit sans variations'
                                        : 'Créez un produit avec plusieurs variations'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 text-gray-700 bg-white border rounded-xl hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#6e0a13] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500 font-medium flex items-center gap-2"
                                >
                                    {isLoadingAddProduct ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
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

                <main className="max-w-7xl pl-24 max-sm:px-4  px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne principale */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Informations de base */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full max-sm:placeholder:text-lg px-4 py-3 text-2xl font-medium border-0 border-b focus:ring-0 focus:border-[#ed7e0f]"
                                    placeholder="Nom du produit"
                                />

                                {productType === 'simple' && (
                                    <div className="grid grid-cols-2 gap-4">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full max-sm:placeholder:text-md px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                                                placeholder={
                                                    isWholesale && isOnlyWhole
                                                        ? "Prix d'un article"
                                                        : "Prix de détail (Fcfa)"
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                className="w-full max-sm:placeholder:text-sm px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                                                placeholder="Quantité disponible"

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
                                        className="w-full max-sm:placeholder:text-md px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                                        placeholder="Description détaillée du produit..."
                                    />
                                </div>
                            </div>

                            {/* Section Vente en Gros - Visible uniquement si isWholesale est true */}
                            {isWholesale && productType === "simple" && (
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-sm p-6 border border-purple-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Prix de Gros</h2>
                                            <p className="text-purple-600 text-sm font-medium">Configurez vos tarifs pour les revendeurs</p>
                                        </div>
                                    </div>

                                    {/* Prix de gros */}
                                    <div className="space-y-4">
                                        {wholesalePrices.map((price, index) => (
                                            <div key={index} className="bg-white rounded-xl p-4 border border-purple-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-purple-600">Prix #{index + 1}</span>
                                                    {wholesalePrices.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeWholesalePrice(index)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité minimale</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={price.min_quantity}
                                                            onChange={(e) => setWholesalePrices(prev => prev.map((p, i) =>
                                                                i === index ? { ...p, min_quantity: Number(e.target.value) } : p
                                                            ))}
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            placeholder="Ex: 10"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prix par unité (FCFA)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={price.wholesale_price}
                                                            onChange={(e) => setWholesalePrices(prev => prev.map((p, i) =>
                                                                i === index ? { ...p, wholesale_price: Number(e.target.value) } : p
                                                            ))}
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            placeholder="Ex: 5000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bouton ajouter un nouveau prix */}
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={addWholesalePrice}
                                            className="px-4 py-2 bg-transparent border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                                        >
                                            + Ajouter un prix
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Catégories et sous-catégories */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                <div>
                                    <label className="block text-lg max-sm:text-sm font-semibold mb-4">Genre produit</label>
                                    <Select name='gender' onValueChange={handleChangeGender}>
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
                                            <label className="block max-sm:text-sm text-lg font-semibold mb-4">Catégories</label>
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
                                                placeholder="Ex: +237 656488374"

                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville cible</label>
                                        <Select name='city' onValueChange={handleCityChange} >
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
                                        <h2 className="text-lg max-sm:text-sm font-semibold mb-4">Photo mise en avant</h2>
                                        <div className="aspect-square w-64 max-sm:w-44 h-64 max-sm:h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                                            {featuredImage ? (
                                                <div className="relative group h-64">
                                                    <img
                                                        src={URL.createObjectURL(featuredImage)}
                                                        alt="Featured product"
                                                        className="w-full max-sm:w-44 h-full max-sm:h-44 object-cover"
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
                                        <h2 className="text-lg font-semibold max-sm:text-sm mb-4">Galerie d'images</h2>
                                        <div className="grid grid-cols-3 gap-4">
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
                                                <Upload className="w-8 h-8 max-sm:w-5 max-sm:h-5 text-gray-400" />
                                                <span className="mt-2 text-sm max-sm:text-xs text-gray-500">Ajouter</span>
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
                                                <h2 className="text-lg font-semibold max-sm:text-sm text-gray-900">Attributs du produit</h2>
                                                <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Configurez les variations de votre produit</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1.5 max-sm:text-xs text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
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
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedAttributeType('colorOnly');
                                                        setAttributes(attributes.filter(attr => !attr.affectsPrice));
                                                        setVariants([]);
                                                        setVariationFrames([]);
                                                        addVariationFrame();
                                                    }}
                                                    className={`p-4 h-24 rounded-xl max-sm:text-xs border-2 transition-all ${selectedAttributeType === 'colorOnly'
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
                                                        setSelectedAttributeType('colorAndAttribute');
                                                        setVariants([]);
                                                        setVariationFrames([]);
                                                        addVariationFrame();
                                                    }}
                                                    className={`p-4 h-24 rounded-xl border-2 transition-all ${selectedAttributeType === 'colorAndAttribute'
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
                                                        <span className="text-xs font-medium">Couleur et Attribut</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {selectedAttributeType === 'colorAndAttribute' && (
                                            <div className="mb-8">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">Sélectionner la catégorie d'attribut</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {!isLoading && availableAttributes.map((attr: any) => {
                                                        const isSelected = selectedAttributeId === attr.attribute_id;
                                                        return (
                                                            <button
                                                                key={attr.attribute_id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const selectedCat = attr;
                                                                    if (selectedCat) {
                                                                        setSelectedAttributeId(selectedCat.attribute_id);
                                                                        setAttributes(prev => {
                                                                            const existingAttribute = prev.find(a => a.affectsPrice);
                                                                            if (existingAttribute) {
                                                                                return prev.map(a =>
                                                                                    a.affectsPrice
                                                                                        ? { ...a, name: selectedCat.attribute_name, id: selectedCat.attribute_id }
                                                                                        : a
                                                                                );
                                                                            } else {
                                                                                return [
                                                                                    ...prev.filter(a => !a.affectsPrice),
                                                                                    {
                                                                                        id: selectedCat.attribute_id,
                                                                                        name: selectedCat.attribute_name,
                                                                                        affectsPrice: true,
                                                                                        values: []
                                                                                    }
                                                                                ];
                                                                            }
                                                                        });
                                                                    }

                                                                    setVariants([]);
                                                                    // Reset to a single empty frame
                                                                    setVariationFrames([{
                                                                        id: "",
                                                                        sizes: [],
                                                                        productId: "",
                                                                        shoeSizes: [],
                                                                        images: [],
                                                                        quantity: 0,
                                                                        price: 0,
                                                                        color: {
                                                                            id: 0,
                                                                            name: "",
                                                                            hex: ""
                                                                        }
                                                                    }]);
                                                                }}
                                                                className={`
                                                                    relative flex flex-col items-start p-2 rounded-xl border-2 transition-all duration-200 text-left
                                                                    ${isSelected
                                                                        ? 'border-[#ed7e0f] bg-[#ed7e0f]/5 shadow-sm'
                                                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                                                                    }
                                                                `}
                                                            >
                                                                <span className={`text-xs font-semibold tracking-wider mb-1 ${isSelected ? 'text-[#ed7e0f]' : 'text-gray-500'}`}>
                                                                    {attr.category_name}
                                                                </span>
                                                                <span className={`font-medium text-xs ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                                                    {attr.attribute_name}
                                                                </span>

                                                                {isSelected && (
                                                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#ed7e0f]" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedAttributeType && (
                                        <div className="bg-white rounded-2xl shadow-sm p-6">
                                            <div className="mb-6">
                                                <h2 className="text-lg max-sm:text-sm font-semibold text-gray-900">Variations du produit</h2>
                                                <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Configurez les différentes variations de votre produit</p>
                                            </div>

                                            {/* Liste des cadres de variation */}
                                            <div className="space-y-6">
                                                {variationFrames.map((frame) => (
                                                    <div key={frame.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-[#ed7e0f]/10 flex items-center justify-center">
                                                                    <span className="text-[#ed7e0f] font-semibold max-sm:text-xs">
                                                                        {variationFrames.indexOf(frame) + 1}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg max-sm:text-sm font-semibold text-gray-900">Variation {variationFrames.indexOf(frame) + 1}</h3>
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
                                                                    <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Couleur</label>
                                                                    <Select
                                                                        value={frame.color?.id.toString()}
                                                                        onValueChange={(value) => {
                                                                            const selectedColor = getAttributes?.[0]?.values.find((c: any) => c.id === Number(value));
                                                                            if (selectedColor) {
                                                                                updateVariationFrame(frame.id, { color: { id: selectedColor.id, name: selectedColor.value, hex: selectedColor.hex_color } });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="bg-gray-50">
                                                                            <SelectValue placeholder="Choisir une couleur" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {getAttributes?.[0]?.values
                                                                                .filter((color: any) => !variationFrames.some(f => f.color.id === color.id && f.id !== frame.id))
                                                                                .map((color: any) => (
                                                                                    <SelectItem key={color.id} value={color.id.toString()}>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div
                                                                                                className="w-4 h-4 rounded-full border border-gray-200"
                                                                                                style={{ backgroundColor: color.hex_color }}
                                                                                            />
                                                                                            <span>{color.value} </span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                {/* Champ quantité pour couleur uniquement */}
                                                                {!attributes.some(attr => attr.affectsPrice) && (
                                                                    <div>
                                                                        <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Quantité</label>
                                                                        <input
                                                                            type="number"
                                                                            min={1}
                                                                            value={frame.quantity ?? ''}
                                                                            onChange={e => updateVariationFrame(frame.id, { quantity: Number(e.target.value) })}
                                                                            className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f]"
                                                                            placeholder="Quantité pour cette couleur"

                                                                        />
                                                                    </div>
                                                                )}

                                                                {(selectedAttributeType === 'colorAndAttribute' && selectedAttributeId && getAttributeValueByGroup) && (
                                                                    <div>
                                                                        <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Attribut</label>
                                                                        <div className="space-y-3">
                                                                            <Select
                                                                                value={pendingVariationData?.frameId === frame.id ? pendingVariationData.attributeValueId.toString() : ''}
                                                                                onValueChange={(value) => {
                                                                                    const selectedValueId = Number(value);
                                                                                    let selectedValue: any;

                                                                                    getAttributeValueByGroup?.forEach((group: any) => {
                                                                                        const found = group.values.find((val: any) => val.id === selectedValueId);
                                                                                        if (found) {
                                                                                            selectedValue = found;
                                                                                        }
                                                                                    });

                                                                                    if (selectedValue) {
                                                                                        // Get color info for the modal
                                                                                        const color = getAttributes?.[0]?.values.find((c: any) => c.id === frame.color.id);

                                                                                        setPendingVariationData({
                                                                                            frameId: frame.id,
                                                                                            attributeValueId: selectedValueId,
                                                                                            attributeValueName: selectedValue.value,
                                                                                            colorName: color?.value || 'Couleur',
                                                                                            colorHex: color?.hex_color || '#000000'
                                                                                        });
                                                                                        setIsVariationModalOpen(true);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="bg-gray-50">
                                                                                    <SelectValue placeholder="Choisir une valeur d'attribut" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {getAttributeValueByGroup?.map((group: any) => {
                                                                                        // Filtrer les valeurs déjà sélectionnées
                                                                                        const availableValues = group.values.filter((value: any) =>
                                                                                            !frame.sizes.some((size: any) => size.id === value.id)
                                                                                        );

                                                                                        // Ne pas afficher le groupe s'il n'y a plus de valeurs disponibles
                                                                                        if (availableValues.length === 0) return null;

                                                                                        return (
                                                                                            <SelectGroup key={group.group_id}>
                                                                                                <SelectLabel>{group.group_label}</SelectLabel>
                                                                                                {availableValues.map((value: any) => (
                                                                                                    <SelectItem key={value.id} value={value.id.toString()}>
                                                                                                        {value.value} {value.label}
                                                                                                    </SelectItem>
                                                                                                ))}
                                                                                            </SelectGroup>
                                                                                        );
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>

                                                                            <div className="flex flex-wrap gap-2">
                                                                                {frame.sizes.map((size) => {
                                                                                    const attributeGroup = getAttributeValueByGroup?.find((group: any) =>
                                                                                        group.values.some((val: any) => val.id === size.id)
                                                                                    );
                                                                                    const sizeData = attributeGroup?.values.find((val: any) => val.id === size.id);
                                                                                    return (
                                                                                        <div key={size.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                                                            <span className="text-sm"> {sizeData?.value} Qté :{size.quantity}</span>
                                                                                            <button
                                                                                                onClick={() => removeAttributeValueFromVariation(frame.id, size.id)}
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
                                                                <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Images de la variation</label>
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

                                                <button
                                                    type="button"
                                                    onClick={addVariationFrame}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-[#ed7e0f] bg-[#ed7e0f]/10 hover:bg-[#ed7e0f]/20 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Ajouter une variation
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Section des prix par taille/pointure */}
                                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                                        <h3 className="text-lg max-sm:text-sm font-semibold text-gray-900 mb-4">Prix des variations</h3>

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
                                    </div>

                                    {/* Liste des variations sélectionnées */}
                                    {variationFrames.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variations générées</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {variationFrames.map((frame) => {
                                                    const color = getAttributes?.[0]?.values.find((c: any) => c.id === frame.color.id);


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
                                                                        <div className="flex flex-col items-start gap-2 mb-3">
                                                                            <div className='flex items-center gap-2'>
                                                                                <div>
                                                                                    <div
                                                                                        className="w-5 h-5 rounded-full border border-gray-200"
                                                                                        style={{ backgroundColor: color.hex_color }}
                                                                                    />
                                                                                    <span className="text-base text-sm font-medium">{color.value}</span>
                                                                                </div>
                                                                                <div>

                                                                                </div>
                                                                            </div>
                                                                            {selectedAttributeType === 'colorOnly' && (
                                                                                <>
                                                                                    <div>
                                                                                        <span className='text-sm'>Prix :</span>
                                                                                        <span className="text-sm font-medium text-[#ed7e0f] ml-auto">
                                                                                            {globalColorPrice || 0} FCFA
                                                                                        </span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="text-xs text-gray-500">Quantité: {frame.quantity}</span>
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                        </div>
                                                                    )}

                                                                    {/* Grille des tailles/pointures */}
                                                                    <div className="space-y-3">
                                                                        {/* Attributs */}
                                                                        {selectedAttributeType === 'colorAndAttribute' && frame.sizes.length > 0 && (
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {frame.sizes.map(attributeItem => {
                                                                                    let attributeValueData: any;
                                                                                    getAttributeValueByGroup?.forEach((group: any) => {
                                                                                        const found = group.values.find((val: any) => val.id === attributeItem.id);
                                                                                        if (found) {
                                                                                            attributeValueData = found;
                                                                                        }
                                                                                    });
                                                                                    return (
                                                                                        <div
                                                                                            key={attributeItem.id}
                                                                                            className="bg-gray-50 rounded-lg p-3 w-full cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                                                                                            onClick={() => {
                                                                                                setPendingVariationData({
                                                                                                    frameId: frame.id,
                                                                                                    attributeValueId: attributeItem.id,
                                                                                                    attributeValueName: attributeValueData?.value || '',
                                                                                                    colorName: color?.value || '',
                                                                                                    colorHex: color?.hex_color || ''
                                                                                                });
                                                                                                setIsVariationModalOpen(true);
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex flex-col gap-3">
                                                                                                {/* Partie Gauche : Détails Stock */}
                                                                                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                                                                                    <div className="text-sm font-medium text-gray-900">{attributeValueData?.value} {attributeValueData?.label}</div>
                                                                                                    <div className="flex items-center gap-3 text-xs">
                                                                                                        <div className="flex items-center gap-1">
                                                                                                            <span className="text-gray-500">Qté:</span>
                                                                                                            <span className="font-medium text-gray-900">{attributeItem.quantity}</span>
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-1">
                                                                                                            <span className="text-gray-500">Prix:</span>
                                                                                                            <span className="font-medium text-[#ed7e0f]">{attributeValuePrices[attributeItem.id] || 0} FCFA</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Partie Droite : Résumé Prix de gros */}
                                                                                                {isWholesale && attributeValueWholesalePrices[attributeItem.id] && (
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <div className="px-2 py-1 bg-orange-50 text-[#ed7e0f] rounded text-[10px] font-medium border border-orange-100">
                                                                                                            {attributeValueWholesalePrices[attributeItem.id].length} prix de gros configurés
                                                                                                        </div>
                                                                                                        <span className="text-[10px] text-gray-400 italic">Cliquez pour modifier</span>
                                                                                                    </div>
                                                                                                )}
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
            {pendingVariationData && (
                <VariationConfigModal
                    isOpen={isVariationModalOpen}
                    onClose={() => {
                        setIsVariationModalOpen(false);
                        setPendingVariationData(null);
                    }}
                    onConfirm={handleVariationModalConfirm}
                    isWholesale={isWholesale || false}
                    attributeName={attributes.find(attr => attr.id === selectedAttributeId)?.name || 'Attribut'}
                    attributeValue={pendingVariationData.attributeValueName}
                    colorName={pendingVariationData.colorName}
                    colorHex={pendingVariationData.colorHex}
                    initialQuantity={
                        variationFrames
                            .find(f => f.id === pendingVariationData.frameId)
                            ?.sizes.find(s => s.id === pendingVariationData.attributeValueId)
                            ?.quantity || 1
                    }
                    initialPrice={attributeValuePrices[pendingVariationData.attributeValueId] || 0}
                    initialWholesalePrices={attributeValueWholesalePrices[pendingVariationData.attributeValueId]}
                />
            )}
        </div>
    );
};

export default CreateProductPage;