import { Product } from "@/types/products";
import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')!) as {item:Product,quantity:number}[] : [] as {item:Product,quantity:number}[]
    },
    reducers:{
        addItem:(state,action)=>{
            const item=state.cartItems.find((item:{item:Product})=>item.item.id===action.payload.id)
            if(item){
                item.quantity+=1
            }else{
                state.cartItems.push({item:action.payload,quantity:1})
            }
        },
        removeItem:(state,action)=>{
            const item=state.cartItems.find((item:{item:Product})=>item.item.id===action.payload.id)
            if(item){
                item.quantity-=1
            }
            if(item?.quantity===0){
                state.cartItems=state.cartItems.filter((item:{item:Product})=>item.item.id!==action.payload.id)
            }
        },
        clearCart:(state)=>{
            state.cartItems=[]
        }
        
    }
})

export const {addItem,removeItem,clearCart}=cartSlice.actions
export default cartSlice.reducer