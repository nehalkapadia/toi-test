import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

export const postUserFunc = createAsyncThunk(
  "userManagement/post",
  async (payload) => {
    try{
      const response = await axiosInstance.post("/api/users", payload);
      return response.data; 
    } catch(err) {
      const payload = {
        status: false,
        message: err?.response?.data?.errors ? err?.response?.data?.errors[0]?.msg : err?.response?.data?.message,
    }
    return payload;
    }
  }
);

export const getUsersFunc = createAsyncThunk(
  "userManagement/getList",
  async (payload = {}) => {
    const response = await axiosInstance.post("/api/users/list", payload);
    return response.data;
  }
);

export const getUserById = createAsyncThunk(
  "userManagement/listDetails",
  async (id) => {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  }
);

export const updateUserFunc = createAsyncThunk(
  "userManagement/put",
  async ({ id, payload }) => {
    const response = await axiosInstance.put(`/api/users/${id}`, payload);
    return response.data;
  }
);

const userTableDataSlice = createSlice({
  name: "userManagement",
  initialState: {
    getUsersData: [],
    getUserDetails: {},
    isLoading: false,
    viewIsLoading: false,
    isError: false,
    errorMessage: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Post Req
      .addCase(postUserFunc.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Get Req
      .addCase(getUsersFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersFunc.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.getUsersData = payload.data.rows;
        state.totalCount = payload.data.count;
      })
      .addCase(getUsersFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Update Request
      .addCase(updateUserFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserFunc.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })

      // Get Organization Details for Specific ID
      .addCase(getUserById.pending, (state) => {
        state.viewIsLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const { payload } = action;
        state.viewIsLoading = false;
        state.getUserDetails = payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.viewIsLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { fetchUserTableData } = userTableDataSlice.actions;
export const userTableDataReducer = userTableDataSlice.reducer;
