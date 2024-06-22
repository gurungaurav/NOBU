import { Dialog } from "@mui/material";
import PropTypes from "prop-types";

//!Will not use this
export default function MainPictureDiaglog({
  image,
  setIsDialogOpen,
  isDialogOpen,
}) {
  return (
    <div>
      <Dialog
        className="absolute w-full h-full  "
        style={{ backgroundColor: "transparent" }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <div className=" flex  items-center ">
          <img
            className="w-[40rem] h-[40rem]  object-cover"
            src={image}
            alt="Profile"
          />
        </div>
      </Dialog>
    </div>
  );
}

MainPictureDiaglog.propType = {
  image: PropTypes.string.isRequired,
};
