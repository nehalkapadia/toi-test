import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';
import { message } from 'antd';
import {
  DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY,
  DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY,
  DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY,
  DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY,
  DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY,
  DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY,
  DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY,
  DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY,
  DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY,
  MISSING_REQUIRED_FIELDS,
} from '@/utils/constant.util';
import {
  MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES,
  PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES,
} from '@/utils/constant.util';

const initialState = {
  // internal State of Form

  tab1FormData: {},

  getAllOrderIsLoading: false,
  getAllOrders: [],
  totalOrderCount: 0,
  getOrderDetails: {},
  detailsIsLoading: false,
  isError: false,
  errorMessage: '',
  totalCount: 0,
  getUsersListForDropdown: [],

  patientSearchIsLoading: false,
  patientRecordSearchData: {}, // If record exists all data saved in this variable
  patientSearchResponse: false,
  displaySearchModal: false,
  isNewPatientCreated: false,
  patientDemographicsData: {}, // if record not exists we make api req and save res here
  patientId: null,

  medicalHistoryAllData: {},
  medicalHistoryOnly: {},
  diagnosisDropDownValues: [],
  medicalRecordOnly: {},
  orderingNPIData: {},
  referringNPIData: {},
  pcpNPIData: {},
  medicalHistoryAndRecordDataForEdit: {},
  patientAllUploadedFilesData: {
    radiologyFiles: [],
    pathologyFiles: [],
    labStatusFiles: [],
    prevAuthorizationFiles: [],
    medicalReleaseFiles: [],
    insuranceCardCopyFiles: [],
    secondaryInsuranceFiles: [],
  },
  medicalUploadedFilesById: [],
  medicalFilesAtEditById: [],
  medicalHistoryId: null,
  medicalRecordId: null,

  insuranceInfoData: {},
  insuranceInfoId: null,
  createHistoryOrInsurance: true,

  patientUploadedDocsData: {
    writtenOrdersFiles: [],
    mdNotesFiles: [],
  },
  patientDocsFilesById: [],
  patientFilesAtEditById: [],

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
  lastDraftOrderData: {},
  lastUpdatedOrderData: {},
  createNewHistory: false,
  createNewInsuranceInfo: false,
  primaryStartValue: null,
  diagnosisId: null,
};

