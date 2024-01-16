const { successResponse, errorResponse } = require('../utils/response.util');
const constants = require('../utils/constants.util');
const patientService = require('../services/patient.service');
const orderService = require('../services/order.service');
const { getMedicalHistoryByPatientId } = require('../services/medical_history.service');
const { getMedicalRecordByPatientId } = require('../services/medical_record.service');
const { checkExistingInsurance } = require('../services/insurance_info.service');
const { getOrderAuthDocumentByPatientId } = require('../services/order_auth_document.service');
const { createLog } = require('../services/audit_log.service');
const { formatRequest } = require('../utils/common.util');


/**
 * Search for a patient
 *
 * @param {Object} req - The request object.
 *   - @property {Object} query - The query parameters extracted from the request.
 *     - @property {string} firstName - First name of the patient.
 *     - @property {string} lastName - Last name of the patient.
 *     - @property {string} dob - Date of birth of the patient.
 *     - @property {string} gender - Gender of the patient.
 * @param {Object} res - The response object.
 *     - @property {number} status - HTTP status code of the response.
 *     - @property {Object} json - A JSON object containing either patient details or an error message.
 *     - @property {string} message - A message indicating the result of the search.
 *     - @property {Object|null} data - Patient details if found, null otherwise.
 * 
 * @url /api/patients/search
 * @method GET
 */
exports.searchPatient = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'PatientDemos', 'Search');
    // Extracting query parameters from the request object
    const { firstName, lastName, dob, gender, mrn } = req.query;

    // Use the service to search for a patient
    const existingPatient = await patientService.searchPatient({
      firstName,
      lastName,
      dob,
      gender,
      mrn
    });

    if (existingPatient) {
      const order = await orderService.getOrderByPatientId(existingPatient?.id);
      if(order) {
        return res.status(constants.SUCCESS).json(
          successResponse(constants.SEARCH_SUCCESS, order)
        );
      }
      const medicalHistoryData = await getMedicalHistoryByPatientId(existingPatient.id);
      const medicalRecordData = await getMedicalRecordByPatientId(existingPatient.id);
      const insuranceInfoData = await checkExistingInsurance(existingPatient.id);
      const orderAuthDocumentData = await getOrderAuthDocumentByPatientId(existingPatient.id);
      const patientDetails = {
        patientDemography: existingPatient ? existingPatient : null,
        medicalHistory: medicalHistoryData ? medicalHistoryData : null,
        medicalRecord: medicalRecordData ? medicalRecordData : null,
        insuranceInfo: insuranceInfoData ? insuranceInfoData : null,
        orderAuthDocuments: orderAuthDocumentData ? orderAuthDocumentData : null
      }
      // Patient exists, return the details in the response
      return res.status(constants.SUCCESS).json(
        successResponse(constants.SEARCH_SUCCESS, patientDetails)
      );
    } else {
      // Patient does not exist, throw an error
      return res.status(constants.NOT_FOUND).json(
        errorResponse(constants.PATIENT_NOT_FOUND, null)
      );
    }
  } catch (error) {
    await createLog(formatRequest(req), 'PatientDemos', 'Search', error);
    // Handle the error and return an error response
    return res.status(constants.INTERNAL_SERVER_STATUS).json(
      errorResponse(constants.INTERNAL_SERVER_ERROR, error.message)
    );
  }
};


/**
 * Create a patient
 *
 * @param {Object} req - The request object.
 *   - @property {string} firstName - First name of the patient.
 *   - @property {string} lastName - Last name of the patient.
 *   - @property {string} dob - Date of birth of the patient.
 *   - @property {string} gender - Gender of the patient.
 * @param {Object} res - The response object.
 *   - @property {number} status - HTTP status code of the response.
 *   - @property {Object} json - A JSON object containing either patient details or an error message.
 *   - @property {string} message - A message indicating the result of the creation.
 *   - @property {Object|null} data - Patient details if created, null otherwise.
 * @url /api/patients
 * @method POST
 */
