// use event library
const Event = require("events");
const eventEmitter = new Event.EventEmitter();
const orderService = require("../services/order.service");
const salesforceService = require("../services/salesforce.service");
const constant = require("../utils/constants.util");
const auditLogService = require("../services/audit_log.service");
const npiService = require("../services/npi.service");
const { getLatestDocumentsByPatientAndOrderId } = require("../services/pat_document.service");
const { sendEmailForOrderTypes, sendWelcomeEmail } = require("./send_email");
const { getCaMedListC, getAllJCodes, getDescriptionOfNonNumericCptCode, getMedListDetailsC } = require("../services/cpt_codes.service");

/**
 * @param orderData jsonObject
 * This event is used to submit order to sales force
 * 1. It will update order status, retry count and case if
 * 2. It will call the sales force auth api and create order api
 */
eventEmitter.on("SubmitOrderToSalesForce", async (orderData) => {
    try {
        const orderDetails = await orderService.getOrderById(orderData.id);

        const orderId = orderDetails.id;

        let retryCount = 0;
        retryCount = orderDetails.retry + 1;

        // update the status to in-progress and retry count
        await orderService.updateOrderInfo(orderId, {
            salesForceSyncUpStatus: constant.INPROGRESS_STATUS,
            retry: retryCount,
        });

        // get salesforce authentication token
        const tokenData = await salesforceService.getSalesForceAuthenticationToken(
            orderId
        );

        const token = tokenData.token; // set auth token
        const instanceUrl = tokenData.instance_url; // set instance url to be used in create order

        // get ordering physician npi details
        orderDetails.orderingPhysician = await npiService.getNpiDetails(orderDetails.medicalHistory.orderingProvider);

        // get First non-numeric CPT code description
        orderDetails.subject = await getDescriptionOfNonNumericCptCode(orderDetails.orderDetails.cptCodes);

        // construct ca med list parameter
        orderDetails.ca_med_list_c = await getCaMedListC(orderDetails.orderDetails.cptCodes);

        // construct ca med list parameter
        orderDetails.all_j_codes_c = await getAllJCodes(orderDetails.orderDetails.cptCodes);

        // construct ca med list parameter
        orderDetails.med_list_details__c = await getMedListDetailsC(orderDetails.orderDetails.cptCodes);

        // call create order api
        const createCaseResponse = await salesforceService.createCase(
            token,
            instanceUrl,
            orderDetails
        );

        // when we get  success response from salesforce update the status and case id
        if (createCaseResponse.status == 201) {

            eventEmitter.emit("UploadOrderFilesToSalesForce", {
                orderId: orderId,
                patientId: orderDetails.patientId,
                caseId: createCaseResponse.data.id,
                instanceUrl: instanceUrl,
                token: token,
                orderTypeId: orderDetails.orderTypeId
            }); // fire event to upload files on salesforce

            await orderService.updateOrderInfo(orderId, {
                salesForceSyncUpStatus: constant.SUCCESS_STATUS,
                caseId: createCaseResponse.data.id,
            });

        } else {
            await orderService.updateOrderInfo(orderId, {
                salesForceSyncUpStatus: constant.FAILED_STATUS,
            });

            await auditLogService.createLog(
                createCaseResponse,
                "Orders",
                "SalesForceCreateCaseResponse",
                createCaseResponse,
                orderData.id
            );
        }
    } catch (error) {
        // Handle the error or throw it to be caught in the controller
        await orderService.updateOrderInfo(orderData.id, {
            salesForceSyncUpStatus: constant.FAILED_STATUS,
        });

        await auditLogService.createLog(
            orderData,
            "Orders",
            "SubmitOrderToSalesForce",
            error,
            orderData.id
        );
        throw error;
    }
});

/**
 * @description This event will upload file from local machine or third party storage to salesforce
 * @param {*} patientDetails
 */
eventEmitter.on("UploadOrderFilesToSalesForce", async (patientDetails) => {
    try {
        // get the list of the documents
        let documentList = await getLatestDocumentsByPatientAndOrderId(
            patientDetails.patientId,
            patientDetails.orderId,
            patientDetails.orderTypeId,
        );
        documentList = JSON.parse(JSON.stringify(documentList));

        const uploadFileArray = await salesforceService.prepareDataToUploadFilesToSalesforce(
            documentList,
            patientDetails.caseId
        );

        await salesforceService.uploadPatientDocumentsForCase(uploadFileArray, {
            instanceUrl: patientDetails.instanceUrl,
            token: patientDetails.token,
        });
    } catch (error) {
        await auditLogService.createLog(
            patientDetails,
            "Orders",
            "UploadOrderFilesToSalesForce",
            JSON.parse(JSON.stringify(error)),
            patientDetails.orderId
        );

        throw error;
    }
});

/**
 * Event to send the emails
 * @param {json} orderData
 */
eventEmitter.on("SendEmailForOrderTypes", (orderData) => {
    sendEmailForOrderTypes(orderData);
});

/**
 * Event to send the emails
 * @param {json} userData
 */
eventEmitter.on("SendUserRegistrationEmail", async (userData) => {
    sendWelcomeEmail(userData);
});

module.exports = eventEmitter;
