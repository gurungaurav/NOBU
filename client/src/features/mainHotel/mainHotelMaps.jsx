import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function MainHotelMaps(props) {
  return (
    <div className="flex items-center justify-center ">
      <div className="flex  bg-violet-950  text-white w-[80%]  ">
        <div style={{ width: "60%" }}>
          <iframe
            className=" w-full"
            title="Google Maps"
            height="500"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Pokhara,Nepal+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          >
            <a href="https://www.maps.ie/population/">
              Population Estimator map
            </a>
          </iframe>
        </div>
        <div className="flex flex-col   w-[40%] p-16 gap-10">
          <div className="flex gap-2 items-center">
            <IoLocationSharp className="text-2xl" />
            <div className="flex flex-col">
              <h1 className="font-semibold  text-xl">Address</h1>
              <p className="text-gray-400">{props?.Location}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <FaPhoneAlt className="text-xl" />
            <div className="flex flex-col">
              <h1 className="font-semibold  text-xl">Phone</h1>
              <p className="text-gray-400">{props?.Phone}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <MdEmail className="text-2xl" />
            <div className="flex flex-col">
              <h1 className="font-semibold  text-xl">Email</h1>
              <p className="text-gray-400">{props?.Email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
