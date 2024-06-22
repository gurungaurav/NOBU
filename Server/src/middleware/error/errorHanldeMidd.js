// errorHandlerMidd.js

const errorHandlerMidd = (e, req, res, next) => {
  // const{message,status} = e
  console.log('Error:', e);

  const errorMessage = e?.message || 'Something went wrong';
  const statusCode = e.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};

module.exports = errorHandlerMidd;
