import { BiUser } from "react-icons/bi";
import billie from "../../assets/bill.png";
import { Fragment, useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import RoomPhotos from "../../features/mainRooms/roomPhotos";
import { getVendorHotelSpecific } from "../../services/vendor/vendor.service";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";

export default function VendorSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //!Room pictures name is given cuz the component which shows the pictures the props are kept as rooom pictures so yeah lol
  const [roomPictures, setRoomPictures] = useState([]);
  const [hotelDetails, setHotelDetails] = useState({});

  const viewImage = () => {
    setIsDialogOpen(true);
  };

  const { hotel_name } = useParams();

  const { jwt } = useSelector((state) => state.user);

  const getSingleHotel = async () => {
    try {
      const res = await getVendorHotelSpecific(hotel_name, jwt);
      console.log(res.data);
      setHotelDetails(res.data.data);
      setRoomPictures(res.data.data.other_pictures);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSingleHotel();
  }, []);

  return (
    <div className="px-6 py-8 w-full h-full">
      <div className="bg-white rounded-lg  flex w-full ">
        <div className="w-[20%] h-fit sticky top-20">
          <div className="flex flex-col gap-2 border-b px-6 py-6">
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-sm  text-gray-400">
              Here you can edit your hotel details
            </p>
          </div>
          <div className="px-6 py-6 flex gap-2 items-center">
            <BiUser />
            <p>General</p>
          </div>
          <div className="px-6 py-6 flex gap-2 items-center justify-center w-full">
            <Menu as="div" className="relative text-left ">
              <div className="">
                <Menu.Button className="inline-flex  bg-violet-950 justify-center w-full rounded-md border  shadow-sm px-4 py-2 text-sm font-medium text-white  hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Edit Details
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/vendor/${hotel_name}/updateHotel`}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block px-4 py-2 text-sm`}
                      >
                        Change general details
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/vendor/${hotel_name}/updateHotelPictures`}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block px-4 py-2 text-sm`}
                      >
                        Change pictures
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="w-[80%] border-l">
          <div className="px-6 py-10">
            <div>
              <h1 className="text-xl font-semibold">General Settings</h1>
              <p className="text-sm  text-gray-400">
                These settings helps you modify site settings.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Hotel name</p>
                <p className="">{hotelDetails?.hotel_name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Hotel Address</p>
                <p className="">{hotelDetails?.location}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Phone Number</p>
                <p className="">{hotelDetails?.phone_number}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Email Address</p>
                <p className="">{hotelDetails?.email}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Hotel Ratings</p>
                <p className="">{hotelDetails?.ratings}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Description</p>
                <p className="w-[40rem]">{hotelDetails?.description}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Hotel Main Picture</p>

                <div
                  className="overflow-hidden rounded-lg "
                  onClick={viewImage}
                >
                  <img
                    src={hotelDetails?.main_picture}
                    className="w-[16rem] h-[13rem] rounded-lg object-cover cursor-pointer hover:opacity-90 hover:scale-105 duration-500"
                  ></img>
                </div>
                <Dialog
                  className="absolute w-full h-full "
                  style={{ backgroundColor: "transparent" }}
                  open={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  maxWidth="lg"
                >
                  <div className="h-[40rem]">
                    <img
                      className="w-full h-full object-cover"
                      src={hotelDetails?.main_picture}
                      alt="Profile"
                    />
                  </div>
                </Dialog>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Hotel Main Picture</p>
                <div className="w-[70%]">
                  <RoomPhotos roomPictures={roomPictures} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