export const postPatientDemographicsData = createAsyncThunk(
  'orderManagement/postPatientDemographicsData',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/patients', payload);
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
  'orderManagement/getPatientRecordData',
  async (payload) => {
    try {
      const { firstName, lastName, dob, gender, mrn } = payload;
      if (!firstName || !lastName || !dob || !gender || !mrn) {
        return message.error(MISSING_REQUIRED_FIELDS);
      }
      const response = await axiosInstance.get(
        `/api/patients/search?firstName=${firstName}&lastName=${lastName}&dob=${dob}&gender=${gender}&mrn=${mrn}`
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
  'orderManagement/getValidateOrderingProvider',
  async ({ npiNumber, event = '' }) => {
    if (!npiNumber || npiNumber?.toString()?.trim() === '') {
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.event = event;
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
  'orderManagement/getValidateReferringProvider',
  async ({ npiNumber, event = '' }) => {
    if (!npiNumber || npiNumber?.toString()?.trim() === '') {
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.event = event;
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
  'orderManagement/getValidatePCPNumber',
  async ({ npiNumber, event = '' }) => {
    if (!npiNumber || npiNumber?.toString()?.trim() === '') {
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/npiRegistory/validate?npiNumber=${npiNumber}`
      );
      response.data.event = event;
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

export const postMedicalHistoryData = createAsyncThunk(
  'orderManagement/postMedicalHostory1',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/medicalHistory', payload);
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
  'orderManagement/postMedicalHostory2',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/medicalRecord', payload);
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
  'orderManagement/postInsuranceInfo',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/insuranceInfo', payload);
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
  'orderManagement/postCreateOrder',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/order', payload);
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

export const orderSaveAsDraft = createAsyncThunk(
  'orderManagement/orderSaveAsDraft',
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        '/api/order/draft/save',
        payload
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

export const getAllCreatedOrderData = createAsyncThunk(
  'orderManagement/getAllOrderData',
  async (payload = {}) => {
    try {
      const { page, perPage, orderBy } = payload;
      const response = await axiosInstance.post('/api/order/list', payload);
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
  'orderManagement/getUserListforDropdownAtOrderMgt',
  async () => {
    try {
      const response = await axiosInstance.get('/api/organizations/user/list');
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
  'orderManagement/getOrderDetails',
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

export const postUploadFile = createAsyncThunk(
  'orderManagement/postUploadFile',
  async (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('type', payload.type);
    formData.append('patientId', payload.patientId);

    try {
      const response = await axiosInstance.post(
        '/api/patientDocuments/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      response.data.category = payload.type;
      response.data.uploaded = true;
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

export const deleteUploadedFileById = createAsyncThunk(
  'orderManagement/deleteUploadedFileById',
  async (payload) => {
    const id = payload?.id;
    const category = payload?.category || '';
    const orderId = payload?.orderId ? payload?.orderId : '';
    const isAuth = payload?.isAuth ? payload?.isAuth : false;
    const uploaded = payload?.uploaded ? payload?.uploaded : false;
    try {
      const response = await axiosInstance.delete(
        `/api/patientDocuments/${id}?orderId=${orderId}&isAuth=${isAuth}&uploaded=${uploaded}`
      );
      response.data.category = category;
      response.data.id = id;
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

export const postPatientDocsUploadFunc = createAsyncThunk(
  'orderManagement/postPatientDocsUploadFunc',
  async (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('type', payload.type);
    formData.append('patientId', payload.patientId);

    try {
      const response = await axiosInstance.post(
        '/api/patientDocuments/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      response.data.category = payload.type;
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

export const getPatientDocumentsAtEdit = createAsyncThunk(
  'orderManagement/getPatientDocumentsAtEdit',
  async (payload) => {
    try {
      const patientId = payload?.patientId;
      const orderId = payload?.orderId ? payload?.orderId : '';
      const response = await axiosInstance.get(
        `/api/patientDocuments?patientId=${patientId}&orderId=${orderId}`
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

export const updateOrderData = createAsyncThunk(
  'orderManagement/putUpdateOrderData',
  async ({ orderId, payload }) => {
    try {
      const response = await axiosInstance.put(
        `/api/order/${orderId}`,
        payload
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

export const getDiagnosisDropDownValues = createAsyncThunk(
  'orderManagement/getDiagnosisDropDownValues',
  async (payload) => {
    try {
      const response = await axiosInstance.get(
        `/api/diagnosis/search?ICDCode=${payload}`
      );
      return response.data;
    } catch (error) {
      const payload = {
        status: false,
        message: error?.response?.data?.errors
          ? error?.response?.data?.errors[0]?.msg
          : error?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const deleteOrderById = createAsyncThunk(
  'orderManagement/deleteOrderById',
  async (payload) => {
    try {
      const response = await axiosInstance.post(`/api/order/soft/delete/${payload}`);
      return response.data;
    } catch (error) {
      const payload = {
        status: false,
        message: error?.response?.data?.errors
          ? error?.response?.data?.errors[0]?.msg
          : error?.response?.data?.message,
      };
      return payload;
    }
  }
);

export const postRegisterNPIDataAfterValidate = createAsyncThunk(
  'orderManagement/postRegisterNPIDataAfterValidate',
  async (payload) => {
    try {
      const newPayload = {
        ...payload,
        sole_proprietor: payload?.sole_proprietor === 'NO' ? false : true,
        npiNumber: payload?.npiNumber?.toString()?.trim(),
      };
      const response = await axiosInstance.post(
        '/api/npiRegistory',
        newPayload
      );
      return response.data;
    } catch (error) {
      const payload = {
        status: false,
        message: error?.response?.data?.errors
          ? error?.response?.data?.errors[0]?.msg
          : error?.response?.data?.message,
      };
      return payload;
    }
  }
);

const orderSlice = createSlice({
  name: 'orderManagement',
  initialState,
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
    setTab1FormData: (state, action) => {
      return {
        ...state,
        tab1FormData: action.payload,
      };
    },
    setDisplaySearchModal: (state, action) => {
      return {
        ...state,
        displaySearchModal: action.payload,
      };
    },
    setMedicalUploadedFilesById: (state, action) => {
      return {
        ...state,
        medicalUploadedFilesById: action?.payload || [],
      };
    },

    setPatientDocsFilesById: (state, action) => {
      return {
        ...state,
        patientDocsFilesById: action?.payload || [],
      };
    },
    setIsTab2DataChanges: (state, action) => {
      return {
        ...state,
        medicalHistoryAndRecordDataForEdit: action.payload,
      };
    },

    setMedicalFilesAtEditById: (state, action) => {
      return {
        ...state,
        medicalFilesAtEditById: action?.payload || [],
      };
    },

    setPatientFilesAtEditById: (state, action) => {
      return {
        ...state,
        patientFilesAtEditById: action?.payload || [],
      };
    },

    resetOrderStateToInitialState: () => initialState,
    resetSearchPatientData: (state, action) => {
      return {
        ...state,
        patientRecordSearchData: {},
        patientSearchResponse: false,
        createNewHistory: false,
        createNewInsuranceInfo: false,
        orderingResStatus: false,
        referringResStatus: false,
        pcpNumberResStatus: false,

        loadingOrderingProvider: false,
        orderingProviderData: {},
        createHistoryOrInsurance: true,
      };
    },
    setSearchResponse: (state, action) => {
      return {
        ...state,
        patientSearchResponse: action.payload,
      };
    },
    setHistoryCreated: (state, action) => {
      return {
        ...state,
        createNewHistory: action.payload,
      };
    },
    setInsuranceInfoCreated: (state, action) => {
      return {
        ...state,
        createNewInsuranceInfo: action.payload,
      };
    },
    setIsNewPatientCreated: (state, action) => {
      return {
        ...state,
        isNewPatientCreated: action.payload,
      };
    },
    setPrimaryStartValue: (state, action) => {
      return {
        ...state,
        primaryStartValue: action.payload,
      };
    },
    setDiagnosisId: (state, action) => {
      return {
        ...state,
        diagnosisId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Post Req for Patient Demographics tab-1
      .addCase(postPatientDemographicsData.fulfilled, (state, action) => {
        const { payload } = action;
        state.createNewHistory = true;
        state.createNewInsuranceInfo = true;
        state.patientDemographicsData = payload.data;
        state.isNewPatientCreated = payload?.status;
        state.patientId = payload?.data?.id;
      })
      .addCase(postPatientDemographicsData.rejected, (state, action) => {
        state.isError(true);
        state.errorMessage = action.error.message;
      })

      // Search patient Record
      .addCase(searchPatientRecordData.pending, (state) => {
        return {
          ...state,
          patientSearchIsLoading: true,
          patientRecordSearchData: {},
          patientSearchResponse: false,
          displaySearchModal: false,
          patientDemographicsData: {},
          medicalHistoryOnly: {},
          medicalRecordOnly: {},
          insuranceInfoData: {},
          patientId: null,
          medicalHistoryId: null,
          insuranceInfoId: null,
          medicalRecordId: null,
        };
      })
      .addCase(searchPatientRecordData.fulfilled, (state, action) => {
        const { payload } = action;
        return {
          ...state,
          patientSearchIsLoading: false,
          patientRecordSearchData: payload?.data,
          patientSearchResponse: payload?.status,
          displaySearchModal: payload?.status,
          patientDemographicsData: payload?.data?.patientDemography,
          medicalHistoryOnly: payload?.data?.medicalHistory,
          medicalRecordOnly: payload?.data?.medicalRecord,
          insuranceInfoData: payload?.data?.insuranceInfo,
          patientId: payload?.data?.patientDemography?.id,
          medicalHistoryId: payload?.data?.medicalHistory?.id,
          insuranceInfoId: payload?.data?.insuranceInfo?.id,
          medicalRecordId: payload?.data?.medicalRecord?.id,
        };
      })

      .addCase(searchPatientRecordData.rejected, (state, action) => {
        state.patientSearchIsLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      //Validate Ordering Provider Data
      .addCase(getValidateOrderingProvider.pending, (state) => {
        return {
          ...state,
          loadingOrderingProvider: true,
          orderingResStatus: false,
          displayOrderingModal: false,
          orderingNPIData: {},
        };
      })
      .addCase(getValidateOrderingProvider.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingOrderingProvider = false;
        state.orderingResStatus = payload?.status;
        state.orderingProviderData = payload?.data;

        if (payload?.event === 'atCreate') {
          state.displayOrderingModal = payload?.status;
          state.orderingNPIData = payload?.data;
        }
      })
      .addCase(getValidateOrderingProvider.rejected, (state, action) => {
        state.loadingOrderingProvider = false;
        state.orderingResStatus = action.payload.status;
        state.displayOrderingModal = false;
      })
      // Validate Referring Provider Data
      .addCase(getValidateReferringProvider.pending, (state) => {
        return {
          ...state,
          loadingReferringProvider: true,
          referringResStatus: false,
          displayReferringModal: false,
          referringNPIData: {},
        };
      })
      .addCase(getValidateReferringProvider.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingReferringProvider = false;
        state.referringResStatus = payload?.status;
        state.referringProviderData = payload?.data;
        if (payload?.event === 'atCreate') {
          state.displayReferringModal = payload?.status;
          state.referringNPIData = payload?.data;
        }
      })
      .addCase(getValidateReferringProvider.rejected, (state, action) => {
        state.loadingReferringProvider = false;
        state.referringResStatus = action.payload.status;
        state.displayReferringModal = false;
      })
      // Validate PCP Number Data
      .addCase(getValidatePCPNumber.pending, (state) => {
        return {
          ...state,
          loadingPcpNumber: true,
          pcpNumberResStatus: false,
          displayPCPNumberModal: false,
          pcpNPIData: {},
        };
      })
      .addCase(getValidatePCPNumber.fulfilled, (state, action) => {
        const { payload } = action;
        state.loadingPcpNumber = false;
        state.pcpNumberResStatus = payload?.status;
        state.pcpNumberData = payload?.data;
        if (payload?.event === 'atCreate') {
          state.displayPCPNumberModal = payload?.status;
          state.pcpNPIData = payload?.data;
        }
      })
      .addCase(getValidatePCPNumber.rejected, (state, action) => {
        state.loadingPcpNumber = false;
        state.pcpNumberResStatus = action.payload.status;
        state.displayPCPNumberModal = false;
      })
      // Post Req For Medical Hostory Data
      .addCase(postMedicalHistoryData.fulfilled, (state, action) => {
        const { payload } = action;
        state.medicalHistoryId = payload?.data?.id;
        state.createHistoryOrInsurance = false;
        state.medicalHistoryOnly = payload?.data;
        state.medicalHistoryAllData = {
          ...state.medicalHistoryAllData,
          ...payload?.data,
        };
      })
      .addCase(postMedicalRecordData.fulfilled, (state, action) => {
        const { payload } = action;
        state.medicalRecordOnly = payload?.data;
        state.medicalRecordId = payload?.data?.id;
        state.createHistoryOrInsurance = false;
        state.medicalHistoryAllData = {
          ...state.medicalHistoryAllData,
          ...payload?.data,
        };
      })
      // post req for Insurance Info tab-3
      .addCase(postInsuranceInfoData.fulfilled, (state, action) => {
        const { payload } = action;
        state.insuranceInfoData = payload?.data?.insuranceInfo
          ? payload?.data?.insuranceInfo
          : payload?.data;
        state.insuranceInfoId = payload?.data?.insuranceInfo
          ? payload?.data?.insuranceInfo?.id
          : payload?.data?.id;
        state.createHistoryOrInsurance = false;
      })

      // Final Create Order
      .addCase(postFinalOrderCreateData.fulfilled, () => initialState)

      // Save order as draft
      .addCase(orderSaveAsDraft.fulfilled, (state, action) => {
        state.lastDraftOrderData = action?.payload?.data;
      })

      // Update order data
      .addCase(updateOrderData.fulfilled, (state, action) => {
        state.lastUpdatedOrderData = action?.payload?.data;
      })

      // Get All Created Orders Data for Table
      .addCase(getAllCreatedOrderData.pending, (state) => {
        state.getAllOrderIsLoading = true;
      })
      .addCase(getAllCreatedOrderData.fulfilled, (state, action) => {
        state.getAllOrderIsLoading = false;
        state.getAllOrders = action?.payload?.data?.rows;
        state.totalOrderCount = action?.payload?.data?.count;
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
        return {
          ...state,
          getOrderDetails: action.payload.data,
          patientRecordSearchData: action?.payload?.data,
          patientSearchResponse: action?.payload?.status,
          patientSearchIsLoading: false,
          displaySearchModal: false,
          patientDemographicsData: action?.payload?.data?.patientDemography,
          medicalHistoryOnly: action?.payload?.data?.medicalHistory,
          medicalRecordOnly: action?.payload?.data?.medicalRecord,
          insuranceInfoData: action?.payload?.data?.insuranceInfo,
          patientId: action?.payload?.data?.patientDemography?.id,
          medicalHistoryId: action?.payload?.data?.medicalHistory?.id,
          insuranceInfoId: action?.payload?.data?.insuranceInfo?.id,
          medicalRecordId: action?.payload?.data?.medicalRecord?.id,
        };
      })

      // Patient's Tab-2 & Tab-3 Uploaded File Data at Time of Create Order
      .addCase(postUploadFile.fulfilled, (state, action) => {
        const { patientAllUploadedFilesData } = state;
        const { payload } = action;
        const validateCategory =
          MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES.find(
            (cate) => cate.value === payload?.category
          );

        const updatedFiles = [
          ...patientAllUploadedFilesData[validateCategory?.key],
        ];
        updatedFiles.push({
          documentTypeId: payload?.data?.documentTypeId,
          documentURL: payload?.data?.documentURL,
          documentSize: payload?.data?.documentSize,
          documentName: payload?.data?.documentName,
          id: payload?.data?.id,
          patientId: payload?.data?.patientId,
          uploaded: true,
        });

        const updatedMedicalUploadedFilesById = [
          ...state.medicalUploadedFilesById,
          payload?.data?.id,
        ];

        return {
          ...state,
          patientAllUploadedFilesData: {
            ...patientAllUploadedFilesData,
            [validateCategory.key]: updatedFiles,
          },
          medicalUploadedFilesById: updatedMedicalUploadedFilesById,
        };
      })

      // Delete Request for Uploaded Documents
      .addCase(deleteUploadedFileById.fulfilled, (state, action) => {
        const { payload } = action;

        const validateCategoryKey =
          MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES.find(
            (cate) => cate.value === payload?.category
          ) ||
          PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES.find(
            (cate) => cate.value === payload?.category
          );

        if (
          MEDICAL_AND_INSURANCE_FILE_UPLOAD_CATEGORIES.some(
            (elem) => elem.value === payload?.category
          )
        ) {
          return {
            ...state,
            patientAllUploadedFilesData: {
              ...state.patientAllUploadedFilesData,
              [validateCategoryKey.key]: state.patientAllUploadedFilesData[
                validateCategoryKey.key
              ]?.filter((elem) => elem.id !== payload?.id),
            },
            medicalUploadedFilesById: state.medicalUploadedFilesById?.filter(
              (elem) => elem !== payload?.id
            ),
          };
        } else if (
          PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES.some(
            (elem) => elem.value === payload?.category
          )
        ) {
          return {
            ...state,
            patientUploadedDocsData: {
              ...state.patientUploadedDocsData,
              [validateCategoryKey.key]: state.patientUploadedDocsData[
                validateCategoryKey.key
              ]?.filter((elem) => elem.id !== payload?.id),
            },
            patientDocsFilesById: state.patientDocsFilesById?.filter(
              (elem) => elem !== payload?.id
            ),
          };
        } else {
          return {
            ...state,
          };
        }
      })

      // Upload File for patient Documents tab-4
      .addCase(postPatientDocsUploadFunc.fulfilled, (state, action) => {
        const { patientUploadedDocsData } = state;
        const { payload } = action;
        const validateCategory = PATIENT_DOCUMENTS_FILE_UPLOAD_CATEGORIES.find(
          (cate) => cate.value === payload?.category
        );

        const updatedFiles = [...patientUploadedDocsData[validateCategory.key]];
        updatedFiles.push({
          documentTypeId: payload?.data?.documentTypeId,
          documentURL: payload?.data?.documentURL,
          documentSize: payload?.data?.documentSize,
          documentName: payload?.data?.documentName,
          id: payload?.data?.id,
          patientId: payload?.data?.patientId,
        });

        const updatedPatientDocsFilesById = [
          ...state.patientDocsFilesById,
          payload?.data?.id,
        ];

        return {
          ...state,
          patientUploadedDocsData: {
            ...patientUploadedDocsData,
            [validateCategory.key]: updatedFiles,
          },
          patientDocsFilesById: updatedPatientDocsFilesById,
        };
      })

      // Get patient Documents req for edit part
      .addCase(getPatientDocumentsAtEdit.fulfilled, (state, action) => {
        const { payload } = action;
        return {
          ...state,
          patientAllUploadedFilesData: {
            ...state.patientAllUploadedFilesData,
            radiologyFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_RADIOLOGY_CATEGORY]
                ?.documents || [],
            pathologyFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_PATHOLOGY_CATEGORY]
                ?.documents || [],
            labStatusFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_LAB_STATUS_CATEGORY]
                ?.documents || [],
            prevAuthorizationFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_PREV_AUTH_CATEGORY]
                ?.documents || [],
            medicalReleaseFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_MEDICAL_RELEASE_CATEGORY]
                ?.documents || [],
            insuranceCardCopyFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_INSURANCE_COPY_CATEGORY]
                ?.documents || [],
            secondaryInsuranceFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_SECONDARY_INSURANCE_CATEGORY]
                ?.documents || [],
          },
          patientUploadedDocsData: {
            ...state.patientUploadedDocsData,
            writtenOrdersFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_WRITTEN_ORDERS_CATEGORY]
                ?.documents || [],
            mdNotesFiles:
              payload?.data?.[DOCUMENTS_UPLOAD_IN_MD_NOTES_CATEGORY]
                ?.documents || [],
          },
          createHistoryOrInsurance: false,
        };
      })
      .addCase(getDiagnosisDropDownValues.fulfilled, (state, action) => {
        const { payload } = action;
        return {
          ...state,
          diagnosisDropDownValues: payload?.data?.map((item) => ({
            id: item?.id,
            label: `${item?.ICDCode} - ${item?.description}`,
            value: `${item?.ICDCode} - ${item?.description}`,
          })),
        };
      })
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        const { payload } = action;
        return {
          ...state,
          getAllOrders: state.getAllOrders.filter(
            (item) => item?.id !== payload?.data?.id
          ),
          totalOrderCount: state.totalOrderCount - 1,
        };
      })
      .addCase(getOrderDetailsById.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.error.message;
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
  setTab1FormData,
  setDisplaySearchModal,
  setMedicalUploadedFilesById,
  setPatientDocsFilesById,
  setIsTab2DataChanges,
  setMedicalFilesAtEditById,
  setPatientFilesAtEditById,
  resetOrderStateToInitialState,
  resetSearchPatientData,
  setSearchResponse,
  setHistoryCreated,
  setInsuranceInfoCreated,
  setIsNewPatientCreated,
  setPrimaryStartValue,
  setDiagnosisId,
} = orderSlice.actions;
export const allOrdersDataReducer = orderSlice.reducer;
