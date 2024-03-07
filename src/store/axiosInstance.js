import axios from 'axios';
import { message } from 'antd';
import {
	PLEASE_LOGOUT_AND_LOGIN_BACK,
	USER_CANT_ACCESS_OR_EXIST,
  USER_ROLE_HAS_BEEN_CHANGED,
} from '@/utils/constant.util';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API base URL
  timeout: 7000,
});

// Adding a request interceptor(middleware) to include the bearer token in all requests.
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      'userToken'
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error?.response?.data?.status &&
        (error?.response?.data?.message === USER_CANT_ACCESS_OR_EXIST ||
          error?.response?.data?.message === USER_ROLE_HAS_BEEN_CHANGED)) {
      message.error({
        content: `${error?.response?.data?.message} ${PLEASE_LOGOUT_AND_LOGIN_BACK}`,
        key: 'userDeleted',
        duration: 3, // 3 seconds
      });
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');

      setTimeout(() => {
        typeof window !== 'undefined' ? (window.location.href = '/login') : null;
      }, 3000);
    }
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
