const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  medicalHistoryTab: true,
  insuranceInfoTab: true,
  pateintDocsTab: true,
  isPatientExist: false,
  currentSelectedTab: 'patientDemographics',
  searchPatientResMessage: '',
  tab2FormData: {},
  tab3FormData: {},
  tab4FormData: {},
  displayOrderingSuccessTick: false,
  displayReferringSuccessTick: false,
  displayPcpNumberSuccessTick: false,

  diagnosisSearchedValue: '',

  patientDocsWrittenOrderCategory: false,
  patientDocsMdNotesCategory: false,
};

const createOrderFormDataSlice = createSlice({
  name: 'createOrderForm',
  initialState,
  reducers: {
    setMedicalHistoryTab: (state, action) => {
      state.medicalHistoryTab = action.payload;
    },
    setInsuranceInfoTab: (state, action) => {
      state.insuranceInfoTab = action.payload;
    },
    setPateintDocsTab: (state, action) => {
      state.pateintDocsTab = action.payload;
    },

    setTab2FormData: (state, action) => {
      return {
        ...state,
        tab2FormData: {
          ...state.tab2FormData,
          ...action.payload,
        },
      };
    },
    setTab3FormData: (state, action) => {
      state.tab3FormData = action.payload;
    },
    setTab4FormData: (state, action) => {
      state.tab4FormData = action.payload;
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
    setPatientDocsWrittenOrderCategory: (state, action) => {
      state.patientDocsWrittenOrderCategory = action.payload;
    },
    setPatientDocsMdNotesCategory: (state, action) => {
      state.patientDocsMdNotesCategory = action.payload;
    },
    setDiagnosisSearchedValue: (state, action) => {
      return {
        ...state,
        diagnosisSearchedValue: action.payload,
      };
    },
    resetCreateOrderDataBacktoInitialState: () => initialState,
  },
});

export const {
  setMedicalHistoryTab,
  setInsuranceInfoTab,
  setPateintDocsTab,
  setTab2FormData,
  setTab3FormData,
  setTab4FormData,
  setCurrentSelectedTab,
  setDisplayorderingSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayPcpNumberSuccessTick,
  setPatientDocsWrittenOrderCategory,
  setPatientDocsMdNotesCategory,
  resetCreateOrderDataBacktoInitialState,
  setDiagnosisSearchedValue,
} = createOrderFormDataSlice.actions;

export const selectCreateOrderForm = (state) => state.createOrderForm;

export const createOrderFormReducer = createOrderFormDataSlice.reducer;
