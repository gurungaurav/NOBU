const successHandler = (res, status, data = {}, message) => {
  const statusCode = status || 200;

  return res.status(statusCode).send({
    success: true,
    message,
    data,
  });
};

module.exports = successHandler;
