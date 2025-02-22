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
      vehicleType: localStorage.getItem("vehicleTypeDelivery") || null,
      vehicleModel: localStorage.getItem("vehicleModelDelivery") || null,
      vehiclePlate: localStorage.getItem("vehiclePlateDelivery") || null,
      vehicleState: localStorage.getItem("vehicleStateDelivery") || null,
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
       setVehicleInfoDelivery: (state, action) => {
        localStorage.setItem("vehicleTypeDelivery", action.payload.vehicleType);
        localStorage.setItem("vehicleModelDelivery", action.payload.vehicleModel);
        localStorage.setItem("vehiclePlateDelivery", action.payload.vehiclePlate);
        localStorage.setItem("vehicleStateDelivery", action.payload.vehicleState);
        state.vehicleType = action.payload.vehicleType;
        state.vehicleModel = action.payload.vehicleModel;
        state.vehiclePlate = action.payload.vehiclePlate;
        state.vehicleState = action.payload.vehicleState;
       },
       
}   
})

export const { setPersonalInfoDelivery, setVehicleInfoDelivery} = deliverySlice.actions;
export default deliverySlice;