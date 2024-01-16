const constantsUtil = require('../utils/constants.util');
const axios = require("axios");
const auditLogService = require("./audit_log.service");

/**
 * @param orderId
 * @description This will call the salesforce api to generate authentication token
 * @returns json response | throw error
 */
const getSalesForceAuthenticationToken = async (orderId = null) => {
    const url = process.env.AUTH_TOKEN_ENDPOINT;

    // prepare the form data to send it over api
    const formData = new FormData();
    formData.append('grant_type', process.env.GRANT_TYPE);
    formData.append('client_id', process.env.CLIENT_ID);
    formData.append('client_secret', process.env.CLIENT_SECRET);
    formData.append('username', process.env.SALES_FORCE_USERNAME);
    formData.append('password', process.env.SALES_FORCE_PASSWORD + process.env.SECURITY_TOKEN);

    // call the auth api
    const authApiResponse = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

    // return token data on success
    if (authApiResponse.status == 200) {
        return { 'token': authApiResponse.data.access_token, 'instance_url': authApiResponse.data.instance_url };
    }

    // log error
    await auditLogService.createLog(formData, 'Orders', 'SalesForceAuthApiResponse', authApiResponse, orderId);

    throw new Error(constantsUtil.SALESFORCE_AUTHENTICATION_FAILURE_MESSAGE);
}

/**
 * 
 * @param {*} token 
 * @param {*} instanceUrl 
 * @param {*} orderData 
 * @param {*} npiDetails
 * @returns jsonObject
 * @description This function will call the create order api of salesforce
 */
const createCase = async (token, instanceUrl, orderData, npiDetails) => {

    // prepare request url, headers, body
    const url = `${instanceUrl}/services/data/${process.env.API_VERSION}/sobjects/${process.env.CREATE_CASE}`;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    const patientName = orderData.patientDemography.firstName + ' ' + orderData.patientDemography.lastName;
    const diagnosisData = orderData.medicalHistory.diagnosis.split(/-(.*)/s)
    const body = {
        "Patient_Name__c": patientName,
        "Patient_MRN__c": orderData.patientDemography.mrn,
        "Patient_DOB__c": orderData.patientDemography.dob,
        "Patient_Gender__c": orderData.patientDemography.gender,
        "Primary_Insurance__c": orderData.insuranceInfo.healthPlan,
        "CA_Problem_Code__c": diagnosisData[0].trim(),
        "CA_Problem__c": diagnosisData[1].trim(),
        "Ordered_By__c": npiDetails.first_name + ' ' + npiDetails.lastName,
        "Ordering_Provider_NPI__c": orderData.medicalHistory.orderingProvider,
    }

    // call the create order api
    const createOrderApiResponse = await axios.post(url, body, { headers: headers });

    return createOrderApiResponse;
}

/**
 * @description
 * @param {*} uploadFileArray 
 * @param {*} requestDetails 
 * @returns This function will upload the patient documents to patient's case on salesforce
 */
const uploadPatientDocumentsForCase = async (uploadFileArray, requestDetails) => {

    // prepare request url, headers, body
    const url = `${requestDetails.instanceUrl}/services/data/v58.0/composite/tree/ContentVersion`;
    const body = { "records": uploadFileArray }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${requestDetails.token}`
    };

    // call the upload files api
    const uploadPatientDocumentsApiResponse = await axios.post(url, body, { headers: headers });

    return uploadPatientDocumentsApiResponse;
}

module.exports = {
    getSalesForceAuthenticationToken,
    createCase,
    uploadPatientDocumentsForCase,
}