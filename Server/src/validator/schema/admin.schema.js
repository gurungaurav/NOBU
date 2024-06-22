const yup = require("yup");

const addAmenitiesValidSchema = yup.object({
  body: yup.object({
    amenities: yup.array().required("Please provide amenity "),
  }),
  // params:{
  //     user_id: yup.number("User id must be on integer data type").required("Please provide the user id ")
  // }
});

const addAmenitiesSingleSchema = yup.object({
  body: yup.object({
    amenity: yup.string().required("Please provide amenity "),
  }),
});

const addRoomTypesValidSchema = yup.object({
  body: yup.object({
    room_Type: yup
      .string("Room Types name should be on string datatype")
      .required("Please provide room type "),
  }),
});

const addBedTypesValidSchema = yup.object({
  body: yup.object({
    bed_type: yup
      .string("Bed Types name should be on string datatype")
      .required("Please provide room type "),
    capacity: yup
      .number("Capacity  should be on integer datatype")
      .min(1, "Bed type capacity should be more than one please")
      .required("Please provide the capacity of the room type "),
  }),
});

module.exports = {
  addAmenitiesValidSchema,
  addRoomTypesValidSchema,
  addBedTypesValidSchema,
  addAmenitiesSingleSchema,
};
