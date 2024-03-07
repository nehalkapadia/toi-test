import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';
import { handleErrorResponse } from '@/utils/commonFunctions';

export const postUserFunc = createAsyncThunk(
  'userManagement/post',
  async (payload) => {
    try {
      const response = await axiosInstance.post('/api/users', payload);
      return response.data;
    } catch (err) {
      return handleErrorResponse(err);
    }
  }
);

export const getUsersFunc = createAsyncThunk(
  'userManagement/getList',
  async (payload = {}) => {
    try {
      const response = await axiosInstance.post('/api/users/list', payload);
      return response.data;
    } catch (err) {
      return handleErrorResponse(err);
    }
  }
);

export const getUserById = createAsyncThunk(
  'userManagement/listDetails',
  async (id) => {
    try {
      const response = await axiosInstance.get(`/api/users/${id}`);
      return response.data;
    } catch (err) {
      return handleErrorResponse(err);
    }
  }
);

export const updateUserFunc = createAsyncThunk(
  'userManagement/put',
  async ({ id, payload }) => {
    try {
      const response = await axiosInstance.put(`/api/users/${id}`, payload);
      return response.data;
    } catch (err) {
      return handleErrorResponse(err);
    }
  }
);

const userTableDataSlice = createSlice({
  name: 'userManagement',
  initialState: {
    getUsersData: [],
    getUserDetails: {},
    isLoading: false,
    viewIsLoading: false,
    isError: false,
    errorMessage: null,
    totalCount: 0,
    postLoading: false,
  },
  reducers: {
    setGetUserDetails: (state) => {
      return {
        ...state,
        getUserDetails: {},
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Post Req
      .addCase(postUserFunc.pending, (state) => {
        return {
          ...state,
          postLoading: true,
        };
      })
      .addCase(postUserFunc.fulfilled, (state, action) => {
        return {
          ...state,
          postLoading: false,
        };
      })
      .addCase(postUserFunc.rejected, (state, action) => {
        return {
          ...state,
          postLoading: false,
          isError: true,
          errorMessage: action?.error?.message,
        };
      })

      // Get Req
      .addCase(getUsersFunc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersFunc.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.getUsersData = payload?.data?.rows;
        state.totalCount = payload?.data?.count;
      })
      .addCase(getUsersFunc.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.error?.message;
      })

      // Update Request
      .addCase(updateUserFunc.pending, (state) => {
        return {
          ...state,
          postLoading: true,
        };
      })
      .addCase(updateUserFunc.fulfilled, (state) => {
        return {
          ...state,
          postLoading: false,
        };
      })
      .addCase(updateUserFunc.rejected, (state, action) => {
        return {
          ...state,
          postLoading: false,
          isError: true,
          errorMessage: action?.error?.message,
        };
      })

      // Get Organization Details for Specific ID
      .addCase(getUserById.pending, (state) => {
        return {
          ...state,
          viewIsLoading: true,
          getUserDetails: {},
        };
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const { payload } = action;
        return {
          ...state,
          viewIsLoading: false,
          getUserDetails: payload?.data,
        };
      })
      .addCase(getUserById.rejected, (state, action) => {
        return {
          ...state,
          viewIsLoading: false,
          getUserDetails: {},
          isError: true,
          errorMessage: action?.error?.message,
        };
      });
  },
});

export const { fetchUserTableData, setGetUserDetails } =
  userTableDataSlice.actions;
export const userTableDataReducer = userTableDataSlice.reducer;