exports.createPatient = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'PatientDemos', 'Create');
    const reqData = req.body;
    const userId = req?.userData?.id;

    // Check if the patient already exists
    const existingPatient = await patientService.searchOrUpdatePatient(reqData)

    if (existingPatient) {
      return res.status(constants.SUCCESS).json(
        successResponse(constants.UPDATE_SUCCESS, existingPatient)
      );
    }
    if(userId) {
      req.body.createdBy = userId;
      req.body.updatedBy = userId;
    }
    // Create a new patient
    delete reqData?.patientId;
    delete reqData?.orderId;
    const newPatient = await patientService.createPatient(req.body);

    // Fetch the newly created patient with all details
    const createdPatient = await patientService.getPatientById(newPatient.id);

    // Return the detailed patient information in the response
    return res.status(constants.CREATED).json({
      status: true,
      message: constants.CREATE_SUCCESS,
      data: createdPatient,
    });
  } catch (error) {
    await createLog(formatRequest(req), 'PatientDemos', 'Create', error);
    // Handle the error and return an error response
    return res.status(constants.INTERNAL_SERVER_STATUS).json({
      status: false,
      message: constants.INTERNAL_SERVER_ERROR,
      data: error?.message,
    });
  }
};

/**
 * Update a patient
 *
 * @param {Object} req - The request object.
 *   - @property {string} id - ID of the patient to be updated.
 *   - @property {string} firstName - Updated first name of the patient.
 *   - @property {string} lastName - Updated last name of the patient.
 *   - @property {string} dob - Updated date of birth of the patient.
 *   - @property {string} gender - Updated gender of the patient.
 *   - @property {string} email - Updated email address of the patient.
 *   - @property {string} primaryPhoneNumber - Updated primary phone number of the patient.
 * @param {Object} res - The response object.
 *   - @property {number} status - HTTP status code of the response.
 *   - @property {Object} json - A JSON object containing either patient details or an error message.
 *   - @property {string} message - A message indicating the result of the update.
 *   - @property {Object|null} data - Updated patient details if successful, null otherwise.
 * @url /api/patients/:id
 * @method PUT
 */
exports.updatePatient = async (req, res) => {
  try {
    await createLog(formatRequest(req), 'PatientDemos', 'Update');
    const { id } = req.params;
    const userId = req?.userData?.id;

    // Check if the patient with the given ID exists
    const existingPatient = await patientService.getPatientById(id);

    if (!existingPatient) {
      // Patient doesn't exist, return an error
      return res.status(constants.NOT_FOUND).json(
        errorResponse(constants.PATIENT_NOT_FOUND, null)
      );
    }

    // Check if the updated data conflicts with other existing patients
    const conflictingPatient = await patientService.checkForDataConflict(id, req.body);

    if (conflictingPatient) {
      // Data conflict with another patient, return an error
      return res.status(constants.BAD_REQUEST).json(
        errorResponse(constants.UPDATE_CONFLICT_ERROR, null)
      );
    }
    if(userId) {
      req.body.createdBy = userId;
      req.body.updatedBy = userId;
    }
    // Update the patient if the data is different and no conflict
    const updatedPatient = await patientService.updatePatient(id, req.body);

    // Return the updated patient information in the response
    return res.status(constants.SUCCESS).json(
      successResponse(constants.UPDATE_SUCCESS, updatedPatient)
    );
  } catch (error) {
    await createLog(formatRequest(req), 'PatientDemos', 'Update', error);
    // Handle the error and return an error response
    return res.status(constants.INTERNAL_SERVER_STATUS).json(
      errorResponse(constants.INTERNAL_SERVER_ERROR, error)
    );
  }
};

/**
 * Controller function to get patient details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Patients getPatientById
 * @api /api/patients?
 * @method GET
 */
exports.getPatientById = async (req, res) => {
  try {
    // Extract patient ID from the request parameters
    const patientId = req.query.patientId;

    // Get the patient by ID using the service
    const patient = await patientService.getPatientById(patientId);

    // Check if the patient exists
    if (!patient) {
      // If patient not found, return a not found response
      const errorMessage = constants.PATIENT_NOT_FOUND;
      return res.status(constants.NOT_FOUND).json(errorResponse(errorMessage));
    }

    // Success response with the retrieved patient and the custom success message
    return res.status(constants.SUCCESS).json(successResponse(constants.PATIENT_RETRIEVED_SUCCESSFULLY, patient));
  } catch (error) {
    // Determine error message and send an appropriate response
    const errorMessage = error.message || constants.INTERNAL_SERVER_ERROR;
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(errorMessage));
  }
};
