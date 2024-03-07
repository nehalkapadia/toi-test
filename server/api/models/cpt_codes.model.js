module.exports = (sequelize, Sequelize) => {
  const CPTCode = sequelize.define(
    'CPT_Code',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CPTCode: {
        type: Sequelize.STRING(10),
      },
      Description: {
        type: Sequelize.STRING,
      },
    },
    { freezeTableName: true, timestamps: true }
  );

  return CPTCode;
};
