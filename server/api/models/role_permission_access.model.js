
module.exports = (sequelize, Sequelize) => {
  const RolePermissionAccess = sequelize.define('RolePermissionAccess', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    permissionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Permissions',
        key: 'id',
      },
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    moduleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Modules',
        key: 'id',
      },
    },
    createdBy: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, { timestamps: true });

  return RolePermissionAccess;
};
