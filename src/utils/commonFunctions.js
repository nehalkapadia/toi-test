import { message } from 'antd';
import {
  ALLOWED_FILE_TYPE_FOR_UPLOAD,
  ERROR_MESSAGE_FOR_FILE_SIZE,
  ERROR_MESSAGE_FOR_UPLOADED_FILE_TYPE,
  MAX_FILE_SIZE_FOR_UPLOAD,
  MAX_UPLOAD_DOCUMENTS_PER_CATEGORY,
} from './constant.util';

export const formatPhoneNumberToUSFormat = (number) => {
  if (!number) {
    return;
  }
  const numSting = number.toString();

  const countryCode = '1';
  const areaCode = numSting.slice(0, 3);
  const middleNumber = numSting.slice(3, 6);
  const lastNumber = numSting.slice(6);

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
    return;
  }

  value = value?.toString();

  const cleanNumber = value.replace(/\D/g, '');

  if (cleanNumber.length === 3) {
    return `(${cleanNumber.slice(0, 3)}) `;
  } else if (cleanNumber.length === 6) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-`;
  } else if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(
      3,
      6
    )}-${cleanNumber.slice(6, 10)}`;
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

export const filterObjectByKeys = (originalObject, keyArray) => {
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
}