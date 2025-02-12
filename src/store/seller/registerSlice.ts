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
      storeLogo: localStorage.getItem("storeLogo") || null,
      storeImages: localStorage.getItem("storeImages") || null,
      sellerType: localStorage.getItem("sellerType") || null,
      productType: localStorage.getItem("productType") || null,
      storeTown: localStorage.getItem("storeTown") || null,
      storeQuarter: localStorage.getItem("storeQuarter") || null,
      password: localStorage.getItem("password") || null,
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
        localStorage.setItem("storeDescription", action.payload.storeDescription);
        localStorage.setItem("storeCategories", action.payload.storeCategories);
        localStorage.setItem("storeLogo", action.payload.storeLogo);
        localStorage.setItem("storeImages", action.payload.storeImages);
        state.storeName = action.payload.storeName;
        state.storeDescription = action.payload.storeDescription;
        state.storeCategories = JSON.parse(action.payload.storeCategories);
        state.storeLogo = action.payload.storeLogo;
        state.storeImages = JSON.parse(action.payload.storeImages);
    },
    setSellerType:(state,action)=>{
        localStorage.setItem("sellerType", action.payload.sellerType);
        localStorage.setItem("productType", action.payload.productType);
        state.sellerType = action.payload.sellerType;
        state.productType = action.payload.productType;
    },
    setAddressInfo:(state,action)=>{
        localStorage.setItem("storeTown", action.payload.storeTown);
        localStorage.setItem("storeQuarter", action.payload.storeQuarter);
        state.storeTown = action.payload.storeTown;
        state.storeQuarter = action.payload.storeQuarter;
    },
    setPassword:(state,action)=>{
        localStorage.setItem("password", action.payload.password);
        state.password = action.payload.password;
    }
}   
})

export const { setPersonalInfo, setIdentity, setShopInfo, setSellerType, setAddressInfo, setPassword } = registerSlice.actions;
export default registerSlice;