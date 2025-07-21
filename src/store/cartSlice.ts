import { Product } from "@/types/products";
import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: {
    id: number;
    color: {
      id: number;
      name: string;
      hex: string;
    };
    price?: string;
    attributes?: {
      id: number;
      value: string;
      quantity: number;
      price: string;
    };
  };
}

// Fonctions utilitaires pour les calculs
const getItemPrice = (item: CartItem): number => {
  if (item.selectedVariation) {
    if (item.selectedVariation.attributes?.price) {
      return parseFloat(item.selectedVariation.attributes.price);
    }
    if (item.selectedVariation.price) {
      return parseFloat(item.selectedVariation.price);
    }
  }
  return parseFloat(item.product.product_price);
};

const findCartItem = (cartItems: CartItem[], product: Product, selectedVariation?: any): CartItem | undefined => {
  return cartItems.find(item => {
    if (selectedVariation) {
      // Si la variation a des attributs, comparer par couleur ET valeur d'attribut
      if (selectedVariation.attributes && item.selectedVariation?.attributes) {
        return item.selectedVariation.color.id === selectedVariation.color.id && 
               item.selectedVariation.attributes.value === selectedVariation.attributes.value;
      }
      // Sinon comparer seulement par couleur
      return item.selectedVariation?.color.id === selectedVariation.color.id;
    }
    // Produit sans variation
    return item.product.id === product.id && !item.selectedVariation;
  });
};

const recalculateTotals = (cartItems: CartItem[]): { totalQuantity: number; totalPrice: number } => {
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    const price = getItemPrice(item);
    return total + (price * item.quantity);
  }, 0);
  
  return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: JSON.parse(localStorage.getItem('cartItems')!) as CartItem[] || [],
        totalQuantity: parseInt(localStorage.getItem('totalQuantity')!) || 0,
        totalPrice: parseFloat(localStorage.getItem('totalPrice')!) || 0
    },
    reducers: {
        addItem: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            
            const existingItem = findCartItem(state.cartItems, product, selectedVariation);

            if (existingItem) {
                // Mettre à jour la quantité de l'item existant
                existingItem.quantity += quantity;
            } else {
                // Ajouter un nouvel item
                state.cartItems.push({ 
                    product, 
                    quantity,
                    selectedVariation: selectedVariation || undefined
                });
            }

            // Recalculer les totaux pour éviter les erreurs
            const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
            state.totalQuantity = totalQuantity;
            state.totalPrice = totalPrice;
            
            // Sauvegarder dans localStorage
            localStorage.setItem('totalQuantity', state.totalQuantity.toString());
            localStorage.setItem('totalPrice', state.totalPrice.toFixed(2));
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        removeItem: (state, action) => {
            const { product, selectedVariation } = action.payload;
            
            const itemToRemove = findCartItem(state.cartItems, product, selectedVariation);
           
            if (itemToRemove) {
                // Retirer l'item du panier
                state.cartItems = state.cartItems.filter(cartItem => cartItem !== itemToRemove);

                // Recalculer les totaux
                const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
                state.totalQuantity = totalQuantity;
                state.totalPrice = totalPrice;

                // Sauvegarder dans localStorage
                localStorage.setItem('totalQuantity', state.totalQuantity.toString());
                localStorage.setItem('totalPrice', state.totalPrice.toFixed(2));
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },

        updateQuantity: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            
            const item = findCartItem(state.cartItems, product, selectedVariation);

            if (item) {
                if (quantity <= 0) {
                    // Supprimer l'item si la quantité est 0 ou négative
                    state.cartItems = state.cartItems.filter(cartItem => cartItem !== item);
                } else {
                    // Mettre à jour la quantité
                    item.quantity = quantity;
                }

                // Recalculer les totaux
                const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
                state.totalQuantity = totalQuantity;
                state.totalPrice = totalPrice;

                // Sauvegarder dans localStorage
                localStorage.setItem('totalQuantity', state.totalQuantity.toString());
                localStorage.setItem('totalPrice', state.totalPrice.toFixed(2));
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },

        clearCart: (state) => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalQuantity');
            localStorage.removeItem('totalPrice');
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },

        // Nouvelle action pour synchroniser avec localStorage
        syncWithLocalStorage: (state) => {
            try {
                const storedItems = localStorage.getItem('cartItems');
                const storedQuantity = localStorage.getItem('totalQuantity');
                const storedPrice = localStorage.getItem('totalPrice');

                if (storedItems) {
                    state.cartItems = JSON.parse(storedItems);
                }
                if (storedQuantity) {
                    state.totalQuantity = parseInt(storedQuantity);
                }
                if (storedPrice) {
                    state.totalPrice = parseFloat(storedPrice);
                }

                // Recalculer pour s'assurer de la cohérence
                const { totalQuantity, totalPrice } = recalculateTotals(state.cartItems);
                state.totalQuantity = totalQuantity;
                state.totalPrice = totalPrice;
            } catch (error) {
                console.error('Erreur lors de la synchronisation avec localStorage:', error);
                // En cas d'erreur, réinitialiser
                state.cartItems = [];
                state.totalQuantity = 0;
                state.totalPrice = 0;
            }
        }
    }
});

export const { addItem, removeItem, clearCart, updateQuantity, syncWithLocalStorage } = cartSlice.actions;
export default cartSlice;