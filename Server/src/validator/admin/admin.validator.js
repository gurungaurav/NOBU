class AdminValidator {
  addAmenitiesValidator = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        // params:req.params
      });
      next();
    } catch (e) {
      next(e);
    }
  };

  addRoomTypesValidator = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
      });
      next();
    } catch (e) {
      next(e);
    }
  };

  addBedTypesValidator = (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
}

const adminValidator = new AdminValidator();
module.exports = adminValidator;
