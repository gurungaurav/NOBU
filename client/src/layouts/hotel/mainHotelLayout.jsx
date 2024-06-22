import React, { useEffect, useState } from "react";
import VendorNavbar from "../../components/navbar/vendor/vendorNavbar";
import Footer from "../../components/footer/footer";
import LiveChat from "../../components/chat/liveChat";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelByHotelId } from "../../services/hotels/hotels.service";
import { useSelector } from "react-redux";

export default function MainHotelLayout({ children }) {
  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  const [hotel, setHotel] = useState(false);
  const { role } = useSelector((state) => state.user);
  console.log(role);
  const { hotel_id } = useParams();
  const navigate = useNavigate();
  const checkHotel = async () => {
    try {
      const res = await getHotelByHotelId(hotel_id);
      console.log(res.data);
      setHotel(true);
    } catch (e) {
      if (e.response.status === 404 || e.response.status === 500) {
        navigate(-1);
      }
      console.log(e);
    }
  };

  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    checkHotel();
  }, []);

  // if (!hotel) {
  //   return <Error404 Error={"No hotel's found!"} />;
  // } else {
  return (
    <div className="flex flex-col ">
      <VendorNavbar />
      {children}
      <Footer />
      {id && role !== "admin" && (
        <div className="fixed bottom-10 right-10 z-50 ">
          <LiveChat />
        </div>
      )}
      {/* <div
          className=" fixed text-white bottom-20 right-10 p-3 text-xl bg-violet-950 rounded-full border-2 z-30 hover:bg-violet-800 cursor-pointer"
          onClick={scrollToTop}
        >
          <IoIosArrowUp />
        </div> */}
    </div>
  );
  // }
}
