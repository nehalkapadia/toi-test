// use event library
const Event = require("events");
const eventEmitter = new Event.EventEmitter();
const orderService = require("../services/order.service");

eventEmitter.on("SubmitOrderToSalesForce", (data) => {
    try {

        // @TODO: here we will implement the logic of sending data to salesforce api

        // when we get  success response from salesforce set the flag as true
        orderService.updateOrderInfo(
            data.orderId,
            { "salesForceSyncUp": true }
        );
    } catch (error) {
        // Handle the error or throw it to be caught in the controller
        console.log(error);
        throw error;
    }
});