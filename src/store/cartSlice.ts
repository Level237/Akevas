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
    attributes?: Array<{
      id: number;
      value: string;
      quantity: number;
      price: string;
    }>;
  };
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: JSON.parse(localStorage.getItem('cartItems')!) as CartItem[] || [],
        totalQuantity: parseInt(localStorage.getItem('totalQuantity')!) || 0,
        totalPrice: parseInt(localStorage.getItem('totalPrice')!) || 0
    },
    reducers: {
        addItem: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            
            // Créer une clé unique basée sur le produit et la couleur
            const itemKey = selectedVariation 
                ? `${product.id}-${selectedVariation.color.id}`
                : product.id;

            const item = state.cartItems.find(item => {
                if (selectedVariation) {
                    return item.selectedVariation?.color.id === selectedVariation.color.id;
                }
                return item.product.id === product.id && !item.selectedVariation;
            });

            if (item) {
                item.quantity += quantity;
            } else {
                state.cartItems.push({ 
                    product, 
                    quantity,
                    selectedVariation: selectedVariation || undefined
                });
            }

            // Calculer le prix en fonction de la variation si elle existe
            const itemPrice = selectedVariation 
                ? (selectedVariation.attributes?.[0]?.price || product.product_price)
                : product.product_price;

            state.totalQuantity += quantity;
            state.totalPrice += parseFloat(itemPrice) * quantity;

            localStorage.setItem('totalQuantity', state.totalQuantity.toString());
            localStorage.setItem('totalPrice', state.totalPrice.toString());
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        removeItem: (state, action) => {
            const { product, selectedVariation } = action.payload;
            console.log(product)
            const item = state.cartItems.find(item => {
                if (selectedVariation) {
                    
                    return item.selectedVariation?.color.id === selectedVariation.color.id;
                }
                return item.product.id === product.id && !item.selectedVariation;
            });
           
            if (item) {
                item.quantity -= 1;
                
                if (item.quantity === 0) {
                    state.cartItems = state.cartItems.filter(cartItem => cartItem !== item);
                }

                const itemPrice = selectedVariation 
                    ? (selectedVariation.attributes?.[0]?.price || product.product_price)
                    : product.product_price;

                state.totalQuantity -= 1;
                state.totalPrice -= parseFloat(itemPrice);

                localStorage.setItem('totalQuantity', state.totalQuantity.toString());
                localStorage.setItem('totalPrice', state.totalPrice.toString());
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },

        updateQuantity: (state, action) => {
            const { product, quantity, selectedVariation } = action.payload;
            
            const item = state.cartItems.find(item => {
                if (selectedVariation) {
                    return item.selectedVariation?.color.id === selectedVariation.color.id;
                }
                return item.product.id === product.id && !item.selectedVariation;
            });

            if (item) {
                const itemPrice = selectedVariation 
                    ? (selectedVariation.attributes?.[0]?.price || product.product_price)
                    : product.product_price;

                item.quantity = quantity;

                if (item.quantity <= 0) {
                    state.cartItems = state.cartItems.filter(cartItem => cartItem !== item);
                }

                state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0);
                state.totalPrice = state.cartItems.reduce((total, item) => {
                    const price = item.selectedVariation 
                        ? (item.selectedVariation.attributes?.[0]?.price || item.product.product_price)
                        : item.product.product_price;
                    return total + parseFloat(price) * item.quantity;
                }, 0);

                localStorage.setItem('totalQuantity', state.totalQuantity.toString());
                localStorage.setItem('totalPrice', state.totalPrice.toString());
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
        }
    }
});

export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice;