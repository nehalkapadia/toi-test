const constantsUtil = require('../utils/constants.util');
const axios = require("axios");
const auditLogService = require("./audit_log.service");
const { downloadImage } = require("../utils//upload_image.util");
const { DEFAULT_STATUS } = require('../utils/order_status_mapping.util');

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
    formData.append('username', process.env.SALESFORCE_INTEGRATION_USER_EMAIL);
    formData.append('password', process.env.SALESFORCE_INTEGRATION_USER_PASSWORD);

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
 * @returns jsonObject
 * @description This function will call the create order api of salesforce
 */
const createCase = async (token, instanceUrl, orderData) => {

    // prepare request url, headers, body
    const url = `${instanceUrl}/services/data/${process.env.API_VERSION}/sobjects/${process.env.CREATE_CASE}`;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    const patientName = orderData.patientDemography.firstName + ' ' + orderData.patientDemography.lastName;
    const diagnosisData = orderData.medicalHistory.diagnosis.split(/-(.*)/s);
    const body = {
        "Patient_Name__c": patientName,
        "Patient_MRN__c": orderData.patientDemography.hsMemberID,
        "Patient_DOB__c": orderData.patientDemography.dob,
        "Patient_Gender__c": orderData.patientDemography.gender,
        "Primary_Insurance__c": orderData.insuranceInfo.healthPlan,
        "CA_Problem_Code__c": diagnosisData[0].trim(),
        "CA_Problem__c": diagnosisData[1].trim(),
        "Ordered_By__c": orderData.orderingPhysician.firstName + ' ' + orderData.orderingPhysician.lastName,
        "Ordering_Provider_NPI__c": orderData.orderingPhysician.npiNumber,
        "Attending_Physician_NPI__c": orderData.orderingPhysician.npiNumber,
        "Attending_Physician__c": orderData.orderingPhysician.firstName + ' ' + orderData.orderingPhysician.lastName,
        "RecordTypeId": constantsUtil.SALESFORCE_RECORD_TYPE_ID,
        "Subject": orderData.subject,
        "CA_Med_List__c": orderData.ca_med_list_c,
        "Next_Cycle_Number__c": constantsUtil.SALESFORCE_NEXT_CYCLE_NUMBER,
        "Chemo_Auth_Type__c": constantsUtil.SALESFORCE_CHEMO_AUTH_TYPE_C,
        "CA_Status__c": DEFAULT_STATUS,
        "External_Order__c": true,
        "J_Codes__c": orderData.all_j_codes_c,
    }
    try {
        // call the create order api
        const createOrderApiResponse = await axios.post(url, body, { headers: headers });

        return createOrderApiResponse;
    } catch(error) {
        await auditLogService.createLog(body, 'Orders', 'SalesforceCreateOrder', error, orderData?.id)
        throw error;
    }
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

/**
 * @description This function will download and prepare the file upload request array
 * @param {*} documentList 
 * @param {*} caseId 
 * @returns 
 */
const prepareDataToUploadFilesToSalesforce = async (documentList, caseId) => {
    const uploadFileArray = [];
    for (let document in documentList) {
        const patientDocuments = documentList[document].documents;

        for (let singleDocument in patientDocuments) {
            if (typeof patientDocuments[singleDocument].documentURL !== "undefined") {
                // download file from the server
                let newFileData = await downloadImage(patientDocuments[singleDocument].documentURL)

                const fileData = newFileData.content.toString('base64');

                // prepare the upload file array to send it to salesforce api
                uploadFileArray.push({
                    attributes: {
                        type: "ContentVersion",
                        referenceId: patientDocuments[singleDocument].id.toString(),
                    },
                    Title: patientDocuments[singleDocument].documentName,
                    PathOnClient: patientDocuments[singleDocument].documentName,
                    VersionData: fileData,
                    FirstPublishLocationId: caseId.toString()
                });
            }
        }
    }

    return uploadFileArray;
};

module.exports = {
    getSalesForceAuthenticationToken,
    createCase,
    uploadPatientDocumentsForCase,
    prepareDataToUploadFilesToSalesforce,
}