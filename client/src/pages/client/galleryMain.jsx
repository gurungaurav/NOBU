import { Fragment, useEffect, useState } from "react";
import bill from "../../assets/bill.png";
import { getGallery } from "../../services/client/user.service";
import { useParams } from "react-router-dom";
import RoomAllPhotos from "../../features/mainRooms/roomAllPhotos";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";

export default function GalleryMain() {
  const [allGallery, setAllGallery] = useState([]);
  const { hotel_id } = useParams();
  const [openDialogModal, setOpenDialogModal] = useState(false);

  const getAllHotelPictures = async () => {
    try {
      const res = await getGallery(hotel_id);
      console.log(res.data);
      setAllGallery(res.data.data.pictures);
    } catch (e) {
      console.log(e);
    }
  };

  const openModal = () => {
    setOpenDialogModal(true);
  };

  const closeModal = () => {
    setOpenDialogModal(false);
  };

  useEffect(() => {
    getAllHotelPictures();
  }, []);
  return (
    <div className="py-6 md:mx-24 lg:mx-32 ">
      <div className="mx-auto grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
        {allGallery?.map((image, index) => (
          <img
            onClick={openModal}
            key={index}
            src={image.room_picture}
            alt="hehe"
            className={`hover:opacity-90 duration-300 cursor-pointer aspect-square object-cover h-full min-h-48 w-full rounded shadow-sm dark:bg-gray-500 ${
              index % 3 === 0 ? "col-span-2 row-span-2  " : ""
            }`}
          />
        ))}
      </div>
      <Transition appear show={openDialogModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="  max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <RoomAllPhotos images={allGallery} />
                  <button
                    type="button"
                    className="text-2xl  absolute top-4 right-4 text-white cursor-pointer z-20"
                    onClick={closeModal}
                  >
                    <RxCross1 />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
