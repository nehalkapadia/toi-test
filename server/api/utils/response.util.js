// Success Response
exports.successResponse = (message, data) => {
    return {
      status: true,
      message: message,
      data: data,
    };
  };
  
  // Error Response
  exports.errorResponse = (message, data) => {
    return {
      status: false,
      message: message ? message : 'Something went wrong!',
      data: data,
    };
  };
  