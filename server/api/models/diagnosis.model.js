// Diagnosis.js
module.exports = (sequelize, Sequelize) => {
  const Diagnosis = sequelize.define('DiagnosisCodes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ICDCode: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
  }, { timestamps: true });

  return Diagnosis;
};
