import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/types/products';

interface CategoryState {
    categories: {
        [key: number]: Category[];
    };
    currentGenderId: number;
}

const initialState: CategoryState = {
    categories: {},
    currentGenderId: 1
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<{ genderId: number; categories: Category[] }>) => {
            const { genderId, categories } = action.payload;
            state.categories[genderId] = categories;
        },
        setCurrentGenderId: (state, action: PayloadAction<number>) => {
            state.currentGenderId = action.payload;
        }
    }
});

export const { setCategories, setCurrentGenderId } = categorySlice.actions;
export default categorySlice; 