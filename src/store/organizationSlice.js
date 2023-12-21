import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token =
  typeof window !== "undefined" && localStorage.getItem("userToken");

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    authorization: "Bearer " + token,
  },
});

export const getOrganizationsFunc = createAsyncThunk(
  "organization/getList",
  async (payload = {}) => {
    const authToken = localStorage.getItem("userToken");
    axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    });
    const response = await axiosInstance.post(
      "/api/organizations/list",
      payload
    );
    return response.data;
  }
);

export const postOrganizationFunc = createAsyncThunk(
  "organization/post",
  async (payload) => {
    try {
      const response = await axiosInstance.post("/api/organizations", payload);
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

export const getOrganizationsById = createAsyncThunk(
  "organization/listDetails",
  async (id) => {
    const response = await axiosInstance.get(`/api/organizations/${id}`);
    return response.data;
  }
);

export const updateOrganizationFunc = createAsyncThunk(
  "organization/put",
  async ({ id, payload }) => {
    try {
      const response = await axiosInstance.put(
        `/api/organizations/${id}`,
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

export const deleteOrganizationFunc = createAsyncThunk(
  "organization/delete",
  async (id) => {
    const response = await axiosInstance.delete(`/api/organizations/${id}`);
    return response.data;
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    getOrganizations: [],
    getOrgDetails: {},
    postOrganization: [],
    updateOrganization: [],
    isLoading: false,
    viewIsLoading: false,
    isError: false,
    errorMessage: null,
    successMessage: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Post Req
      .addCase(postOrganizationFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postOrganizationFunc.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.successMessage = payload.message;
        state.postOrganization = [payload.data];
      })
      .addCase(postOrganizationFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Get Req
      .addCase(getOrganizationsFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrganizationsFunc.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.successMessage = payload.message;
        state.getOrganizations = payload.data.rows;
        state.totalCount = payload.data.count;
      })
      .addCase(getOrganizationsFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Update Request
      .addCase(updateOrganizationFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrganizationFunc.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.successMessage = payload.message;
        state.updateOrganization = [payload.data];
      })
      .addCase(updateOrganizationFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Delete Request
      .addCase(deleteOrganizationFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrganizationFunc.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteOrganizationFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Get Organization Details for Specific ID
      .addCase(getOrganizationsById.pending, (state) => {
        state.viewIsLoading = true;
      })
      .addCase(getOrganizationsById.fulfilled, (state, action) => {
        const { payload } = action;
        state.viewIsLoading = false;
        state.successMessage = payload.message;
        state.getOrgDetails = payload.data;
      })
      .addCase(getOrganizationsById.rejected, (state, action) => {
        state.viewIsLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { fetchOrganizationData } = organizationSlice.actions;
export const organizationReducer = organizationSlice.reducer;
