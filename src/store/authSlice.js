// redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

const initialState = {
  isAuthenticated: false,
  token: null,
  userRole: null,
  user: null,
  isLoading: false,
  errorMessage: "",
};

// Check if values exist in localStorage and use them as initial state
const storedToken =
  typeof window !== "undefined" && localStorage.getItem("userToken");
const storedRole =
  typeof window !== "undefined" && localStorage.getItem("userRole");

if (storedToken && storedRole) {
  initialState.isAuthenticated = true;
  initialState.token = storedToken;
  initialState.userRole = storedRole;
}

export const getProfile = createAsyncThunk("profile/get", async () => {
  const authToken = localStorage.getItem("userToken");
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  const response = await axiosInstance.get("/api/auth/profile", { headers });
  localStorage.setItem("userId", response.data?.data?.id);
  await axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
  });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userRole = action.payload.role;

      // Save to localStorage
      // localStorage.setItem("userToken", action.payload.token);
      // localStorage.setItem("userRole", action.payload.role);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userRole = null;

      // Clear localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        const { payload } = action;
        state.isLoading = false;
        state.successMessage = payload.message;
        state.user = payload.data;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export const authReducer = authSlice.reducer;
