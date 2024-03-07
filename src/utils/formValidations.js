import {
  isValidEmail,
  isValidName,
  isValidOrgOrDomainName,
  isValidPhoneNumber,
} from './patterns';

export const validateOrgName = (_, value) => {
  const validation = isValidOrgOrDomainName(value);
  if (!validation.isValid && value?.length > 0) {
    return Promise.reject(validation.warning);
  }
  return Promise.resolve();
};

export const validateAnEmail = (_, value) => {
  const validation = isValidEmail(value);
  if (!validation.isValid && value?.length > 0) {
    return Promise.reject(validation.warning);
  }
  return Promise.resolve();
};

export const validateOrgDomain = (_, value) => {
  const validation = isValidOrgOrDomainName(value);
  if (!validation.isValid && value?.length > 0) {
    return Promise.reject(validation.warning);
  }
  return Promise.resolve();
};

export const validatePhoneNumber = (_, value) => {
  value = value?.toString();

  const validation = isValidPhoneNumber(value);

  if (!validation.isValid && value?.length > 0) {
    return Promise.reject(validation.warning);
  }
  return Promise.resolve();
};

export const ValidateUserName = (_, value) => {
  const validation = isValidName(value);
  if (!validation.isValid && value?.length > 0) {
    return Promise.reject(validation.warning);
  }
  return Promise.resolve();
};
