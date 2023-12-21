import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";
import { message } from "antd";

export const postPatientDemographicsData = createAsyncThunk(
  "orderManagement/postPatientDemographicsData",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/patients", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const searchPatientRecordData = createAsyncThunk(
  "orderManagement/getPatientRecordData",
  async (payload) => {
    try {
      const { firstName, lastName, dob, gender } = payload;
      if (!firstName || !lastName || !dob || !gender) {
        return message.error("Missing required fields");
      }
      const response = await axiosInstance.get(
        `/api/patients/search?firstName=${firstName}&lastName=${lastName}&dob=${dob}&gender=${gender}`
      );
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getValidateOrderingProvider = createAsyncThunk(
  "orderManagement/getValidateOrderingProvider",
  async (npiNumber) => {
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.data.npiNumber = npiNumber;
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getValidateReferringProvider = createAsyncThunk(
  "orderManagement/getValidateReferringProvider",
  async (npiNumber) => {
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.data.npiNumber = npiNumber;
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getValidatePCPNumber = createAsyncThunk(
  "orderManagement/getValidatePCPNumber",
  async (npiNumber) => {
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.data.npiNumber = npiNumber;
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const postMedicalHostoryData = createAsyncThunk(
  "orderManagement/postMedicalHostory1",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/medicalHistory", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const postMedicalRecordData = createAsyncThunk(
  "orderManagement/postMedicalHostory2",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/medicalRecord", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const postInsuranceInfoData = createAsyncThunk(
  "orderManagement/postInsuranceInfo",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/insuranceInfo", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const postFinalOrderCreateData = createAsyncThunk(
  "orderManagement/postCreateOrder",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/order", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getAllCreatedOrderData = createAsyncThunk(
  "orderManagement/getAllOrderData",
  async (payload = {}) => {
    try {
      const { page, perPage, orderBy } = payload;
      const response = await axiosInstance.post("/api/order/list", payload);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getUserListBasedOnLoggedInPerson = createAsyncThunk(
  "orderManagement/getUserListforDropdownAtOrderMgt",
  async () => {
    try {
      const response = await axiosInstance.get("/api/organizations/user/list");
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const getOrderDetailsById = createAsyncThunk(
  "orderManagement/getOrderDetails",
  async (id) => {
    try {
      const response = await axiosInstance.get(`/api/order/${id}`);
      return response.data;
    } catch (err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors
          ? err?.response?.data?.errors[0]?.msg
          : err?.response?.data?.message,
      };
      return payload;
    }
  }
);

const orderSlice = createSlice({
  name: "orderManagement",
  initialState: {
    getAllOrderIsLoading: false,
    getAllOrders: [],
    totalOrderCount: 0,
    getOrderDetails: {},
    detailsIsLoading: false,
    isError: false,
    errorMessage: "",
    totalCount: 0,
    getUsersListForDropdown: [],
    patientSearchIsLoading: false,
    patientRecordSearchData: {}, // If record exists all data saved in this variable
    patientSearchResponse: false,
    isPatientCreated: false,
    patientDemographicsData: {}, // if record not exists we make api req and save res here

    medicalHostoryAllData: {},
    medicalHistoryOnly: {},
    medicalRecordOnly: {},

    insuranceInfoData: {},
    patientDocsData: {},

    finalCreateOrderData: {},

    loadingOrderingProvider: false,
    orderingResStatus: false,
    displayOrderingModal: false,
    orderingProviderData: {},

    loadingReferringProvider: false,
    referringResStatus: false,
    displayReferringModal: false,
    referringProviderData: {},

    loadingPcpNumber: false,
    pcpNumberResStatus: false,
    displayPCPNumberModal: false,
    pcpNumberData: {},
  },
  reducers: {
    setDisplayOrderingModal: (state, action) => {
      state.displayOrderingModal = action.payload;
    },
    setValidationCancelForOrdering: (state) => {
      state.orderingResStatus = false;
      state.orderingProviderData = {};
    },
    setDisplayReferringModal: (state, action) => {
      state.displayReferringModal = action.payload;
    },
    setValidationCancelForReferring: (state) => {
      state.referringResStatus = false;
      state.referringProviderData = {};
    },
    setDisplayPCPNumberModal: (state, action) => {
      state.displayPCPNumberModal = action.payload;
    },
    setValidationCancelForPCPNumber: (state) => {
      state.pcpNumberResStatus = false;
      state.pcpNumberData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Post Req for Patient Demographics tab-1
      .addCase(postPatientDemographicsData.fulfilled, (state, action) => {
        const { payload } = action;
        state.patientDemographicsData = payload.data;
        state.isPatientCreated = payload.status;
      })
      .addCase(postPatientDemographicsData.rejected, (state, action) => {
        state.isError(true);
        state.errorMessage = action.error.message;
      })

      // Search patient Record
      .addCase(searchPatientRecordData.pending, (state) => {
        state.patientSearchIsLoading = true;
      })
      .addCase(searchPatientRecordData.fulfilled, (state, action) => {
        const { payload } = action;
        state.patientSearchIsLoading = false;
        state.patientRecordSearchData = payload.data;
        state.patientSearchResponse = payload.status;
      })
      .addCase(searchPatientRecordData.rejected, (state, action) => {
        state.patientSearchIsLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      //Validate Ordering Provider Data
      .addCase(getValidateOrderingProvider.pending, (state) => {
        state.loadingOrderingProvider = true;
        state.orderingResStatus = false;
        state.displayOrderingModal = false;
      })
      .addCase(getValidateOrderingProvider.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingOrderingProvider = false;
        state.orderingResStatus = payload?.status;
        state.displayOrderingModal = payload?.status;
        state.orderingProviderData = payload?.data;
      })
      .addCase(getValidateOrderingProvider.rejected, (state, action) => {
        state.loadingOrderingProvider = false;
        state.orderingResStatus = action.payload.status;
        state.displayOrderingModal = false;
      })
      // Validate Referring Provider Data
      .addCase(getValidateReferringProvider.pending, (state) => {
        state.loadingReferringProvider = true;
        state.referringResStatus = false;
        state.displayReferringModal = false;
      })
      .addCase(getValidateReferringProvider.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingReferringProvider = false;
        state.referringResStatus = payload?.status;
        state.displayReferringModal = payload?.status;
        state.referringProviderData = payload?.data;
      })
      .addCase(getValidateReferringProvider.rejected, (state, action) => {
        state.loadingReferringProvider = false;
        state.referringResStatus = action.payload.status;
        state.displayReferringModal = false;
      })
      // Validate PCP Number Data
      .addCase(getValidatePCPNumber.pending, (state) => {
        state.loadingPcpNumber = true;
        state.pcpNumberResStatus = false;
        state.displayPCPNumberModal = false;
      })
      .addCase(getValidatePCPNumber.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingPcpNumber = false;
        state.pcpNumberResStatus = payload?.status;
        state.displayPCPNumberModal = payload?.status;
        state.pcpNumberData = payload?.data;
      })
      .addCase(getValidatePCPNumber.rejected, (state, action) => {
        state.loadingPcpNumber = false;
        state.pcpNumberResStatus = action.payload.status;
        state.displayPCPNumberModal = false;
      })
      // Post Req For Medical Hostory Data
      .addCase(postMedicalHostoryData.fulfilled, (state, action) => {
        const { payload } = action;
        state.medicalHistoryOnly = payload?.data;
        state.medicalHostoryAllData = {
          ...state.medicalHostoryAllData,
          ...payload?.data,
        };
      })
      .addCase(postMedicalRecordData.fulfilled, (state, action) => {
        const { payload } = action;
        state.medicalRecordOnly = payload?.data;
        state.medicalHostoryAllData = {
          ...state.medicalHostoryAllData,
          ...payload?.data,
        };
      })
      // post req for Insurance Info tab-3
      .addCase(postInsuranceInfoData.fulfilled, (state, action) => {
        const { payload } = action;
        state.insuranceInfoData = payload?.data;
      })

      // Final Create Order
      .addCase(postFinalOrderCreateData.fulfilled, (state, action) => {
        state.finalCreateOrderData = action?.payload?.data;
      })

      // Get All Created Orders Data for Table
      .addCase(getAllCreatedOrderData.pending, (state) => {
        state.getAllOrderIsLoading = true;
      })
      .addCase(getAllCreatedOrderData.fulfilled, (state, action) => {
        state.getAllOrderIsLoading = false;
        state.getAllOrders = action?.payload?.data?.rows;
        state.totalOrderCount = action?.payload?.count;
      })
      .addCase(getAllCreatedOrderData.rejected, (state, action) => {
        state.getAllOrderIsLoading = false;
        state.isError = true;
      })

      // Get All Users List For Dropdown at Order Management Dashboard Page
      .addCase(getUserListBasedOnLoggedInPerson.fulfilled, (state, action) => {
        state.getUsersListForDropdown = action?.payload?.data;
      })

      // Get Order By Id
      .addCase(getOrderDetailsById.fulfilled, (state, action) => {
        state.getOrderDetails = action.payload.data;
      });
  },
});

export const {
  fetchOrdersData,
  setDisplayOrderingModal,
  setValidationCancelForOrdering,
  setDisplayReferringModal,
  setValidationCancelForReferring,
  setDisplayPCPNumberModal,
  setValidationCancelForPCPNumber,
} = orderSlice.actions;
export const allOrdersDataReducer = orderSlice.reducer;
