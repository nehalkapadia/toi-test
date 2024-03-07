const cronJob = require("node-cron");
const orderService = require("../services/order.service");
const eventEmitter = require("../handlers/event_emitter");

// This cron-jon is running after every 30 mins.
module.exports = cronJob.schedule(
    "*/30 * * * *",
    async () => {
        try {
            const failedOrders = await orderService.getSalesForceFailedSyncUpOrders();

            for (const failedOrder of failedOrders) {
                eventEmitter.emit("SubmitOrderToSalesForce", failedOrder);
            }
        } catch (err) {
            console.log('Failed to process failed orders for Salesforce sync-up:', err);
        }
    },
    { scheduled: true, timezone: "America/Los_Angeles" }
);
