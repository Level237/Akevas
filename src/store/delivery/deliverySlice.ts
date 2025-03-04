import { createSlice } from "@reduxjs/toolkit";


const deliverySlice = createSlice({
  name: 'registerDelivery',
  initialState: {
    firstName: sessionStorage.getItem("firstNameDelivery") || null,
    lastName: sessionStorage.getItem("lastNameDelivery") || null,
    email: sessionStorage.getItem("emailDelivery") || null,
    phone: sessionStorage.getItem("phoneDelivery") || null,
    birthDate: sessionStorage.getItem("birthDateDelivery") || null,
    nationality: sessionStorage.getItem("nationalityDelivery") || null,
    city: sessionStorage.getItem("cityDelivery") || null,
    quarter: sessionStorage.getItem("quarterDelivery") || null,
    vehicleType: sessionStorage.getItem("vehicleTypeDelivery") || null,
    vehicleModel: sessionStorage.getItem("vehicleModelDelivery") || null,
    vehiclePlate: sessionStorage.getItem("vehiclePlateDelivery") || null,
    vehicleState: sessionStorage.getItem("vehicleStateDelivery") || null,
    vehicleImage: sessionStorage.getItem("vehicleImage") || "",
    selectedQuarters: sessionStorage.getItem("selectedQuarters") || null,
    identity_card_in_front: sessionStorage.getItem("identity_card_in_front") || null,
    identity_card_with_the_person: sessionStorage.getItem("identity_card_with_the_person") || null,
    drivers_license: sessionStorage.getItem("drivers_license") || null,
    password: sessionStorage.getItem("password") || null,
  },

  reducers: {
    setPersonalInfoDelivery: (state, action) => {
      sessionStorage.setItem("firstNameDelivery", action.payload.firstName);
      sessionStorage.setItem("lastNameDelivery", action.payload.lastName);
      sessionStorage.setItem("emailDelivery", action.payload.email);
      sessionStorage.setItem("phoneDelivery", action.payload.phone);
      sessionStorage.setItem("birthDateDelivery", action.payload.birthDate);
      sessionStorage.setItem("nationalityDelivery", action.payload.nationality);
      sessionStorage.setItem("cityDelivery", action.payload.city);
      sessionStorage.setItem("quarterDelivery", action.payload.quarter);
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.birthDate = action.payload.birthDate;
      state.nationality = action.payload.nationality;
      state.city = action.payload.city;
      state.quarter = action.payload.quarter;
    },
    setVehicleInfoDelivery: (state, action) => {
      sessionStorage.setItem("vehicleTypeDelivery", action.payload.vehicleType);
      sessionStorage.setItem("vehicleModelDelivery", action.payload.vehicleModel);
      sessionStorage.setItem("vehiclePlateDelivery", action.payload.vehiclePlate);
      sessionStorage.setItem("vehicleStateDelivery", action.payload.vehicleState);
      sessionStorage.setItem("vehicleImage", action.payload.vehicleImage)
      state.vehicleType = action.payload.vehicleType;
      state.vehicleModel = action.payload.vehicleModel;
      state.vehiclePlate = action.payload.vehiclePlate;
      state.vehicleState = action.payload.vehicleState;
      state.vehicleImage = action.payload.vehicleImage
    },
    setDeliveryZone: (state, action) => {
      sessionStorage.setItem("selectedQuarters", action.payload.selectedQuarters);
      state.selectedQuarters = action.payload.selectedQuarters;
    },

    setDocument: (state, action) => {
      sessionStorage.setItem("drivers_license", action.payload.drivers_license)
      sessionStorage.setItem("identity_card_in_front", action.payload.identity_card_in_front)
      sessionStorage.setItem("identity_card_with_the_person", action.payload.identity_card_with_the_person)
      state.drivers_license = action.payload.drivers_license
      state.identity_card_in_front = action.payload.identity_card_in_front
      state.identity_card_with_the_person = action.payload.identity_card_with_the_person
    },
    setPassword: (state, action) => {
      sessionStorage.setItem("password", action.payload.password)
      state.password = action.payload.password
    },

  }
})

export const { setPersonalInfoDelivery, setVehicleInfoDelivery, setDeliveryZone, setDocument, setPassword } = deliverySlice.actions;
export default deliverySlice;