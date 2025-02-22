import { createSlice } from "@reduxjs/toolkit";


const deliverySlice=createSlice({
    name:'registerDelivery',
    initialState:{
      firstName: localStorage.getItem("firstNameDelivery") || null,
      lastName: localStorage.getItem("lastNameDelivery") || null,
      email: localStorage.getItem("emailDelivery") || null,
      phone: localStorage.getItem("phoneDelivery") || null,
      birthDate: localStorage.getItem("birthDateDelivery") || null,
      nationality: localStorage.getItem("nationalityDelivery") || null,
      idNumber: localStorage.getItem("idNumberDelivery") || null,
      city: localStorage.getItem("cityDelivery") || null,
      quarter: localStorage.getItem("quarterDelivery") || null,
},

    reducers:{
       setPersonalInfoDelivery: (state, action) => {
        localStorage.setItem("firstNameDelivery", action.payload.firstName);
        localStorage.setItem("lastNameDelivery", action.payload.lastName);
        localStorage.setItem("emailDelivery", action.payload.email);
        localStorage.setItem("phoneDelivery", action.payload.phone);
        localStorage.setItem("birthDateDelivery", action.payload.birthDate);
        localStorage.setItem("nationalityDelivery", action.payload.nationality);
        localStorage.setItem("idNumberDelivery", action.payload.idNumber);
        localStorage.setItem("cityDelivery", action.payload.city);
        localStorage.setItem("quarterDelivery", action.payload.quarter);
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.phone = action.payload.phone;
        state.birthDate = action.payload.birthDate;
        state.nationality = action.payload.nationality;
        state.idNumber = action.payload.idNumber;
        state.city = action.payload.city;
        state.quarter = action.payload.quarter;
       },
       
}   
})

export const { setPersonalInfoDelivery} = deliverySlice.actions;
export default deliverySlice;