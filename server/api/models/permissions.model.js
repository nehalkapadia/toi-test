
module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permissionName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    create: {
      type: Sequelize.BOOLEAN,
    },
    view: {
      type: Sequelize.BOOLEAN,
    },
    edit: {
      type: Sequelize.BOOLEAN,
    },
    delete: {
      type: Sequelize.BOOLEAN,
    },
    category: {
      type: Sequelize.STRING,
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

  return Permission;
};
