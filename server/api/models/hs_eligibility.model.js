// models/hs_Eligibility.model.js

module.exports = (sequelize, Sequelize) => {
  const HsEligibility = sequelize.define(
    'HS_Eligibility',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      HS_Member_ID: {
        type: Sequelize.STRING
      },
      MBI_Number: {
        type: Sequelize.STRING,
      },
      PBP: {
        type: Sequelize.STRING,
      },
      First_Name: {
        type: Sequelize.STRING,
      },
      Last_Name: {
        type: Sequelize.STRING,
      },
      DOB: {
        type: Sequelize.STRING,
      },
      Gender: {
        type: Sequelize.STRING,
      },
      Preferred_Language: {
        type: Sequelize.STRING,
      },
      Member_Effective_Date: {
        type: Sequelize.STRING,
      },
      Member_Address1: {
        type: Sequelize.STRING,
      },
      Member_Address2: {
        type: Sequelize.STRING,
      },
      Member_City: {
        type: Sequelize.STRING,
      },
      Member_State: {
        type: Sequelize.STRING,
      },
      Member_ZipCode: {
        type: Sequelize.STRING,
      },
      Member_Home_Phone: {
        type: Sequelize.STRING,
      },
      Member_Cell_Phone: {
        type: Sequelize.STRING,
      },
      Member_Email: {
        type: Sequelize.STRING,
      },
      Member_Term_Date: {
        type: Sequelize.STRING,
      },
      PCP_NPI_Number: {
        type: Sequelize.STRING,
      },
      HS_PCP_Number: {
        type: Sequelize.STRING,
      },
      PCP_Office_Address1: {
        type: Sequelize.STRING,
      },
      PCP_Office_Address2: {
        type: Sequelize.STRING,
      },
      PCP_Office_City: {
        type: Sequelize.STRING,
      },
      PCP_Office_State: {
        type: Sequelize.STRING,
      },
      PCP_Zip: {
        type: Sequelize.STRING,
      },
      PCP_Office_Phone: {
        type: Sequelize.STRING,
      },
    }, { freezeTableName: true, timestamps: true } 
  );
  return HsEligibility
};
