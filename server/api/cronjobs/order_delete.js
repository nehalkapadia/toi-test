// order_delete.js

const cron = require('node-cron');
const moment = require('moment');
const orderService = require('../services/order.service');

function scheduleDeleteOrderCronJob() {
  // Schedule a cron job to run every day at midnight (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    try {
      // Calculate the date exactly one month ago using moment
      const oneMonthAgo = moment().subtract(1, 'months').toDate();

      console.log(oneMonthAgo);
      const deleteRecords = await orderService.deleteMany(oneMonthAgo)
      console.log('deleteRecords', deleteRecords);

      console.log('Records deleted successfully.');
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  });
}

module.exports = { scheduleDeleteOrderCronJob };
