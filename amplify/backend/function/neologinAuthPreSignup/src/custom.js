exports.handler = (event, context, callback) => {
  // Confirm the user
  event.response.autoConfirmUser = true;
  // insert code to be executed by your lambda trigger
  callback(null, event);
};
