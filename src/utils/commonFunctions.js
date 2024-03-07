import { message } from 'antd';
import dayjs from 'dayjs';
import {
  ALLOWED_FILE_TYPE_FOR_UPLOAD,
  ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER,
  ALL_PROVIDERS_MAX_LENGTH_COUNT,
  DATE_FORMAT_STARTING_FROM_YEAR,
  ERROR_MESSAGE_FOR_FILE_SIZE,
  ERROR_MESSAGE_FOR_UPLOADED_FILE_TYPE,
  MAX_FILE_SIZE_FOR_UPLOAD,
  MAX_UPLOAD_DOCUMENTS_PER_CATEGORY,
  ORDER_TYPES_ARRAY,
  PLEASE_LOGOUT_AND_LOGIN_BACK,
  USER_CANT_ACCESS_OR_EXIST,
} from './constant.util';

export const formatPhoneNumberToUSFormat = (number) => {
  if (!number) {
    return;
  }
  const numSting = number.toString();

  const countryCode = '1';
  const areaCode = numSting.slice(0, 3);
  const middleNumber = number.includes('-')
    ? numSting.slice(4, 7)
    : numSting.slice(3, 6);
  const lastNumber = number.includes('-')
    ? numSting.slice(8)
    : numSting.slice(6);

  return `+${countryCode} (${areaCode})-${middleNumber}-${lastNumber}`;
};

export const capitalizeWords = (inputString) => {
  if (!inputString || inputString?.trim() === '') {
    return;
  }
  const resultString = inputString.replace(/\b[a-zA-Z]/g, function (match) {
    return match.toLocaleUpperCase();
  });
  return resultString;
};

export const getRoleById = (id) => {
  if (!id) {
    return;
  } else if (id === 1) {
    return 'Admin';
  } else if (id === 2) {
    return 'Member';
  } else return 'Not A Valid Role';
};

export const formatPhoneNumberForInput = (value) => {
  if (!value || value?.toString()?.trim() === '') {
    return value;
  }

  value = value?.toString();

  const cleanNumber = value.replace(/\D/g, '');

  if (cleanNumber.length <= 3) {
    return cleanNumber;
  } else if (cleanNumber.length < 3 && cleanNumber.length < 6) {
    return `(${cleanNumber.slice(0, 3)})`;
  } else if (cleanNumber.length <= 6) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3)}`;
  } else if (cleanNumber.length <= 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(
      3,
      6
    )}-${cleanNumber.slice(6)}`;
  }
};

// Common Function for Checking File type and size Validation before Uploading.
export const beforeFileUpload = (file) => {
  if (!ALLOWED_FILE_TYPE_FOR_UPLOAD.includes(file.type)) {
    message.error(ERROR_MESSAGE_FOR_UPLOADED_FILE_TYPE);
    return false;
  }
  if (file.size > MAX_FILE_SIZE_FOR_UPLOAD) {
    message.error(ERROR_MESSAGE_FOR_FILE_SIZE);
    return false;
  }
  return true;
};

// FOr extracting uploaded doc filename from the url we received in response.
export const extractFileNameFromUrl = (url) => {
  if (!url) {
    return;
  }
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  return fileName || '';
};

// Func for checking the length of uploaded document array in a single category
export const fileLengthCheck = (categoryFiles) =>
  categoryFiles?.length < MAX_UPLOAD_DOCUMENTS_PER_CATEGORY;

// for extracting the id from the nested obj of arrays for documents uploaded at edit time

export const extractIdsFromNestedObjects = (obj) => {
  if (!obj) {
    return [];
  }
  let allIds = [];
  Object.keys(obj)?.forEach((key) => {
    if (Array.isArray(obj[key])) {
      const idsFromArray = obj[key]?.map((item) => item?.id);
      allIds = allIds.concat(idsFromArray);
    }
  });
  return allIds;
};

export const replaceNullWithEmptyString = (obj) => {
  if (!obj) {
    return {};
  }
  const result = {};
  Object.keys(obj)?.forEach((key) => {
    result[key] = obj[key] === null || obj[key] === 'null' ? '' : obj[key];
    result[key] = obj[key] === undefined ? '' : obj[key];
    result[key] = !obj[key] ? '' : obj[key];
  });

  return result;
};

// to create a new object with specified keys
export const filterObjectByKeys = (originalObject = {}, keyArray = []) => {
  const result = {};
  keyArray?.forEach((key) => {
    if (originalObject?.hasOwnProperty(key)) {
      result[key] = originalObject[key];
    }
  });

  return result;
};

export const compareTwoArraysElements = (arr1 = [], arr2 = []) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort((a, b) => a - b);
  const sortedArr2 = arr2.slice().sort((a, b) => a - b);

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};

export const formatFileSize = (bytes = 0) => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;

  if (bytes < kilobyte) {
    return bytes + ' B';
  } else if (bytes < megabyte) {
    return (bytes / kilobyte).toFixed(2) + ' KB';
  } else {
    return (bytes / megabyte).toFixed(2) + ' MB';
  }
};

