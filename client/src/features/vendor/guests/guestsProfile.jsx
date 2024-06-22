import bill from "../../../assets/bill.png";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import PropTypes from "prop-types";

export default function GuestsProfile({ userDetails }) {
  console.log(userDetails);
  return (
    <>
      <div className="w-full items-center justify-center flex">
        <div className="flex flex-col items-center gap-2">
          <img
            className="w-32 h-32 rounded-full object-cover"
            src={userDetails?.profile_picture}
          ></img>
          <p className="font-semibold ">{userDetails?.user_name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 px-4 text-sm mt-8">
        <div className="flex gap-4 items-center text-violet-950 font-semibold">
          <div className="p-2 rounded-full border-2  border-violet-950 ">
            <FaPhoneAlt />
          </div>
          <p> +{userDetails?.phone_number}</p>
        </div>
        <div className="flex gap-4 items-center text-violet-950 font-semibold">
          <div className="p-2 rounded-full border-2  border-violet-950 ">
            <MdEmail />
          </div>
          <p>{userDetails?.email}</p>
        </div>
      </div>
    </>
  );
}

GuestsProfile.propTypes = {
  userDetails: PropTypes.object.isRequired,
};
