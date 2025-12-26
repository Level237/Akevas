import React, { useState, useEffect } from 'react';
import { Upload, Plus, X, Save, Loader2, Image } from 'lucide-react';

import { useUpdateProductMutation, useGetEditProductQuery } from '@/services/sellerService';
import { useGetAttributeByCategoryQuery, useGetAttributeValueByGroupQuery, useGetAttributeValuesQuery, useGetCategoryByGenderQuery, useGetParentForCategoriesQuery, useGetSubCategoriesQuery, useGetTownsQuery } from '@/services/guardService';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select';
import { toast } from 'sonner';
import { compressMultipleImages } from '@/lib/imageCompression';
import { skipToken } from '@reduxjs/toolkit/query';
import VariationConfigModal from '@/components/VariationConfigModal';

interface ProductAttribute {
    id: number;
    name: string;
    affectsPrice: boolean;
    values: Array<{
        id: number;
        value: string;
        hex?: string;
        price?: number;
    }>;
}

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
        isWholesale?: boolean;
        wholesalePrices?: {
            min_quantity: number;
            wholesale_price: number;
        }[];
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
    images: (File | string)[]; // Allow File objects or strings (URLs)
    quantity: number;
    price: number;
    isColorOnly?: boolean;
}

const EditProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { url } = useParams<{ url: string }>();
    const [isLoadingProductInput, setIsLoadingProductInput] = useState(true);

    const { data: product, isLoading: isLoadingProduct } = useGetEditProductQuery(url || skipToken);
    

    // Base product fields
    const [name, setName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]); // For new images
    const [featuredImage, setFeaturedImage] = useState<File | string | null>(null); // Can be File or URL
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [gender, setGender] = useState<number>(0);
    const [productType, setProductType] = useState<'simple' | 'variable'>('simple');
    const [isWholesale, setIsWholesale] = useState<boolean | null>(null);
    const [isOnlyWhole, setIsOnlyWhole] = useState<boolean | null>(null);
    const [wholesalePrices, setWholesalePrices] = useState<Array<{
        min_quantity: number;
        wholesale_price: number;
    }>>([{ min_quantity: 10, wholesale_price: 0 }]);

    // Attributes and variations
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [selectedAttributeType, setSelectedAttributeType] = useState<string | null>(null);
    const [globalColorPrice, setGlobalColorPrice] = useState<number>(0);
    const [attributeValuePrices, setAttributeValuePrices] = useState<Record<number, number>>({});
    const [variationFrames, setVariationFrames] = useState<Variation[]>([]);
    const [variations, setVariations] = useState<Variation[]>([]); // This might not be used directly in the UI but for submission
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    console.log(variations)

    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [variationImagesToDelete, setVariationImagesToDelete] = useState<Record<string, number[]>>({});

    // State for VariationConfigModal
    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
    const [pendingVariationData, setPendingVariationData] = useState<{
        frameId: string;
        attributeValueId: number;
        attributeValueName: string;
        colorName: string;
        colorHex: string;
    } | null>(null);
    const [attributeValueWholesalePrices, setAttributeValueWholesalePrices] = useState<Record<number, Array<{ min_quantity: number; wholesale_price: number; }>>>({});
    const [updateProduct, { isLoading: isLoadingUpdateProduct }] = useUpdateProductMutation()
    // Query hooks
    const { data: getAttributes } = useGetAttributeValuesQuery("1"); // Assuming '1' is for colors
    const { data: availableAttributes, isLoading: isLoadingAttributes } = useGetAttributeByCategoryQuery('guard');
    const { data: getAttributeValueByGroup } = useGetAttributeValueByGroupQuery(selectedAttributeId ? selectedAttributeId.toString() : skipToken);
    const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender);
    const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender });
    const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
    const { data: parentForCategories } = useGetParentForCategoriesQuery({ arrayId: selectedCategories });

    useEffect(() => {
        if (product && !isLoadingProduct) {
            setIsLoadingProductInput(true);

            // Set basic fields from ProductEditResource
            setName(product.product_name || '');
            setWhatsappNumber(product.whatsapp_number || '');
            setDescription(product.product_description || '');
            setPrice(product.product_price || '');
            setStock(product.product_quantity || '');
            setIsWholesale(product.isWholeSale === 1 || product.isWholeSale === true);
            setIsOnlyWhole(product.is_only_wholesale === 1 || product.is_only_wholesale === true);

            setCity(product.residence || '');
            // Set wholesale prices if available
            if (product.productWholeSales && product.productWholeSales.length > 0) {
                setWholesalePrices(product.productWholeSales);
            }

            // Determine product type
            const hasVariations = product.variations && product.variations.length > 0;
            setProductType(hasVariations ? 'variable' : 'simple');

            // Set categories
             if (product?.parent_category && product?.parent_category.length > 0) {
        const categoryIds = product?.parent_category.map((cat:any) => cat.id);
        setSelectedCategories(categoryIds);
        console.log(product)
        // Déterminer le genre basé sur les catégories
        if (product?.parent_category.some((cat:any) => cat.category_name.toLowerCase().includes('femme'))) {
          setGender(2);
        } else if (product.parent_category.some((cat:any) => cat.category_name.toLowerCase().includes('homme'))) {
          setGender(1);
        } else if (product.parent_category.some((cat:any) => cat.category_name.toLowerCase().includes('enfant'))) {
          setGender(3);
        } else {
          setGender(4); // Mixte par défaut
        }
      }

      if (product?.child_category && product?.child_category.length > 0) {
        const categoryIds = product.child_category.map((cat:any) => cat.id);
        setSelectedSubCategories(categoryIds);
        
        // Déterminer le genre basé sur les catégories
      }
      

            // Handle existing featured image
            if (product.product_profile) {
                setFeaturedImage(product.product_profile); // Store URL for display
            }

            // Handle existing images
            if (product.product_images && Array.isArray(product.product_images)) {
                // Store existing image URLs, not Files
                const existingImageUrls = product.product_images.map((img: any) => img.path);
                setImages(existingImageUrls);
                // We need a way to reference these existing images for deletion.
                // For now, we'll just store them, and the `imagesToDelete` state will be managed separately.
            }


            // Handle variations for variable products
            if (hasVariations) {
                const firstVariation = product.variations[0];
                const isColorOnly = firstVariation.isColorOnly === true || firstVariation.isColorOnly === 1 || firstVariation.isColorOnly === '1';

                setSelectedAttributeType(isColorOnly ? 'colorOnly' : 'colorAndAttribute');

                // If colorAndAttribute, we need to detect the attribute type from the attributes structure
                // Assuming attributes[0].group tells us the attribute category (e.g., "Adulte")
                if (!isColorOnly && firstVariation.attributes && firstVariation.attributes.length > 0) {
                    const firstAttrGroup = firstVariation.attributes[0].group;
                    // You might need to match this with availableAttributes to get the correct ID
                    // For now, we'll find the attribute ID that matches this group
                    const matchingAttribute = availableAttributes?.find((attr: any) => attr.category_name === firstAttrGroup || attr.attribute_name.includes('Taille'));
                    if (matchingAttribute) {
                        setSelectedAttributeId(matchingAttribute.attribute_id);
                    }
                }

                // Map variations correctly: each variation object = one color variant
                const frames = product.variations.map((variation: any) => {
                    const color = {
                        id: variation.color?.id || 0,
                        name: variation.color?.name || '',
                        hex: variation.color?.hex || ''
                    };

                    // For colorAndAttribute: attributes array contains sizes
                    // For colorOnly: attributes array is empty or not used
                    const sizes = (variation.attributes && Array.isArray(variation.attributes) && variation.attributes.length > 0)
                        ? variation.attributes.map((attr: any) => ({
                            id: attr.id,
                            name: attr.value || attr.label || '', // "M", "S", "XL", etc.
                            quantity: parseInt(attr.quantity) || 0,
                            price: parseFloat(attr.price) || 0,
                            wholesalePrices: attr.wholesale_prices && Array.isArray(attr.wholesale_prices) ? attr.wholesale_prices : []
                        }))
                        : [];

                    // Keep image URLs as strings
                    const images = variation.images && Array.isArray(variation.images)
                        ? variation.images.filter((img: any) => img && typeof img === 'string')
                        : [];

                    return {
                        id: variation.id || `frame-${Date.now()}-${Math.random()}`,
                        productId: product.id,
                        color: color,
                        sizes: sizes, // Map attributes to sizes correctly
                        shoeSizes: [],
                        images: images,
                        quantity: isColorOnly ? (variation.quantity || 0) : 0, // Only use quantity for colorOnly
                        price: isColorOnly ? (variation.price || 0) : 0, // Only use price for colorOnly
                        isColorOnly: isColorOnly
                    };
                });

                setVariationFrames(frames);
                setVariations(product.variations);

                // If colorOnly, set the global color price from first variation
                if (isColorOnly && frames.length > 0) {
                    setGlobalColorPrice(frames[0].price || 0);
                }

                if (!isColorOnly) {
                    const prices: Record<number, number> = {};
                    const wholesalePrices: Record<number, { min_quantity: number; wholesale_price: number }[]> = {};

                    product.variations.forEach((variation: any) => {
                        if (variation.attributes && Array.isArray(variation.attributes)) {
                            variation.attributes.forEach((attr: any) => {
                                // Store price by attribute ID, avoiding duplicates
                                if (attr.id && attr.price !== undefined && !prices[attr.id]) {
                                    prices[attr.id] = parseFloat(attr.price) || 0;
                                }
                                // Store wholesale prices
                                if (attr.id && attr.wholesale_prices && Array.isArray(attr.wholesale_prices) && !wholesalePrices[attr.id]) {
                                     wholesalePrices[attr.id] = attr.wholesale_prices;
                                }
                            });
                        }
                    });
                    setAttributeValuePrices(prices);
                    setAttributeValueWholesalePrices(wholesalePrices);
                }
            }

            setIsLoadingProductInput(false);
        }
    }, [product, isLoadingProduct, availableAttributes]);

    // Initialize attributes like in CreateProductPage
    useEffect(() => {
        const attributesArray = getAttributes?.data || [];

        if (attributesArray && Array.isArray(attributesArray) && attributesArray.length > 0) {
            // Ensure 'Color' attribute is correctly identified and potentially added if not present
            let colorAttribute = attributesArray.find((attr: any) => attr.name === 'Couleur');
            if (!colorAttribute) {
                colorAttribute = { id: 1, name: 'Couleur', affectsPrice: false, values: [] }; // Default ID for color if not found
            }

            setAttributes(prevAttributes => {
                const otherAttributes = prevAttributes.filter(attr => attr.id !== 1); // Filter out existing color attribute
                const newColorAttribute = {
                    ...colorAttribute,
                    values: colorAttribute.values || (attributesArray.find((attr: any) => attr.id === 1)?.values || [])
                };
                return [newColorAttribute, ...otherAttributes];
            });
        }

        // Ensure 'Taille' attribute exists for price impact
        setAttributes(prevAttributes => {
            const existingSizeAttribute = prevAttributes.find(attr => attr.affectsPrice && attr.name === 'Taille');
            if (!existingSizeAttribute) {
                return [
                    ...prevAttributes,
                    {
                        id: 2, // Assuming 2 is a safe ID for Size if not already used
                        name: 'Taille',
                        affectsPrice: true,
                        values: []
                    }
                ];
            } else {
                return prevAttributes.map(attr =>
                    attr.affectsPrice && attr.name === 'Taille'
                        ? { ...attr, name: 'Taille', id: 2 } // Ensure ID is consistent
                        : attr
                );
            }
        });
    }, [getAttributes]);


    // Generate variations when frames change or attributes are selected
    useEffect(() => {
        // Only generate variations if productType is variable and there are frames to process
        if (productType === 'variable' && variationFrames.length > 0) {
            generateVariations();
        } else if (productType === 'variable' && variationFrames.length === 0 && selectedAttributeType) {
             // If product type is variable but no frames exist, and an attribute type is selected,
             // it might mean we need to initialize with a frame.
             if (variationFrames.length === 0) {
                addVariationFrame(); // Add a default frame to start if none exists
             }
        }
        // Dependencies: variationFrames, getAttributes (for color values), attributes, globalColorPrice, attributeValuePrices, selectedAttributeId, getAttributeValueByGroup
        // Need to ensure these are stable or memoized if they cause infinite loops.
    }, [variationFrames, getAttributes, attributes, globalColorPrice, attributeValuePrices, selectedAttributeId, getAttributeValueByGroup, productType, selectedAttributeType]);


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
                        newSizes[existingSizeIndex] = { 
                            ...newSizes[existingSizeIndex], 
                            quantity: data.quantity,
                            price: data.price, // Store price in size as well for reference
                            wholesalePrices: data.wholesalePrices 
                        };
                        return { ...frame, sizes: newSizes };
                    } else {
                        // Add new
                        return { 
                            ...frame, 
                            sizes: [...frame.sizes, { 
                                id: attributeValueId, 
                                name: attributeValueName, 
                                quantity: data.quantity, 
                                price: data.price,
                                wholesalePrices: data.wholesalePrices 
                            }] 
                        };
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

        // Validation logic
        if (!name.trim()) {
            toast.error('Le nom du produit est obligatoire');
            return;
        }

        if (!stock.trim() && productType === 'simple') {
            toast.error('La quantité de stock est obligatoire pour les produits simples');
            return;
        }

        if (!(isWholesale && isOnlyWhole) && (!price || Number(price) <= 0) && productType === 'simple') {
            toast.error('Le prix du produit est obligatoire pour les produits simples');
            return;
        }

        if (!description.trim()) {
            toast.error('La description du produit est obligatoire');
            return;
        }

        if (gender === 0) {
            toast.error('Le genre du produit est obligatoire');
            return;
        }

        if (selectedCategories.length === 0) {
            toast.error('Veuillez sélectionner au moins une catégorie');
            return;
        }

        if (selectedSubCategories.length === 0) {
            toast.error('Veuillez sélectionner au moins une sous-catégorie');
            return;
        }

        if (!whatsappNumber.trim()) {
            toast.error('Le numéro WhatsApp est obligatoire');
            return;
        }

        if (!city) {
            toast.error('La ville est obligatoire');
            return;
        }

        // Additional validation for variable products
        if (productType === 'variable') {
            if (variationFrames.length === 0) {
                toast.error('Veuillez ajouter au moins une variation pour le produit.');
                return;
            }
            if (variationFrames.some(frame => frame.color.id === 0)) {
                toast.error('Chaque variation doit avoir une couleur assignée.');
                return;
            }
            if (selectedAttributeType === 'colorAndAttribute' && selectedAttributeId && !getAttributeValueByGroup) {
                toast.error('Veuillez sélectionner un attribut valide.');
                return;
            }
            if (selectedAttributeType === 'colorAndAttribute' && variationFrames.some(frame => frame.sizes.length === 0 && (selectedAttributeId && getAttributeValueByGroup))) {
                 toast.error('Chaque variation avec attribut doit avoir au moins une valeur d\'attribut assignée.');
                 return;
            }
             if (selectedAttributeType === 'colorAndAttribute' && variationFrames.some(frame => frame.sizes.some(size => size.quantity <= 0))) {
                 toast.error('La quantité pour chaque taille/attribut doit être supérieure à zéro.');
                 return;
             }
            if (selectedAttributeType === 'colorOnly' && variationFrames.some(frame => frame.quantity <= 0)) {
                toast.error('La quantité pour chaque couleur doit être supérieure à zéro.');
                return;
            }
            if (selectedAttributeType === 'colorAndAttribute' && Object.keys(attributeValuePrices).length === 0 && variationFrames.some(frame => frame.sizes.length > 0)) {
                toast.error('Veuillez définir les prix pour chaque attribut.');
                return;
            }
            if (selectedAttributeType === 'colorOnly' && globalColorPrice <= 0) {
                toast.error('Le prix global de la couleur est requis pour les produits variables avec seulement des couleurs.');
                return;
            }
             // Check for variations with no price set when they should have one
            if (selectedAttributeType === 'colorAndAttribute' && variationFrames.some(frame => frame.sizes.some(size => (attributeValuePrices[size.id] === undefined || attributeValuePrices[size.id] <= 0)))) {
                toast.error('Veuillez définir un prix pour chaque attribut.');
                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append('product_name', name);
            formData.append('product_description', description);
            formData.append('product_gender', gender.toString());
            formData.append('whatsapp_number', whatsappNumber);
            formData.append('product_residence', city);
            formData.append('type', productType);
            formData.append('is_wholesale', isWholesale ? '1' : '0');

            if (isOnlyWhole !== null) {
                formData.append('is_only_wholesale', isOnlyWhole ? '1' : '0');
            }

            if (productType === 'simple') {
                formData.append('product_price', price);
                formData.append('product_quantity', stock);
                if (isWholesale) {
                    formData.append('wholesale_prices', JSON.stringify(wholesalePrices));
                }
            }

            if (featuredImage instanceof File) {
                formData.append('product_profile', featuredImage);
            } else if (featuredImage === null) {
                // If featuredImage was cleared, we might need to send a signal to delete it if it existed.
                // This depends on your API. For now, we assume not sending means no change.
            }


            images.forEach(image => formData.append('images[]', image));
            selectedCategories.forEach(category => formData.append('categories[]', category.toString()));
            selectedSubCategories.forEach(subCategory => formData.append('sub_categories[]', subCategory.toString()));

            if (imagesToDelete.length > 0) {
                formData.append('images_to_delete', JSON.stringify(imagesToDelete));
            }

            // Handle variations for variable products
            if (productType === 'variable' && variationFrames.length > 0) {
                // Prepare variations data for API. This structure might need adjustment based on backend expectations.
                const variationsPayload = variationFrames.map(frame => ({
                    id: frame.id.startsWith('frame-') ? null : frame.id, // Send null for new variations, original ID for updates
                    productId: product?.id,
                    color_id: frame.color.id,
                    sizes: frame.sizes.map(size => ({
                        id: size.id === 0 ? null : size.id, // Null for new sizes, original ID for existing
                        quantity: size.quantity,
                        price: attributeValuePrices[size.id] !== undefined ? attributeValuePrices[size.id] : (size.price || 0), // Use attribute price if set, fallback to size price or 0
                        wholesalePrices: attributeValueWholesalePrices[size.id] || size.wholesalePrices || []
                    })),
                    shoeSizes: frame.shoeSizes.map(shoeSize => ({ // Assuming shoeSizes are handled similarly if they exist
                        id: shoeSize.id === 0 ? null : shoeSize.id,
                        quantity: shoeSize.quantity,
                        price: shoeSize.price,
                        wholesalePrices: attributeValueWholesalePrices[shoeSize.id] || shoeSize.wholesalePrices || []
                    })),
                    quantity: selectedAttributeType === 'colorOnly' ? frame.quantity : 0, // Quantity for colorOnly, 0 for colorAndAttribute (handled by sizes)
                    price: selectedAttributeType === 'colorOnly' ? (globalColorPrice > 0 ? globalColorPrice : frame.price) : 0, // Price for colorOnly
                    isColorOnly: selectedAttributeType === 'colorOnly',
                }));

                formData.append('variations', JSON.stringify(variationsPayload));

                // Handle variation images
                 variationFrames.forEach((frame, frameIndex) => {
                    console.log(frameIndex)
                     frame.images.forEach((img, imgIndex) => {
                         if (img instanceof File) {
                            formData.append(`variation_images[${frame.id}][${imgIndex}]`, img);
                         }
                         // If img is a URL, it's assumed to be an existing image and not re-uploaded.
                         // Your API should handle existing image references.
                     });
                 });

                if (Object.keys(variationImagesToDelete).length > 0) {
                    formData.append('variation_images_to_delete', JSON.stringify(variationImagesToDelete));
                }
            } else if (productType === 'simple') {
                // For simple products, the base price and stock are used.
                 formData.append('product_price', price);
                 formData.append('product_quantity', stock);
                 if (isWholesale) {
                     formData.append('wholesale_prices', JSON.stringify(wholesalePrices));
                 }
            }

           const response = await updateProduct(formData);
           console.log(response);
            
            toast.success('Produit mis à jour avec succès', {
                description: "Vos modifications ont été enregistrées",
                duration: 4000,
            });

            navigate('/seller/products');
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour:', error);
            const errorMessage = error.data?.message || "Veuillez vérifier les informations fournies.";
            toast.error('Une erreur est survenue lors de la mise à jour du produit', {
                description: errorMessage,
                duration: 5000,
            });
        }
    };

    // Handler functions (same as CreateProductPage)
    const handleChangeGender = (value: string) => {
        setGender(Number(value));
        // Clear categories when gender changes to avoid invalid selections
        setSelectedCategories([]);
        setSelectedSubCategories([]);
    };

    const handleChangeCategories = (selected: number[]) => {
        setSelectedCategories(selected);
        // Clear subcategories if the parent category is deselected
        setSelectedSubCategories(prev => prev.filter(subCat => selected.includes(subCat)));
    };

    const handleChangeSubCategories = (selected: number[]) => {
        setSelectedSubCategories(selected);
    };

    const handleCityChange = (value: string) => {
        setCity(value);
    };

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const file = e.target.files[0];
                const maxSize = 2 * 1024 * 1024; // 2MB

                let processedFile = file;

                if (file.size > maxSize) {
                    const { compressImage } = await import('@/lib/imageCompression');
                    processedFile = await compressImage(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 0.8,
                        maxSizeMB: 2, // Target size after compression
                    });

                    toast.success("Image compressée avec succès", {
                        description: `Taille réduite de ${(file.size / 1024 / 1024).toFixed(1)}Mo à ${(processedFile.size / 1024 / 1024).toFixed(1)}Mo`,
                        duration: 3000,
                    });
                }

                setFeaturedImage(processedFile); // Store the File object
            } catch (error) {
                console.error('Erreur lors de la compression:', error);
                toast.error("Erreur lors de la compression de l'image");
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
                const maxImages = 6;

                // Count existing image URLs
                const existingImageCount = product?.product_images?.length || 0;

                if (images.length + files.length + existingImageCount > maxImages) {
                    toast.error(`Vous ne pouvez sélectionner que ${maxImages} images au total.`);
                    return;
                }

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
                console.error('Erreur lors de la compression:', error);
                toast.error("Erreur lors de la compression des images");
            }
        }
    };

    const removeImage = (index: number) => {
        const imageToRemove = images[index];

        // If it's a string (URL), it's an existing image
        if (typeof imageToRemove === 'string') {
            // Find the image object in product.product_images to get its ID
            const existingImage = product?.product_images?.find((img: any) => img.path === imageToRemove);
            if (existingImage) {
                setImagesToDelete(prev => [...prev, existingImage.id]);
            }
        }

        setImages(images.filter((_, i) => i !== index));
    };

    //
    

    const addWholesalePrice = () => {
        setWholesalePrices(prev => [...prev, { min_quantity: 0, wholesale_price: 0 }]);
    };

    const removeWholesalePrice = (index: number) => {
        if (wholesalePrices.length > 1) {
            setWholesalePrices(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleVariationImageUpload = async (frameId: string, files: FileList) => {
        try {
            const maxImagesPerVariation = 3;
            const currentFrame = variationFrames.find(frame => frame.id === frameId);
            const currentImages = currentFrame?.images || [];

            const existingImageCount = currentImages.filter(img => typeof img === 'string').length;

            if (currentImages.filter(img => img instanceof File).length + files.length + existingImageCount > maxImagesPerVariation) {
                toast.error(`Vous ne pouvez sélectionner que ${maxImagesPerVariation} images par variation.`);
                return;
            }

            const compressedFiles = await compressMultipleImages(files, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.8,
                maxSizeMB: 2,
            });

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
            toast.error("Erreur lors de la compression");
        }
    };

    const removeVariationImage = (frameId: string, imageIndex: number) => {
        setVariationFrames(variationFrames.map(frame =>
            frame.id === frameId
                ? { ...frame, images: frame.images.filter((_, idx) => idx !== imageIndex) }
                : frame
        ));
    };

    const removeExistingVariationImage = (frameId: string, imageUrl: string) => {
        // Track which existing images should be deleted
        setVariationImagesToDelete(prev => {
            const frameImages = prev[frameId] || [];
            // We'll store the image URL for reference, but in practice you may need the image ID from your backend
            // Simple hashCode for demonstration, actual implementation might require stable IDs.
            const hashCode = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return {
                ...prev,
                [frameId]: [...frameImages, hashCode(imageUrl)] // Simple hash for tracking
            };
        });

        // Remove from the frame images display
        setVariationFrames(variationFrames.map(frame =>
            frame.id === frameId
                ? { ...frame, images: frame.images.filter(img => img !== imageUrl) }
                : frame
        ));
    };




    const removeAttributeValueFromVariation = (frameId: string, attributeValueId: number) => {
        setVariationFrames(prevFrames =>
            prevFrames.map(frame =>
                frame.id === frameId
                    ? { ...frame, sizes: frame.sizes.filter(size => size.id !== attributeValueId) }
                    : frame
            )
        );
        // Also remove the price associated with this attribute value if it exists
        setAttributeValuePrices(prev => {
            const newState = { ...prev };
            delete newState[attributeValueId];
            return newState;
        });
    };

    const addVariationFrame = () => {
        // Ensure we only add if not colorOnly or if colorOnly and there are no frames yet
        if (selectedAttributeType === 'colorOnly' && variationFrames.length > 0) {
            toast.error("Vous ne pouvez ajouter qu'une seule variation pour les produits de type 'Couleur uniquement'.");
            return;
        }

        setVariationFrames(prevFrames => [
            ...prevFrames,
            {
                id: `frame-${Date.now()}-${Math.random()}`, // Unique ID for the frame
                productId: product?.id || '',
                color: { id: 0, name: '', hex: '' },
                sizes: [],
                shoeSizes: [], // Initialize empty
                images: [],
                quantity: 0, // Default quantity if color only
                price: 0, // Default price if color only
                isColorOnly: selectedAttributeType === 'colorOnly'
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
        // When removing a frame, also clean up related prices if they are frame-specific.
        // For color-only, globalColorPrice is used. For colorAndAttribute, prices are tied to attributeValueId.
        // The `generateVariations` and `handleSubmit` will handle the final structure.
    };

    const generateVariations = () => {
        // This function should create the `variations` array based on `variationFrames` and selected attributes/colors.
        // It needs to handle different `selectedAttributeType` scenarios.

        const newVariations: Variation[] = [];

        variationFrames.forEach(frame => {
            const color = frame.color;
            if (!color || color.id === 0) return; // Skip if no color selected

            if (selectedAttributeType === 'colorOnly') {
                newVariations.push({
                    id: frame.id, // Use frame ID for easier mapping
                    productId: product?.id || '',
                    color: color,
                    sizes: [],
                    shoeSizes: [],
                    images: frame.images, // Use frame images for this variation
                    quantity: frame.quantity || 0,
                    price: globalColorPrice > 0 ? globalColorPrice : (frame.price || 0), // Use global price or frame price
                    isColorOnly: true
                });
            } else if (selectedAttributeType === 'colorAndAttribute' && frame.sizes.length > 0) {
                frame.sizes.forEach(size => {
                    const sizePrice = attributeValuePrices[size.id] !== undefined ? attributeValuePrices[size.id] : 0; // Use configured price, default to 0
                    newVariations.push({
                        id: `${frame.id}-${size.id}`, // Unique ID for variation, linking frame and size
                        productId: product?.id || '',
                        color: color,
                        sizes: [size], // Include this specific size
                        shoeSizes: [], // Assuming size refers to 'Taille' which might not be shoe size
                        images: frame.images, // Use frame images for this variation
                        quantity: size.quantity,
                        price: sizePrice,
                        isColorOnly: false
                    });
                });
            } else if (selectedAttributeType === 'colorAndAttribute' && frame.sizes.length === 0) {
                // If colorAndAttribute but no sizes selected for this frame, create a variation with just color
                 newVariations.push({
                     id: frame.id, // Use frame ID
                     productId: product?.id || '',
                     color: color,
                     sizes: [],
                     shoeSizes: [],
                     images: frame.images,
                     quantity: frame.quantity || 0, // Fallback quantity if no sizes
                     price: frame.price || 0, // Fallback price if no specific size price is set
                     isColorOnly: false
                 });
            }
        });

        setVariations(newVariations);
    };


    const getUniqueAttributeValues = () => {
        const attributeValueIds = new Set<number>();
        if (selectedAttributeType === 'colorAndAttribute' && selectedAttributeId && getAttributeValueByGroup) {
            variationFrames.forEach(frame => {
                frame.sizes.forEach(size => {
                    // Ensure the size is actually part of the selected attribute group
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

    const updateAttributeValuePrice = (attributeValueId: number, price: number) => {
        setAttributeValuePrices(prevPrices => ({
            ...prevPrices,
            [attributeValueId]: price
        }));
    };

    // Show loading state while fetching product data
    if (isLoadingProduct || isLoadingProductInput) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ed7e0f]" />
                    <p className="text-gray-600">Chargement du produit...</p>
                </div>
            </div>
        );
    }

    const attributesArray = getAttributes?.data || []; // All color attributes

    return (
        <div className="min-h-screen max-w-[1440px] mx-auto bg-gray-50 max-sm:pb-16">
            <form onSubmit={handleSubmit} className='' encType='multipart/form-data'>
                {/* Header */}
                <header className="sticky top-16 px-24 max-sm:px-0 z-30 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="hidden md:flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                                    {productType === 'simple' ? 'Modifier un produit simple' : 'Modifier un produit variable'}
                                    {isWholesale && (
                                        <span className="ml-3 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-full">
                                            📦 Vente en gros
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Modifiez les informations de votre produit
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
                                    
                                        
                                            <Save className="w-4 h-4" />
                                            {isLoadingUpdateProduct ? (
                                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                                ) : <span className='max-sm:text-sm'>Mettre à jour</span>}
                                    
                                </button>
                            </div>
                        </div>

                        {/* Mobile version */}
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
                                <h1 className="text-xl font-bold bg-gradient-to-r from-[#6e0a13] to-orange-600 bg-clip-text text-transparent">
                                    Modifier produit
                                </h1>
                                <button
                                    type="submit"
                                    className="p-2 bg-[#6e0a13] to-orange-600 text-white rounded-xl"
                                >
                                   
                                       
                                    <span className='text-sm'>Mettre à jour</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl pl-24 max-sm:px-4 px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Basic info */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 text-2xl font-medium border-0 border-b focus:ring-0 focus:border-[#ed7e0f]"
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
                                                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                                                placeholder="Prix (FCFA)"
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
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
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
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Ex: 5000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

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
                            {/* Categories */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-4">Genre produit</label>
                                    <Select name='gender' value={gender.toString()} onValueChange={handleChangeGender}>
                                        <SelectTrigger className="bg-gray-50 border-0">
                                            <SelectValue placeholder="Choisir un genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Aucun</SelectItem>
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
                                                    selected={parentForCategories?.map((category: { id: number, name: string }) => category.id) || []}
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
                                                        options={subCategoriesByGender?.categories || []}
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

                            {/* Contact info */}
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
                                        <Select name='city' value={city} onValueChange={handleCityChange}>
                                            <SelectTrigger className="bg-gray-50 border-0">
                                                <SelectValue placeholder="Sélectionnez votre ville de livraison" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {townsLoading ? (
                                                    <SelectItem value="loading">Chargement des villes...</SelectItem>
                                                ) : (
                                                    towns?.towns.map((town: { id: string, town_name: string }) => (
                                                        <SelectItem key={town.id} value={town.town_name}>
                                                            {town.town_name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Wholesale section */}
                          
                        </div>

                        {/* Side column */}
                        <div className="space-y-6">
                            {productType === 'simple' ? (
                                <>
                                    <div className="bg-white rounded-2xl shadow-sm p-6">
                                        <h2 className="text-lg font-semibold mb-4">Photo mise en avant</h2>
                                        <div className="aspect-square w-64 max-sm:w-44 h-64 max-sm:h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                                            {featuredImage instanceof File ? ( // Display newly uploaded file
                                                <div className="relative group h-64">
                                                    <img
                                                       src={featuredImage instanceof File || featuredImage as Blob instanceof Blob 
                                                            ? URL.createObjectURL(featuredImage) 
                                                            : ""
                                                        } 

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
                                            ) : typeof featuredImage === 'string' ? ( // Display existing image URL
                                                <div className="relative group h-64">
                                                    <img
                                                        src={featuredImage || "/placeholder.svg"}
                                                        alt="Existing featured product"
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
                                            ) : ( // Placeholder if no image is set
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

                                    <div className="bg-white rounded-2xl shadow-sm p-6">
                                        <h2 className="text-lg font-semibold mb-4">Galerie d'images</h2>
                                        <div className="grid grid-cols-3 gap-4">
                                            {images.map((image, index) => { // Display newly uploaded images
                                                // This mapping assumes 'images' contains only new files.
                                                // If it also contains existing images (e.g., after initial load), this needs adjustment.
                                                return (
                                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                                                        <img
                                                            src={image instanceof File || image as Blob instanceof Blob 
                                                            ? URL.createObjectURL(image) 
                                                            : ""}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)} // This removeImage needs to correctly handle both new and existing
                                                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {product?.product_images
                                                && product.product_images
                                                    .filter((img: any) => !imagesToDelete.includes(img.id))
                                                    .map((img: any, index: number) => (
                                                      <div key={`existing-${index}`} className="relative group aspect-square rounded-xl overflow-hidden">
                                                        <img
                                                          src={img.path || "/placeholder.svg"}
                                                          alt={`Existing ${index + 1}`}
                                                          className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                          <button
                                                            type="button"
                                                            onClick={() => setImagesToDelete([...imagesToDelete, img.id])}
                                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                          >
                                                            <X className="w-4 h-4 text-red-500" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ))
                                            }


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
                                                <h2 className="text-lg max-sm:text-sm font-semibold text-gray-900">Attributs du produit</h2>
                                                <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Configurez les variations de votre produit</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1.5 max-sm:text-xs text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                                    onClick={() => {
                                                        // Resetting these states would require careful consideration of side effects
                                                        // For now, let's focus on the core functionality.
                                                        // Consider if resetting attributes and variations is always desired.
                                                        // setAttributes([]); // May not be desirable to clear existing attributes if they are fetched
                                                        // setVariations([]); // Clearing variations might be okay
                                                        setVariationFrames([]); // Clearing frames is definitely needed for a reset
                                                        setSelectedAttributeId(null);
                                                        setSelectedAttributeType(null);
                                                        setAttributeValuePrices({});
                                                        setGlobalColorPrice(0);
                                                        addVariationFrame(); // Add a default frame to start
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
                                                        // Filter out attributes that affect price (like Size) if switching to colorOnly
                                                        setAttributes(prev => prev.filter(attr => attr.id === 1 || !attr.affectsPrice)); // Keep color, remove price-affecting ones
                                                        setVariations([]); // Clear existing generated variations
                                                        setVariationFrames([]); // Clear existing frames
                                                        addVariationFrame(); // Start with a new frame
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
                                                        setVariations([]); // Clear existing generated variations
                                                        setVariationFrames([]); // Clear existing frames
                                                        addVariationFrame(); // Start with a new frame
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
                                                    {!isLoadingAttributes && availableAttributes?.map((attr: any) => {
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
                                                                                    ...prev.filter(a => a.id === 1 || !a.affectsPrice), // Keep color (id 1) and non-price attributes
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
                                                                    
                                                                    setVariations([]);
                                                                    setVariationFrames([]);
                                                                    addVariationFrame();
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
                                                            {/* Couleur et Attribut */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Sélection de la couleur */}
                                                                <div>
                                                                    <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Couleur</label>
                                                                    <Select
                                                                        value={frame.color?.id.toString()}
                                                                        onValueChange={(value) => {
                                                                            const selectedColorId = Number(value);
                                                                            const selectedColor = attributesArray.find((attr:any) => attr.id === 1)?.values.find((c: any) => c.id === selectedColorId);
                                                                            if (selectedColor) {
                                                                                updateVariationFrame(frame.id, { color: { id: selectedColor.id, name: selectedColor.value, hex: selectedColor.hex_color } });
                                                                            } else if (selectedColorId === 0) { // Option to clear color
                                                                                 updateVariationFrame(frame.id, { color: { id: 0, name: '', hex: '' } });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="bg-gray-50">
                                                                            <SelectValue placeholder="Choisir une couleur" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="0">Aucune couleur</SelectItem>
                                                                            {/* Use attributesArray here */}
                                                                            {attributesArray.find((attr:any) => attr.id === 1)?.values
                                                                                // Filter out colors already used in other frames to avoid duplicates, unless it's the only option left
                                                                                .filter((color: any) => color.id !== 0 && (
                                                                                    frame.color.id === color.id ||
                                                                                    !variationFrames.some(f => f.color.id === color.id && f.id !== frame.id)
                                                                                ))
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

                                                                {/* Quantity and Price for Color Only */}
                                                                {selectedAttributeType === 'colorOnly' && frame.color.id !== 0 && (
                                                                    <>
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
                                                                        {/* Price for colorOnly will be handled in the dedicated Price section */}
                                                                    </>
                                                                )}


                                                                {/* Attribute Selection for ColorAndAttribute */}
                                                                {(selectedAttributeType === 'colorAndAttribute' && selectedAttributeId && getAttributeValueByGroup) && (
                                                                    <div>
                                                                        <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Attribut</label>
                                                                        <div className="space-y-3">
                                                                            <Select
                                                                                onValueChange={(value) => {
                                                                                    const selectedValueId = Number(value);
                                                                                    let selectedValue: any;

                                                                                    getAttributeValueByGroup?.some((group: any) => {
                                                                                        const found = group.values.find((val: any) => val.id === selectedValueId);
                                                                                        if (found) {
                                                                                            selectedValue = found;
                                                                                            return true; // Exit loop once found
                                                                                        }
                                                                                        return false;
                                                                                    });

                                                                                    if (selectedValue) {
                                                                                        setPendingVariationData({
                                                                                            frameId: frame.id,
                                                                                            attributeValueId: selectedValueId,
                                                                                            attributeValueName: selectedValue.value,
                                                                                            colorName: frame.color.name,
                                                                                            colorHex: frame.color.hex
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
                                                                                        const availableValues = group.values.filter((value: any) =>
                                                                                            !frame.sizes.some((size: any) => size.id === value.id)
                                                                                        );

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

                                                                            {/* Display added sizes/attributes */}
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {frame.sizes.map((size) => {
                                                                                    const attributeGroup = getAttributeValueByGroup?.find((group: any) =>
                                                                                        group.values.some((val: any) => val.id === size.id)
                                                                                    );
                                                                                    const sizeData = attributeGroup?.values.find((val: any) => val.id === size.id);
                                                                                    return (
                                                                                        <div key={size.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setPendingVariationData({
                                                                                                        frameId: frame.id,
                                                                                                        attributeValueId: size.id,
                                                                                                        attributeValueName: size.name,
                                                                                                        colorName: frame.color.name,
                                                                                                        colorHex: frame.color.hex
                                                                                                    });
                                                                                                    setIsVariationModalOpen(true);
                                                                                                }}
                                                                                                className="text-sm hover:text-[#ed7e0f] transition-colors"
                                                                                            >
                                                                                                {sizeData?.value || size.name} (Qté: {size.quantity})
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => removeAttributeValueFromVariation(frame.id, size.id)}
                                                                                                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
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
                                                                    {/* Update the image display section to allow deletion of existing variation images */}
                                                                    {frame.images.map((image, idx) => {
                                                                        if (typeof image === 'string') { // Existing image URL
                                                                            return (
                                                                                <div key={idx} className="relative group aspect-square">
                                                                                    <img
                                                                                        src={image || "/placeholder.svg"}
                                                                                        alt={`Variation ${idx + 1}`}
                                                                                        className="w-16 h-16 object-cover rounded-xl"
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeExistingVariationImage(frame.id, image)}
                                                                                        className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-50"
                                                                                    >
                                                                                        <X className="w-4 h-4 text-red-500" />
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        } else { // Newly uploaded File object
                                                                            return (
                                                                                <div key={idx} className="relative group aspect-square">
                                                                                    <img
                                                                                        src={image instanceof File || image as Blob instanceof Blob 
                                                                                        ? URL.createObjectURL(image) 
                                                                                        : ""
                                                                                        } 
                                                                                        alt={`Variation ${idx + 1}`}
                                                                                        className="w-16 h-16 object-cover rounded-xl"
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeVariationImage(frame.id, idx)}
                                                                                        className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-50"
                                                                                    >
                                                                                        <X className="w-4 h-4 text-red-500" />
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    })}
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
                                                    disabled={selectedAttributeType === 'colorOnly' && variationFrames.length > 0}
                                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedAttributeType === 'colorOnly' && variationFrames.length > 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-[#ed7e0f] bg-[#ed7e0f]/10 hover:bg-[#ed7e0f]/20'}`}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Ajouter une variation
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Section des prix */}
                                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                                        <h3 className="text-lg max-sm:text-sm font-semibold text-gray-900 mb-4">Prix des variations</h3>

                                        {/* Global Price for Color Only products */}
                                        {selectedAttributeType === 'colorOnly' && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Prix global pour toutes les couleurs</h4>
                                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                                    <input
                                                        type="number"
                                                        value={globalColorPrice || ''}
                                                        onChange={(e) => setGlobalColorPrice(Number(e.target.value))}
                                                        placeholder="Prix global (FCFA)"
                                                        className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Individual Attribute Prices for ColorAndAttribute */}
                                        {(selectedAttributeType === 'colorAndAttribute' && getUniqueAttributeValues().length > 0) && (
                                            <div className="mb-6">
                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                    {getUniqueAttributeValues().map(attributeValueId => {
                                                        let attributeValueData: any;
                                                        getAttributeValueByGroup?.some((group: any) => {
                                                            const found = group.values.find((val: any) => val.id === attributeValueId);
                                                            if (found) {
                                                                attributeValueData = found;
                                                                return true;
                                                            }
                                                            return false;
                                                        });

                                                        // Find the corresponding attribute name
                                                        const attributeName = attributes.find(attr => attr.id === selectedAttributeId)?.name || 'Attribut';

                                                        return (
                                                            <div key={attributeValueId} className="flex flex-col items-start gap-3 bg-gray-50 p-3 rounded-xl">
                                                                <div>
                                                                    <span className="font-medium text-[#6e0a13]">{attributeName}:</span> <span>{attributeValueData?.value} {attributeValueData?.label}</span>
                                                                </div>

                                                                <input
                                                                    type="number"
                                                                    value={attributeValuePrices[attributeValueId] || ''}
                                                                    onChange={(e) => updateAttributeValuePrice(attributeValueId, Number(e.target.value))}
                                                                    placeholder="Prix (FCFA)"
                                                                    className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ed7e0f]"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* List of generated variations for preview */}
                                    {variationFrames.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des variations générées</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {variationFrames.map((frame) => {
                                                    // Find color data for display
                                                    const color = attributesArray.find((attr:any) => attr.id === 1)?.values.find((c: any) => c.id === frame.color.id);

                                                    // Find attribute name for display
                                                    const attributeName = attributes.find(attr => attr.id === selectedAttributeId)?.name || 'Attribut';

                                                    return (
                                                        <div key={frame.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                            <div className="flex items-center gap-4">
                                                                {frame.images.length > 0 ? (
                                                                    <div className="relative w-20 h-20 flex-shrink-0">
                                                                        <img
                                                                            src={typeof frame.images[0] === 'string' ? frame.images[0] : URL.createObjectURL(frame.images[0] as File)}
                                                                            alt="Variation"
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                        />
                                                                        {frame.images.filter(img => typeof img === 'string').length + frame.images.filter(img => img instanceof File).length > 1 && (
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
                                                                    {/* Display Color */}
                                                                    {frame.color.id !== 0 && color && (
                                                                        <div className='mb-3'>
                                                                            <div className='flex items-center gap-2'>
                                                                                <div
                                                                                    className="w-5 h-5 rounded-full border border-gray-200"
                                                                                    style={{ backgroundColor: color.hex_color }}
                                                                                />
                                                                                <span className="text-base text-sm font-medium">{color.value}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Display Price and Quantity */}
                                                                    {selectedAttributeType === 'colorOnly' && frame.color.id !== 0 && (
                                                                        <>
                                                                            <div className="flex justify-between items-center">
                                                                                <span className='text-sm'>Prix :</span>
                                                                                <span className="text-sm font-medium text-[#ed7e0f] ml-auto">
                                                                                    {globalColorPrice > 0 ? `${globalColorPrice} FCFA` : 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between items-center mt-1">
                                                                                <span className="text-xs text-gray-500">Quantité:</span>
                                                                                <span className="text-xs font-medium">{frame.quantity}</span>
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {/* Update the variation preview to display sizes/attributes more clearly */}
                                                                    {selectedAttributeType === 'colorAndAttribute' && frame.sizes.length > 0 && (
                                                                        <div className="flex flex-col gap-2">
                                                                            {frame.sizes.map(attributeItem => {
                                                                                let attributeValueData: any;
                                                                                getAttributeValueByGroup?.some((group: any) => {
                                                                                    const found = group.values.find((val: any) => val.id === attributeItem.id);
                                                                                    if (found) {
                                                                                        attributeValueData = found;
                                                                                        return true;
                                                                                    }
                                                                                    return false;
                                                                                });
                                                                                const price = attributeValuePrices[attributeItem.id] || 0;

                                                                                return (
                                                                                    <div key={attributeItem.id}
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
                                                                                    
                                                                                    className="bg-gray-50 cursor-pointer rounded-lg p-2 border border-gray-200">
                                                                                        <div className="text-sm font-medium text-gray-900">
                                                                                            <span className="text-[#ed7e0f]">{attributeName}:</span> {attributeValueData?.value || attributeItem.name}{attributeValueData?.label ? ` (${attributeValueData.label})` : ''}
                                                                                        </div>
                                                                                        <div className="flex justify-between items-center mt-1 gap-2">
                                                                                            <span className="text-xs text-gray-500">Qté: <span className="font-medium">{attributeItem.quantity}</span></span>
                                                                                            <span className="text-xs font-medium text-[#ed7e0f]">{price > 0 ? `${price} FCFA` : 'À définir'}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="button"
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
            {/* Variation Configuration Modal */}
            {pendingVariationData && (
                <VariationConfigModal
                    isOpen={isVariationModalOpen}
                    onClose={() => {
                        setIsVariationModalOpen(false);
                        setPendingVariationData(null);
                    }}
                    onConfirm={handleVariationModalConfirm}
                    isWholesale={isWholesale || false}
                    attributeName={selectedAttributeType === 'colorAndAttribute' ? 'Taille' : 'Couleur'} // Or dynamic attribute name
                    attributeValue={pendingVariationData.attributeValueName}
                    colorName={pendingVariationData.colorName}
                    colorHex={pendingVariationData.colorHex}
                    initialQuantity={
                        variationFrames
                            .find(f => f.id === pendingVariationData.frameId)
                            ?.sizes.find(s => s.id === pendingVariationData.attributeValueId)?.quantity
                    }
                    initialPrice={
                        attributeValuePrices[pendingVariationData.attributeValueId]
                    }
                    initialWholesalePrices={
                        attributeValueWholesalePrices[pendingVariationData.attributeValueId]
                    }
                />
            )}
        </div>
    );
};

export default EditProductPage;