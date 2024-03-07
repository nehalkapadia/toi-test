const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  currentSelectedTab: 'patientDemographics',
  patientDemographicsTab: false,
  medicalHistoryTab: true,
  insuranceInfoTab: true,
  orderDetailsTab: true,
  pateintDocsTab: true,
  isPatientExist: false,
  searchPatientResMessage: '',
  tab2FormData: {},
  tab3FormData: {},
  insuranceInfoDateValues: {},
  tab4FormData: {}, // Order Details tab
  displayOrderingSuccessTick: false,
  displayReferringSuccessTick: false,
  displayPcpNumberSuccessTick: false,
  diagnosisSearchedValue: '',
  cptCodeSearchedStr: null,
  selectedCptCodeData: null,
  patientDocsWrittenOrderCategory: false,
  patientDocsMdNotesCategory: false,
  patientDocsReferralCategory: false,
  selectedUploadCategory: null,
};

const createOrderFormDataSlice = createSlice({
  name: 'createOrderForm',
  initialState,
  reducers: {
    setPatientDemographicsTab: (state, action) => {
      return {
        ...state,
        patientDemographicsTab: action.payload,
      };
    },
    setMedicalHistoryTab: (state, action) => {
      return {
        ...state,
        medicalHistoryTab: action.payload,
      };
    },
    setInsuranceInfoTab: (state, action) => {
      return {
        ...state,
        insuranceInfoTab: action.payload,
      };
    },
    setOrderDetailsTab: (state, action) => {
      return {
        ...state,
        orderDetailsTab: action.payload,
      };
    },
    setPateintDocsTab: (state, action) => {
      return {
        ...state,
        pateintDocsTab: action.payload,
      };
    },

    setTab2FormData: (state, action) => {
      state.tab2FormData = action.payload;
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
    setPatientDocsReferralCategory: (state, action) => {
      return {
        ...state,
        patientDocsReferralCategory: action.payload,
      };
    },
    setDiagnosisSearchedValue: (state, action) => {
      return {
        ...state,
        diagnosisSearchedValue: action.payload,
      };
    },

    setCptCodeSearchedStr: (state, action) => {
      return {
        ...state,
        cptCodeSearchedStr: action.payload,
      };
    },

    setSelectedCptCodeData: (state, action) => {
      return {
        ...state,
        selectedCptCodeData: action.payload,
      };
    },

    setSelectedUploadCategory: (state, action) => {
      return {
        ...state,
        selectedUploadCategory: action.payload,
      };
    },

    setInsuranceInfoDateValues: (state, action) => {
      return {
        ...state,
        insuranceInfoDateValues: {
          ...state.insuranceInfoDateValues,
          ...action.payload,
        },
      };
    },
    resetCreateOrderDataBacktoInitialState: () => initialState,
  },
});

export const {
  setMedicalHistoryTab,
  setInsuranceInfoTab,
  setPateintDocsTab,
  setOrderDetailsTab,
  setTab2FormData,
  setTab3FormData,
  setTab4FormData,
  setCurrentSelectedTab,
  setDisplayorderingSuccessTick,
  setDisplayReferringSuccessTick,
  setDisplayPcpNumberSuccessTick,
  setPatientDocsWrittenOrderCategory,
  setPatientDocsMdNotesCategory,
  setPatientDocsReferralCategory,
  setDiagnosisSearchedValue,
  setCptCodeSearchedStr,
  setSelectedCptCodeData,
  setPatientDemographicsTab,
  setInsuranceInfoDateValues,
  setSelectedUploadCategory,
  resetCreateOrderDataBacktoInitialState,
} = createOrderFormDataSlice.actions;

export const selectCreateOrderForm = (state) => state.createOrderForm;

export const createOrderFormReducer = createOrderFormDataSlice.reducer;
