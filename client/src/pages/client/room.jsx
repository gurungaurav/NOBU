import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error404 from "../../components/error/error404";
import RoomPhotos from "../../features/mainRooms/roomPhotos";
import RoomBody from "../../features/mainRooms/roomBody";
import { getSingleRoomDetails } from "../../services/hotels/hotels.service";

export default function Room() {
  const { hotel_id, room_id } = useParams();
  const [loading, setLoading] = useState(true);

  const [roomDetails, setRoomDetails] = useState();

  // const roomPictures = roomDetails && roomDetails.other_pictures.slice(0,4)
  const navigate = useNavigate();

  const getRoom = async () => {
    try {
      const res = await getSingleRoomDetails(hotel_id, room_id);
      console.log(res.data);
      setRoomDetails(res.data.data);
      setLoading(false);
      console.log("new fetched");
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      console.log(e.response.data.message);
      if (e.response.status) {
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    getRoom();
  }, [hotel_id, room_id]);

  const roomPictures = roomDetails && roomDetails?.other_pictures;

  return (
    <div>
      {/* {roomDetails ? ( */}
      <div className="flex flex-col pt-5 pl-20 pr-20 ">
        <RoomPhotos roomPictures={roomPictures} loading={loading} />
        <RoomBody
          roomDetails={roomDetails}
          loading={loading}
          callBackFetch={getRoom}
        />
      </div>
      {/* ) : (
        <Error404 Error={"No room's found"} />
      )} */}
    </div>
  );
}
