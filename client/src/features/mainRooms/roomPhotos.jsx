import { Fragment, useEffect } from "react";
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import RoomAllPhotos from "./roomAllPhotos";
import { RxCross1 } from "react-icons/rx";
import MainImagesGallerySkeleton from "../../components/skeletons/mainImageGallerySkeleton";

export default function RoomPhotos(props) {
  console.log(props?.roomPictures);
  let [isOpen, setIsOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const loading = props.loading;

  useEffect(() => {
    if (props.roomPictures && props.roomPictures.length > 0) {
      setMainImage(props.roomPictures[0]?.room_picture);
    }
  }, [props.roomPictures]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // Function to handle image click and update the main image
  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  //! The images are used to show the all pictures on the gallery but the room Pictures are used for displaying
  const images = props?.roomPictures;
  const roomPictures = props?.roomPictures?.slice(0, 4);

  useEffect(() => {}, [mainImage]);
  return (
    <>
      {loading ? (
        <MainImagesGallerySkeleton />
      ) : (
        <div className="relative flex flex-col md:flex-row gap-2 rounded-xl max-h-[30rem] w-full">
          {/* Main Image */}
          <div className="w-full md:w-2/3 max-h-[20rem] md:max-h-full rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
            <img
              className="h-60 md:h-full w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              src={mainImage}
              alt="Room"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-2 gap-2 w-full md:w-1/3 max-h-[20rem] md:max-h-[30rem] overflow-hidden rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
            {roomPictures &&
              roomPictures?.map((picture) => (
                <div
                  key={picture.picture_id}
                  className="max-h-[9rem] md:max-h-[19rem] cursor-pointer hover:opacity-90"
                  onClick={() => handleImageClick(picture.room_picture)}
                >
                  <img
                    className="w-full h-full object-cover rounded-b-xl md:rounded-none"
                    src={picture.room_picture}
                    alt="Room"
                  />
                </div>
              ))}
          </div>
          {/* View All Button */}
          <div
            className="absolute bottom-3 right-3 md:bottom-6 md:right-6 bg-violet-950 p-2 rounded-lg cursor-pointer z-10"
            onClick={openModal}
          >
            <p className="text-white font-semibold text-xs md:text-sm">
              View All Pictures
            </p>
          </div>

          <Transition appear show={isOpen} as={Fragment}>
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
                      <RoomAllPhotos images={images} />
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
      )}
    </>
  );
}
