const UserModel = require('../models/user.model')

exports.findByEmail = async (email) => {
    return await UserModel.findOne({
        where: { email: email }
    })
}