const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const { getOrderById } = require('../services/order.service');
const { getHtmlForEmailTemplate } = require('../emailTemplates/order_created_template');
const { createLog } = require('../services/audit_log.service');
const { getById } = require('../services/pat_document.service');
const { getOrderAuthDocumentByPatientId } = require('../services/order_auth_document.service');
const { downloadImage } = require('../utils/upload_image.util');
const { detail } = require('../services/user.service');
const { welcomeEmailHtml } = require('../emailTemplates/welcome_template');
const { OFFICE_VISIT_ORDER_TYPE_ID, RADIATION_ORDER_TYPE_ID, OFFICE_VISIT_ORDER_TYPE, RADIATION_ORDER_TYPE } = require('../utils/constants.util');
const moment = require('moment');
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const fromEmail = process.env.MAILGUN_FROM_EMAIL;

/**
 * This will send an email to users of office visit and radiation
 * @param {*} orderData
 */
const sendEmailForOrderTypes = async (orderDetails) => {

    try {

        let orderId = orderDetails.orderId;
        const userData = await detail(orderDetails.userId);

        let userName = userData.firstName + ' ' + userData.lastName;
        let orgName = userData.organization.name;

        // get the order details
        const orderData = await getOrderById(orderId);
        orderData.userName = userName;
        orderData.orgName = orgName;
        orderData.dob = moment(orderData.patientDemography.dob).format('MM/DD/YYYY');
        orderData.dateOfVisit = orderData.medicalHistory.dateOfVisit ? moment(orderData.medicalHistory.dateOfVisit).format('MM/DD/YYYY') : '';

        // get email body for office visit and radiation order type
        const emailBodyHtml = await getHtmlForEmailTemplate(orderData);

        // get the patient documents for attachment
        const attachments = await getTheAttachmentsForOrderType(orderData);

        // set the to email based on order type
        let toEmail;
        let orderType;
        if (orderDetails.orderTypeId == OFFICE_VISIT_ORDER_TYPE_ID) {
            orderType = OFFICE_VISIT_ORDER_TYPE;
            toEmail = process.env.OV_TO_EMAIL;
        } else if (orderDetails.orderTypeId == RADIATION_ORDER_TYPE_ID) {
            orderType = RADIATION_ORDER_TYPE;
            toEmail = process.env.RADIATION_TO_EMAIL;
        }

        // prepare the email parameters
        const emailParameters = {
            from: fromEmail,
            to: toEmail,
            subject: 'TOI - ' + orderType + ' Order Created with Order Id #' + orderId,
            html: emailBodyHtml,
            attachment: attachments
        };

        const sendMessageResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN, emailParameters);
        if (sendMessageResponse?.status != 200) {
            await createLog(
                emailParameters,
                "Users",
                "SendUserRegistrationEmail",
                sendMessageResponse,
                userData.id
            );
        } else {
            await createLog(
                emailParameters,
                "Users",
                "SendUserRegistrationEmail"
            );
        }
        // send email
        // mg.messages.create(emailParameters, (error, body) => {
        //     // log the error if any
        //     if (error) {
        //         createLog(emailParameters, 'Orders', 'SendEmailForOrderTypes', error, orderId);
        //     }

        //     // log the success message
        //     if (body) {
        //         createLog(emailParameters, 'Orders', 'SendEmailForOrderTypes', body, orderId);
        //     }
        // });
    } catch (error) {
        await createLog(orderDetails, 'Orders', 'SendEmailForOrderTypes', error, orderDetails.orderId);
        throw error;
    }

}

/**
 * 
 * @param {*} orderData 
 * @param {*} documentTypeId 
 */
const getTheAttachmentsForOrderType = async (orderData) => {

    try {
        // get order auth documents of patient
        const orderAuthDocuments = await getOrderAuthDocumentByPatientId(orderData.patientId, orderData.id);

        // get the document to send for attachment
        const attachmentData = [];
        for (let document of orderAuthDocuments) {
            let documentData = await getById(document.patDocumentId);

            // download the file from azure portal
            const fileContent = await downloadImage(documentData.documentURL);

            // prepare attachment data
            // attachmentData.push(new mg.Attachment({
            //     filename: documentData.documentName,
            //     data: fileContent.content
            // }))
            attachmentData.push({
                filename: documentData.documentName,
                data: fileContent.content
            })
        }

        // return attachment
        return attachmentData;
    } catch (error) {
        await createLog(orderData, 'PatDocuments', 'getTheAttachmentsForOrderType', error, orderData.id);
        throw error;
    }
}

const sendWelcomeEmail = async (userData) => {
    try {
        // welcome email html
        const userName = userData.firstName + ' ' + userData.lastName;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const welcomeEmailHtmlContent = await welcomeEmailHtml(userName, baseUrl);

        // prepare the email parameters
        const emailParameters = {
            from: fromEmail,
            to: userData.email,
            subject: 'TOI - Registration Successful',
            html: welcomeEmailHtmlContent
        };

        // send email
        // mg.messages().send(emailParameters, (error, body) => {
        //     // log the error if any
        //     if (error) {
        //         createLog(emailParameters, 'Users', 'SendUserRegistrationEmail', error, userData.id);
        //     }

        //     // log the success message
        //     if (body) {
        //         createLog(emailParameters, 'Orders', 'SendEmailForOrderTypes', body, userData.id);
        //     }
        // });
        const sendMessageResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN, emailParameters);
        if (sendMessageResponse?.status != 200) {
            await createLog(
                emailParameters,
                "Users",
                "SendUserRegistrationEmail",
                sendMessageResponse,
                userData.id
            );
        } else {
            await createLog(
                emailParameters,
                "Users",
                "SendUserRegistrationEmail"
            );

        }
    } catch (error) {
        await createLog(
            userData,
            "Users",
            "SendUserRegistrationEmail",
            JSON.parse(JSON.stringify(error)),
            userData.id
        );

        throw error;
    }
}
module.exports = { sendEmailForOrderTypes, sendWelcomeEmail }