import MainHeaders from "../../components/mainHeaders/mainHeaders";
import { Link, useNavigate, useParams } from "react-router-dom";
import { amenityIcons } from "../../icons/amenitiesIcons";
import RoomCardSkeleton from "../../components/skeletons/roomCardSkeleton";

export default function MainHotelRooms(props) {
  const navigate = useNavigate();

  const { hotel_id } = useParams();

  const rooms = props.rooms;

  const loading = props?.loading;

  const roomLists = rooms?.length >= 4 ? rooms?.slice(0, 4) : rooms;

  return (
    <div className="flex flex-col">
      <MainHeaders Headers={"Rooms & Prices"} />
      <div className="flex flex-col px-28 pt-10 gap-6 ">
        {loading
          ? [1, 2, 3, 4].map(() => <RoomCardSkeleton />)
          : roomLists?.map((room) => (
              <div
                className=" rounded-lg shadow-md border flex gap-6 cursor-pointer "
                key={room.room_id}
              >
                <div className="h-[14rem] w-[30rem]">
                  <img
                    className="rounded-l-lg h-full w-full object-cover "
                    src={room?.other_pictures[0]?.room_picture}
                    alt="hehe"
                  ></img>
                </div>
                <Link
                  className="w-[50%]  m-4"
                  to={`/mainHotel/${room.hotel_id}/room/${room.room_id}`}
                  key={room.room_id}
                >
                  <div className=" ">
                    <div className="">
                      <h1 className="text-2xl text-violet-950 font-bold">
                        {room?.room_type.type_name}
                      </h1>
                    </div>
                    <div className="text-sm mt-2 text-gray-500 font-semibold overflow-hidden line-clamp-4">
                      <p>{room.description}</p>
                    </div>
                    <div className="flex gap-6 mt-6 font-semibold items-center">
                      {room.room_amenities?.slice(0, 5).map((amen) => (
                        <span className="flex gap-1 items-center" key={amen}>
                          {amenityIcons[amen]} {amen}
                        </span>
                      ))}
                      {room.room_amenities.length > 5 && (
                        <div className=" rounded-full p-1 bg-gray-100 text-xs ">
                          <p className="font-semibold">
                            +{room?.room_amenities?.length - 5}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <div className=" flex items-center justify-center pr-4 m-4 w-[20%]">
                  <div className="border-2 border-green-400 p-4 text-sm font-semibold rounded-lg w-full">
                    <h2 className="text-xl text-violet-950 font-bold">Price</h2>
                    <p>Starting from NPR {room.price_per_night} </p>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {roomLists?.length === 4 && (
        <div
          className="flex justify-center items-center cursor-pointer mt-10"
          onClick={() => navigate(`/mainHotel/${hotel_id}/filterRooms`)}
        >
          <div className="p-2 bg-violet-950 text-white font-semibold transform hover:scale-105 transition-transform duration-300 ease-in">
            <p>Load more</p>
          </div>
        </div>
      )}
    </div>
  );
}
