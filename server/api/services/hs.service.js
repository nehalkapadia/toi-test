const { error } = require('cli');
const db = require('../models');
const { Op } = require('sequelize');
const HsEligibility = db.HsEligibility;

async function searchPatient(criteria) {
  try {
    let whereClause = {};
    if(criteria?.hsMemberID) {
      whereClause = {
        [Op.or]: [
          {
            [Op.and]: [
              { First_Name: criteria.firstName },
              { Last_Name: criteria.lastName },
              { DOB: criteria.dob },
              { Gender: criteria.gender },
            ],
          },
          { HS_Member_ID: criteria.hsMemberID },
        ],
      };
    } else {
      whereClause = {
        [Op.and]: [
          { First_Name: criteria.firstName },
          { Last_Name: criteria.lastName },
          { DOB: criteria.dob },
          { Gender: criteria.gender },
        ],
      }
    }
    const existingPatient = await HsEligibility.findOne({
      where: whereClause
    });
    return existingPatient;
  } catch (error) {
    throw error;
  }
}

async function getDetailByMemberID(hsMemberID) {
  try {
    const whereClause = {
      HS_Member_ID: hsMemberID
    }
    const existingPatient = await HsEligibility.findOne({
      where: whereClause
    });
    return existingPatient;
  } catch(error) {
    throw error;
  }
}


module.exports = {
  searchPatient,
  getDetailByMemberID
};
