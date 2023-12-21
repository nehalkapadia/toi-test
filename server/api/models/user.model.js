// models/user.model.js

module.exports = (sequelize, Sequelize) => {
  const Role = require('./roles.model')(sequelize, Sequelize);
  const Organization = require('./organization.model')(sequelize, Sequelize);
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id',
        },
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      oauthProvider: {
        type: Sequelize.STRING,
      },
      oauthId: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
      loginActivity: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
    },
    { timestamps: true }
  );
  User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });
  User.belongsTo(Organization, {
    foreignKey: 'organizationId',
    as: 'organization',
  });
  User.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'createBy',
  });
  
  User.belongsTo(User, {
    foreignKey: 'updatedBy',
    as: 'updateBy',
  });
  return User;
};