export const patientDemographicsDataComparison = (resData, inputValues) => {
  const updatedResData = replaceNullWithEmptyString(resData);
  const updatedInputValues = replaceNullWithEmptyString(inputValues);

  const allKeys = Object.keys({
    ...updatedInputValues,
    ...updatedResData,
  });

  return allKeys.some(
    (key) =>
      (updatedResData[key] === undefined &&
        updatedInputValues[key] === undefined) ||
      (updatedResData[key] !== undefined &&
        updatedInputValues[key] !== undefined &&
        updatedResData[key] != updatedInputValues[key])
  );
};

export const allowDigitsOnly = (event) => {
  const allowedKeys = ['Tab', 'Backspace', 'ArrowLeft', 'ArrowRight'];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};
export const compareTwoObjectsForMedicalTab = (obj1, obj2) => {
  const allKeys = Object.keys(obj1);
  return allKeys.some((key) => obj1[key] !== obj2[key]);
};

export const modifyDateAndTimeObjectToDateOnly = (data = {}) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') {
      return '';
    }

    return dayjs(dateString).format(DATE_FORMAT_STARTING_FROM_YEAR);
  };

  const result = {};
  for (const key in data) {
    if (data?.hasOwnProperty(key)) {
      result[key] = formatDate(data[key]);
    }
  }
  return result;
};

export const validateNPINumberLength = (npiNumber) => {
  return (
    npiNumber?.toString()?.trim()?.length === ALL_PROVIDERS_MAX_LENGTH_COUNT
  );
};

export const commonReferringAndPCPFunc = (
  npiNumber,
  otherProvider,
  otherProviderData,
  warning1,
  warning2,
  dispatch,
  dispatchAction
) => {
  if (npiNumber == otherProvider) {
    message.error(warning1);
  } else if (
    npiNumber == otherProviderData?.npiNumber &&
    npiNumber != otherProvider
  ) {
    message.error(warning2);
  } else {
    dispatch(dispatchAction({ npiNumber, event: 'atCreate' })).then((res) => {
      if (!res?.payload?.status) {
        message.error(res?.payload?.message);
      }
    });
  }
};

export const handleErrorResponse = (error) => {
  const payload = {
    status: false,
    message: error?.response?.data?.errors
      ? error?.response?.data?.errors[0]?.msg
      : error?.response?.data?.message,
  };
  return payload;
};

export const customizedStringFunc = (string, maxLength) => {
  if (!string || string?.length <= maxLength) {
    return string;
  } else {
    return `${string?.substring(0, maxLength)}...`;
  }
};

export const orderDetailsArrayComparisonFunc = (arr1 = [], arr2 = []) => {
  if (arr1.length === 0 && arr2.length === 0) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return true;
  }

  const sortedArr1 = arr1.slice().sort((a, b) => a - b);
  const sortedArr2 = arr2.slice().sort((a, b) => a - b);

  for (let i = 0; i < sortedArr1?.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return true;
    }
  }
  return false;
  // If it returns true means both array does not have same element or id
  // If it return false means both array are either same or empty
};

export const isValidOrderType = (type, orderTypeArr = []) => {
  const updatedOrderType =
    orderTypeArr?.length > 0 ? orderTypeArr?.map((elem) => elem?.name) : [];
  const validOrderType =
    updatedOrderType?.length > 0 ? updatedOrderType : ORDER_TYPES_ARRAY;
  return [...validOrderType]?.includes(type);
};

export const formatDatesByDateKeysArr = (
  obj = {},
  dateKeysArr = [],
  shouldFormat
) => {
  if (shouldFormat === false) {
    // When we have to put values in form as Date object.
    dateKeysArr?.length > 0 &&
      dateKeysArr?.forEach((key) => {
        if (obj?.[key]) {
          obj[key] = dayjs(obj?.[key]);
        }
      });
  } else {
    // When we have to convert Date Object to a Date String.
    dateKeysArr?.length > 0 &&
      dateKeysArr?.forEach((key) => {
        if (obj?.[key]) {
          obj[key] = dayjs(obj?.[key]).format(DATE_FORMAT_STARTING_FROM_YEAR);
        }
      });
  }
  return obj;
};

// To compare two objects from medical History and Insurance Info Tab
export const commonFuncForTracingChanges = (payload) => {
  const {
    initialFormData = {},
    originalResData = {},
    customResData = {},
  } = payload;

  let traceChanges = false;
  let commonResponseData = {};

  if (originalResData && Object.keys(originalResData)?.length > 0) {
    commonResponseData = { ...originalResData };
  } else {
    commonResponseData = { ...customResData };
  }
  const formattedDateResData = formatDatesByDateKeysArr(
    { ...commonResponseData },
    ALL_DATE_RELATED_FIELDS_FOR_CREATE_ORDER
  );

  const updatedResponseData = replaceNullWithEmptyString(formattedDateResData);
  const updatedFormDataValues = replaceNullWithEmptyString(initialFormData);

  const commonKeys =
    updatedResponseData &&
    Object.keys(updatedResponseData)?.filter((key) =>
      updatedFormDataValues.hasOwnProperty(key)
    );

  // if atleast one key is changed it will return true.
  traceChanges = commonKeys.some(
    (key) => updatedResponseData[key] != updatedFormDataValues[key]
  );

  // If no common keys exist, consider it as a change
  if (commonKeys?.length < 1) {
    traceChanges = true;
  }
  // If any change is detected, it will return true
  return traceChanges;
};
