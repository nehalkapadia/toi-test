// constants
const constants = require('../utils/constants.util');
const { errorResponse, successResponse } = require('../utils/response.util');
const organizationService = require('../services/organization.service');
const auditService = require('../services/audit_log.service');
const { createOrganizationLog } = require('../services/organization_log.service');

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Organization List
 * @api /api/organizations/list
 * @method POST
 */
exports.list = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'POST');
    const page = parseInt(req?.body?.page);
    const perPage = parseInt(req?.body?.perPage);
    const order = {
      orderBy: req?.body?.orderBy ? req?.body?.orderBy : 'updatedAt',
      ascending: req?.body?.ascending ? req?.body?.ascending : false,
    };
    const filters = req?.body?.filters;
    const searchText = req?.body?.searchText;

    const organizationList = await organizationService.list({
      page,
      perPage,
      order,
      filters,
      searchText,
    });

    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message(constants.organizationModule, 'List'),
          organizationList
        )
      );
  } catch (error) {
    await auditService.createLog(req, 'Organizations', 'POST', error);
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(
          constants.message(constants.organizationModule, 'List', false),
          error?.message
        )
      );
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Organization Detail
 * @api /api/organizations/:id
 * @method GET
 */
exports.detail = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'GET');
    const organizationDetail = await organizationService.detail(req.params.id);
    if (!organizationDetail) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.notFound(constants.organizationModule)));
    }
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message(constants.organizationModule, 'Detail'),
          organizationDetail
        )
      );
  } catch (error) {
    await auditService.createLog(req, 'Organizations', 'GET', error);
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(
          constants.message(constants.organizationModule, 'Detail', false),
          error?.message
        )
      );
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Organization Create
 * @api /api/organizations
 * @method POST
 */
exports.create = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'POST');

    const reqData = req.body;
    const { id } = req.userData;

    if(reqData.name.toLowerCase() === 'toi') {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.WONT_CREATE_ORGANIZATION_WITH_NAME_TOI));
    }

    // email already exist
    const isEmailExist = await organizationService.findByEmail(reqData.email);
    if (isEmailExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.alreadyExist('Email')));
    }

    // phone number already exist
    const isPhoneExist = await organizationService.findByPhoneNumber(
      reqData.phoneNumber
    );
    if (isPhoneExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.alreadyExist('Phone Number')));
    }

    if (id) {
      reqData.createdBy = id;
      reqData.updatedBy = id;
    }

    const createdOrganization = await organizationService.createOrganization(reqData);
    if(createdOrganization) {
      reqData.recordId = createdOrganization.id;
      reqData.createdBy = id;
      reqData.action = 'Create';
      createOrganizationLog(reqData)
    }
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message(constants.organizationModule, 'Create'),
          createdOrganization
        )
      );
  } catch (error) {
    await auditService.createLog(req, 'Organizations', 'POST', error);
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(
          constants.message(constants.organizationModule, 'Create', false),
          error?.message
        )
      );
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Organization Update
 * @api /api/organizations/:id
 * @method PUT
 */
exports.update = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'PUT');

    const reqData = req.body;
    const { id } = req.userData;
    const orgId = req.params.id;

    if(reqData.name.toLowerCase() === 'toi') {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.WONT_UPDATE_ORGANIZATION_WITH_NAME_TOI));
    }
    const isEmailExist =
      await organizationService.isEmailExistWithOtherOrganization(
        orgId,
        reqData.email
      );

    // email already exist with other user
    if (isEmailExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(
          errorResponse(constants.EMAIL_ALREADY_EXIST_WITH_OTHER_ORGANIZATION)
        );
    }

    const isPhoneExist =
      await organizationService.isPhoneNumberExistWithOtherOrganization(
        orgId,
        reqData.phoneNumber
      );

    // phone number already exist with other user
    if (isPhoneExist) {
      return res
        .status(constants.BAD_REQUEST)
        .json(
          errorResponse(
            constants.PHONE_NUMBER_ALREADY_EXIST_WITH_OTHER_ORGANIZATION
          )
        );
    }

    if (id) {
      reqData.updatedBy = id;
    }

    const organizationDetail = await organizationService.detail(orgId);
    if (!organizationDetail) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.notFound(constants.organizationModule)));
    }
    await organizationService.updateOrganization(orgId, req.body);
    if(reqData) {
      reqData.recordId = orgId;
      reqData.createdBy = id;
      reqData.action = 'Update';
      createOrganizationLog(reqData)
    }
    return res.json(
      successResponse(constants.message(constants.organizationModule, 'Update'))
    );
  } catch (error) {
    await auditService.createLog(req, 'Organizations', 'PUT', error);
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(
          constants.message(constants.organizationModule, 'Update', false),
          error?.message
        )
      );
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @description Organization Delete
 * @api /api/organizations/:id
 * @method DELETE
 */
exports.delete = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'DELETE');
    const organizationDetail = await organizationService.detail(req.params.id);
    if (!organizationDetail) {
      return res
        .status(constants.BAD_REQUEST)
        .json(errorResponse(constants.notFound(constants.organizationModule)));
    }
    await organizationService.deleteOrganization({ id: req.params.id });
    return res
      .status(constants.SUCCESS)
      .json(
        successResponse(
          constants.message(constants.organizationModule, 'Delete')
        )
      );
  } catch (error) {
    await auditService.createLog(req, 'Organizations', 'DELETE', error);
    return res
      .status(constants.INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(
          constants.message(constants.organizationModule, 'Delete', false),
          error?.message
        )
      );
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get user based on organization
 * @api /api/organizations/user/list
 * @method GET
 */
exports.getOrganizationUsers = async (req, res) => {
  try {
    await auditService.createLog(req, 'Organizations', 'User List');
    const userData = req?.userData;
    const organizationId = req.query.organizationId ? req.query.organizationId : userData?.user?.organizationId;
    const userList = await organizationService.getUserList(organizationId);
    return res.status(constants.SUCCESS).json(successResponse(constants.message('Organization', 'User List'), userList))
  } catch(error) {
    await auditService.createLog(req, 'Organizations', 'User List', error);
    return res.status(constants.INTERNAL_SERVER_STATUS).json(errorResponse(constants.message(constants.organizationModule, 'User List', false), error))
  }
}