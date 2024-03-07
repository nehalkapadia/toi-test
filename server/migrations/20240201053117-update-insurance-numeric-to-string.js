'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('InsuranceInfos', 'primarySubscriberNumber', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'primaryGroupNumber', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'secondarySubscriberNumber', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'secondaryGroupNumber', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('InsuranceInfos', 'primarySubscriberNumber', {
      type: Sequelize.BIGINT,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'primaryGroupNumber', {
      type: Sequelize.BIGINT,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'secondarySubscriberNumber', {
      type: Sequelize.BIGINT,
    });

    await queryInterface.changeColumn('InsuranceInfos', 'secondaryGroupNumber', {
      type: Sequelize.BIGINT,
    });
  },
};
