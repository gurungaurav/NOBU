import TextField from "@mui/material/TextField";

export default function BasicInformationStep({ formik }) {
  return (
    <div className="mt-8">
      <div className="text-2xl mb-6 font-semibold">
        Step 1: Basic Information
      </div>
      <div className="grid grid-cols-2 gap-6">
        <TextField
          fullWidth
          id="hotel_name"
          name="hotel_name"
          label="Hotel Name"
          value={formik.values.hotel_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.hotel_name && Boolean(formik.errors.hotel_name)}
          helperText={formik.touched.hotel_name && formik.errors.hotel_name}
        />
        <TextField
          fullWidth
          id="phone_number"
          name="phone_number"
          label="Phone Number"
          type="number"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <TextField
          fullWidth
          id="location"
          name="location"
          label="Location"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
        />
        <TextField
          fullWidth
          id="ratings"
          name="ratings"
          label="Ratings"
          type="number"
          value={formik.values.ratings}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ratings && Boolean(formik.errors.ratings)}
          helperText={formik.touched.ratings && formik.errors.ratings}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </div>
      <textarea
        className="border-2  p-2 outline-blue-500 mt-6 w-full h-[10rem] rounded-md "
        placeholder="Write a description about your hotel..."
        id="description"
        name="description"
        label="Description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
      />
      <p className="text-red-400">
        {formik.touched.description && formik.errors.description}
      </p>
    </div>
  );
}
