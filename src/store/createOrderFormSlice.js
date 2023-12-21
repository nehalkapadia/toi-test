const { createSlice } = require("@reduxjs/toolkit");

const createOrderFormDataSlice = createSlice({
  name: "createOrderForm",
  initialState: {
    medicalHistoryTab: false,
    insuranceInfoTab: true,
    pateintDocsTab: true,
    isPatientExist: false,
    currentSelectedTab: "patientDemographics",
    searchPatientResMessage: "",
    tab1FormData: {},
    tab2FormData: {},
    tab3FormData: {},
    tab4FormData: {},
    displayOrderingSuccessTick: false,
    displayReferringSuccessTick: false,
    displayPcpNumberSuccessTick: false,
  },
  reducers: {
    setMedicalHistoryTab: (state) => {
      state.medicalHistoryTab = !state.medicalHistoryTab;
    },
    setInsuranceInfoTab: (state) => {
      state.insuranceInfoTab = !state.insuranceInfoTab;
    },
    setPateintDocsTab: (state) => {
      state.pateintDocsTab = !state.pateintDocsTab;
    },

    setTab1FormData: (state, action) => {
      state.tab1FormData = action.payload;
    },
    setTab2FormData: (state, action) => {
      state.tab2FormData = action.payload;
    },
    setTab3FormData: (state, action) => {
      state.tab3FormData = action.payload;
    },
    setTab4FormData: (state, action) => {
      state.tab3FormData = action.payload;
    },
    setCurrentSelectedTab: (state, action) => {
      state.currentSelectedTab = action.payload;
    },
    setDisplayorderingSuccessTick: (state, action) => {
      state.displayOrderingSuccessTick = action.payload;
    },
    setDisplayReferringSuccessTick: (state, action) => {
      state.displayReferringSuccessTick = action.payload;
    },
    setDisplayPcpNumberSuccessTick: (state, action) => {
      state.displayPcpNumberSuccessTick = action.payload;
    },
  },
});

export const {
  setMedicalHistoryTab,
  setInsuranceInfoTab,
  setPateintDocsTab,
  setTab1FormData,
  setTab2FormData,
  setTab3FormData,
  setTab4FormData,
  setCurrentSelectedTab,
  setDisplayorderingSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayPcpNumberSuccessTick,
} = createOrderFormDataSlice.actions;

export const selectCreateOrderForm = (state) => state.createOrderForm;

export const createOrderFormReducer = createOrderFormDataSlice.reducer;
