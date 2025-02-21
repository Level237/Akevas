import { Product } from "@/types/products";
import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:JSON.parse(localStorage.getItem('cartItems')!) as {product:Product,quantity:number}[] || [],
        totalQuantity:parseInt(localStorage.getItem('totalQuantity')!) || 0,
        totalPrice:parseInt(localStorage.getItem('totalPrice')!) || 0
    },
    reducers:{
        addItem:(state,action)=>{
            const item=state.cartItems.find((item:{product:Product})=>item.product.id===action.payload.product.id)
            if(item){
                item.quantity+=action.payload.quantity
            }else{
                state.cartItems.push({product:action.payload.product,quantity:action.payload.quantity})
            }
            
            state.totalQuantity=parseInt(action.payload.quantity) + state.totalQuantity
            state.totalPrice=parseInt(action.payload.product.product_price)*parseInt(action.payload.quantity) + state.totalPrice
            localStorage.setItem('totalQuantity',state.totalQuantity.toString())
            localStorage.setItem('totalPrice',state.totalPrice.toString())
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        removeItem:(state,action)=>{
            const item=state.cartItems.find((item:{product:Product})=>item.product.id===action.payload.id)
            if(item){
                item.quantity-=1
            }
            if(item?.quantity===0){
                state.cartItems=state.cartItems.filter((item:{product:Product})=>item.product.id!==action.payload.id)
            }
            state.totalQuantity=state.totalQuantity-1
            state.totalPrice=state.totalPrice-parseInt(action.payload.product.product_price)
            localStorage.setItem('totalQuantity',state.totalQuantity.toString())
            localStorage.setItem('totalPrice',state.totalPrice.toString())
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        clearCart:(state)=>{
            localStorage.removeItem('cartItems')
            localStorage.removeItem('totalQuantity')
            localStorage.removeItem('totalPrice')
            state.cartItems=[]
            state.totalQuantity=0
            state.totalPrice=0
        }
        
    }
})

export const {addItem,removeItem,clearCart}=cartSlice.actions
export default cartSlice