import { createSlice } from "@reduxjs/toolkit";


const categorySlice=createSlice({
    name:'category',
    initialState:{
        loadedCategoriesChildren:localStorage.getItem("categories")  || "",
    activateCategories:[]
    },
    reducers:{
        setCategoriesChildren:(state,action)=>{
            state.loadedCategoriesChildren=JSON.stringify(action.payload.loadedCategoriesChildren)
            localStorage.setItem("loadedCategoriesChildren",JSON.stringify(action.payload.loadedCategoriesChildren))
        },
        setCategoriesActive:(state,action)=>{
            

            state.activateCategories=action.payload.activateCategories;
        }
    }
})

export const {setCategoriesChildren,setCategoriesActive}=categorySlice.actions
export default categorySlice;