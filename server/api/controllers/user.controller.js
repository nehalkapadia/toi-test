// constants
const constants = require('../utils/constants.util');
const userService = require('../services/user.service');
const auditService = require('../services/audit_log.service');
const { errorResponse, successResponse } = require('../utils/response.util');
const { createUserLog } = require('../services/user_log.service');
const { formatRequest } = require('../utils/common.util');
const eventEmitter = require('../handlers/event_emitter');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @description User List
 * @api /api/users
 * @method POST
 */
exports.list = async (req, res, next) => {
  try {
    const userList = await userService.list();
    return res.json(
      successResponse(
        constants.message(constants.userModule, 'List fetched'),
        userList
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'List fetching', false),
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
 * @description User List with filters
 * @api /api/users/list
 * @method POST
 */
exports.allList = async (req, res) => {
  try {
    await auditService.createLog(formatRequest(req), 'Users', 'POST');
    const page = parseInt(req?.body?.page);
    const perPage = parseInt(req?.body?.perPage);
    const order = {
      orderBy: req?.body?.orderBy ? req?.body?.orderBy : 'updatedAt',
      ascending: req?.body?.ascending ? req?.body?.ascending : false,
    };
    const filters = req?.body?.filters;
    const searchText = req?.body?.searchText;
    const organizationId = req?.body?.organizationId;

    const userList = await userService.allList({
      page,
      perPage,
      order,
      filters,
      searchText,
      organizationId,
    });
    return res.json(
      successResponse(
        constants.message(constants.userModule, 'List fetched'),
        userList
      )
    );
  } catch (error) {
    await auditService.createLog(formatRequest(req), 'Users', 'POST', error);
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'List fetching', false),
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
 * @description User Detail
 * @api /api/users/:id
 * @method GET
 */
exports.detail = async (req, res) => {
  try {
    await auditService.createLog(formatRequest(req), 'Users', 'GET');
    const userDetail = await userService.detail(req.params.id);
    if (!userDetail) {
      return res.json(errorResponse(constants.notFound(constants.userModule)));
    }
    return res.json(
      successResponse(
        constants.message(constants.userModule, 'Detail fetched'),
        userDetail
      )
    );
  } catch (error) {
    await auditService.createLog(formatRequest(req), 'Users', 'GET', error);
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'Detail fetching', false),
        error?.message
      )
    );
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description User Create
 * @api /api/users
 * @method POST
 *
 */
exports.create = async (req, res) => {
  try {
    await auditService.createLog(formatRequest(req), 'Users', 'POST');
    const reqData = req?.body;
    const id = req?.userData?.id;

    const userDetail = await userService.findByEmail(req.body.email);
    if (userDetail) {
      return res.json(
        errorResponse(constants.alreadyExist(constants.userModule))
      );
    }
    if (id) {
      reqData.createdBy = id;
      reqData.updatedBy = id;
    }
    if(reqData.orderingProvider) {
      // Check if the orderingProvider is active in another organization
      const orderingProviderInfo = await userService.getOrderingProviderInfo(
        req.body.orderingProvider,
        req.body.organizationId // Pass the organization ID
      );

      // Check if the orderingProvider is active in another organization
      if (
        orderingProviderInfo &&
        orderingProviderInfo.organization &&
        orderingProviderInfo.isActive
      ) {
        return res.json(
          errorResponse(
            constants.ORDER_PROVIDER_ALREADY_ASSOCIATED(
              orderingProviderInfo.organization.name // Provide the organization name in the error message
            )
          )
        );
      }

      // Check if the orderingProvider exists in the same organization
      const orderingProviderExists =
        await userService.orderingProviderExistsInOrganization(
          req.body.orderingProvider,
          req.body.organizationId
        );

      if (orderingProviderExists) {
        return res.json(
          errorResponse(constants.ORDER_PROVIDER_EXISTS_IN_SAME_ORGANIZATION)
        );
      }
    }

    const createdUser = await userService.createUser(req.body);
    if (createdUser) {
      // send the user registration email
      eventEmitter.emit('SendUserRegistrationEmail', createdUser);

      reqData.recordId = createdUser.id;
      reqData.action = 'Create';
      reqData.createdBy = id;
      delete reqData.updatedBy;
      await createUserLog(reqData);
    }
    return res.json(
      successResponse(
        constants.message(constants.userModule, 'Created'),
        createdUser
      )
    );
  } catch (error) {
    auditService.createLog(formatRequest(req), 'Users', 'POST', error);
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'Creation', false),
        error?.message
      )
    );
  }
};

/**
 * @param {*} req
 * @param {*} res
 * @returns
 * @description User Update
 * @api /api/users/:id
 * @method PUT
 *
 */
exports.update = async (req, res) => {
  try {
    await auditService.createLog(formatRequest(req), 'Users', 'PUT');
    const reqData = req.body;
    const userId = req.params.id;
    const { id } = req.userData;

    // check user exist or not
    const userDetail = await userService.detail(req.params.id);
    if (!userDetail) {
      return res.json(errorResponse(constants.notFound(constants.userModule)));
    }

    // check email exist or not with other user
    const isEmailExist = await userService.isEmailExistWithOtherUser(
      userId,
      req.body.email
    );
    if (isEmailExist) {
      return res.json(
        errorResponse(constants.EMAIL_ALREADY_EXIST_WITH_OTHER_USER)
      );
    }

    if (id) {
      reqData.updatedBy = id;
    }

    // Check if the user is associated with certain organizations and orderingProvider is being updated
    if (userDetail.orderingProvider && reqData.isActive) {
      const isAlreadyExistOrderingProvider = await userService.getOrderingProviderInfo(
        userDetail.orderingProvider, userDetail.organizationId
      )
      if (isAlreadyExistOrderingProvider) {
        return res.json(
          errorResponse(constants.ORDER_PROVIDER_ALREADY_ASSOCIATED(
            isAlreadyExistOrderingProvider.organization.name // Provide the organization name in the error message
          ))
        );
      }
      const isOrderingProviderExist = await userService.checkIfActiveOrderingProviderExists(
        userDetail
      )
      if (isOrderingProviderExist) {
        return res.json(
          errorResponse(constants.ORDER_PROVIDER_EXISTS_IN_SAME_ORGANIZATION)
        );
      }
    }

    await userService.updateUser(req.params.id, req.body);
    if (reqData) {
      reqData.recordId = req?.params?.id;
      reqData.action = 'Update';
      reqData.createdBy = id;
      delete reqData.id;
      await createUserLog(reqData);
    }
    return res.json(
      successResponse(constants.message(constants.userModule, 'Updated'))
    );
  } catch (error) {
    await auditService.createLog(formatRequest(req), 'Users', 'PUT', error);
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'Updation', false),
        error?.message
      )
    );
  }
};

/*
    User Delete
    API URL = /users/:id
    Method = DELETE
*/
exports.delete = async (req, res) => {
  try {
    await auditService.createLog(formatRequest(req), 'Users', 'DELETE');
    const userDetail = await userService.detail(req.params.id);

    if (!userDetail) {
      return res.json(errorResponse(constants.notFound(constants.userModule)));
    }
    await userService.deleteUser({ id: req.params.id });
    return res.json(
      errorResponse(constants.message(constants.userModule, 'Deleted'))
    );
  } catch (error) {
    await auditService.createLog(formatRequest(req), 'Users', 'DELETE', error);
    return res.json(
      errorResponse(
        constants.message(constants.userModule, 'Deletion', false),
        error?.message
      )
    );
  }
};
