import { createSlice } from "@reduxjs/toolkit";


const registerSlice=createSlice({
    name:'registerSeller',
    initialState:{
      firstName: localStorage.getItem("firstName") || null,
      lastName: localStorage.getItem("lastName") || null,
      email: localStorage.getItem("email") || null,
      phone: localStorage.getItem("phone") || null,
      birthDate: localStorage.getItem("birthDate") || null,
      nationality: localStorage.getItem("nationality") || null,
      identity_card_in_front: localStorage.getItem("identity_card_in_front") || null,
      identity_card_in_back: localStorage.getItem("identity_card_in_back") || null,
      identity_card_with_the_person: localStorage.getItem("identity_card_with_the_person") || null,
      storeName: localStorage.getItem("storeName") || null,
      storeDescription: localStorage.getItem("storeDescription") || null,
      storeCategories: localStorage.getItem("storeCategories") || null,
      storeCity: localStorage.getItem("storeCity") || null,
      storeState: localStorage.getItem("storeState") || null,
      storeZipCode: localStorage.getItem("storeZipCode") || null,
      storeCountry: localStorage.getItem("storeCountry") || null,
},

    reducers:{
       setPersonalInfo: (state, action) => {
        localStorage.setItem("firstName", action.payload.firstName);
        localStorage.setItem("lastName", action.payload.lastName);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("phone", action.payload.phone);
        localStorage.setItem("birthDate", action.payload.birthDate);
        localStorage.setItem("nationality", action.payload.nationality);
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.phone = action.payload.phone;
        state.birthDate = action.payload.birthDate;
        state.nationality = action.payload.nationality;
       },
       setIdentity:(state,action)=>{
            localStorage.setItem("identity_card_in_front", action.payload.identity_card_in_front);
            localStorage.setItem("identity_card_in_back", action.payload.identity_card_in_back);
            localStorage.setItem("identity_card_with_the_person", action.payload.identity_card_with_the_person);
            state.identity_card_in_front = action.payload.identity_card_in_front;
            state.identity_card_in_back = action.payload.identity_card_in_back;
            state.identity_card_with_the_person = action.payload.identity_card_with_the_person;
       },
       setShopInfo:(state,action)=>{
        localStorage.setItem("storeName", action.payload.storeName);
        localStorage.setItem("zipCode", action.payload.zipCode);
        localStorage.setItem("country", action.payload.country);
        state.storeName = action.payload.storeName;
        state.zipCode = action.payload.zipCode;
        state.country = action.payload.country;
    }
})

export const { setPersonalInfo } = registerSlice.actions;
export default registerSlice;