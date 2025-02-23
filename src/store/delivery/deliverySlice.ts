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
      vehicleImage:localStorage.getItem("vehicleImage") || "",
      selectedQuarters: localStorage.getItem("selectedQuarters") || null,
      identity_card_in_front:localStorage.getItem("identity_card_in_front") || null,
      identity_card_with_the_person:localStorage.getItem("identity_card_with_the_person") || null,
      drivers_license:localStorage.getItem("drivers_license")  || null,
      password:localStorage.getItem("password")  || null,
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
        localStorage.setItem("vehicleImage",action.payload.vehicleImage)
        state.vehicleType = action.payload.vehicleType;
        state.vehicleModel = action.payload.vehicleModel;
        state.vehiclePlate = action.payload.vehiclePlate;
        state.vehicleState = action.payload.vehicleState;
        state.vehicleImage=action.payload.vehicleImage
       },
       setDeliveryZone: (state, action) => {
        localStorage.setItem("selectedQuarters", action.payload.selectedQuarters);
        state.selectedQuarters = action.payload.selectedQuarters;
       },

       setDocument:(state,action)=>{
        localStorage.setItem("drivers_license",action.payload.drivers_license)
        localStorage.setItem("identity_card_in_front",action.payload.identity_card_in_front)
        localStorage.setItem("identity_card_with_the_person",action.payload.identity_card_with_the_person)
        state.drivers_license=action.payload.drivers_license
        state.identity_card_in_front=action.payload.identity_card_in_front
        state.identity_card_with_the_person=action.payload.identity_card_with_the_person
       },
       setPassword:(state,action)=>{
        localStorage.setItem("password",action.payload.password)
        state.password=action.payload.password
       },
       clearData:(state)=>{
        localStorage.removeItem("firstNameDelivery")
        localStorage.removeItem("lastNameDelivery")
        localStorage.removeItem("emailDelivery")
        localStorage.removeItem("phoneDelivery")
        localStorage.removeItem("birthDateDelivery")
        localStorage.removeItem("nationalityDelivery")
        localStorage.removeItem("idNumberDelivery")
        localStorage.removeItem("cityDelivery")
        localStorage.removeItem("quarterDelivery")
        localStorage.removeItem("vehicleTypeDelivery")
        localStorage.removeItem("vehicleModelDelivery")
        localStorage.removeItem("vehiclePlateDelivery")
        localStorage.removeItem("vehicleStateDelivery")
        localStorage.removeItem("vehicleImage")
        localStorage.removeItem("selectedQuarters")
        localStorage.removeItem("identity_card_in_front")
        localStorage.removeItem("identity_card_with_the_person")
        localStorage.removeItem("drivers_license")
        localStorage.removeItem("password")
        state.firstName=null
        state.lastName=null
        state.email=null
        state.phone=null
        state.birthDate=null
        state.nationality=null
        state.idNumber=null
        state.city=null
        state.quarter=null
        state.vehicleType=null
        state.vehicleModel=null
        state.vehiclePlate=null
        state.vehicleState=null
        state.vehicleImage=""
        state.selectedQuarters=null
        state.identity_card_in_front=null
        state.identity_card_with_the_person=null
        state.drivers_license=null
        state.password=null
       }
}   
})

export const { setPersonalInfoDelivery, setVehicleInfoDelivery, setDeliveryZone,setDocument,setPassword,clearData} = deliverySlice.actions;
export default deliverySlice;