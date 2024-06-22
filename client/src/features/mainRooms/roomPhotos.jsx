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
        <div className="flex gap-2 rounded-xl max-h-[30rem] relative ">
          <div className="max-h-full rounded-l-xl w-full">
            <img
              className="h-full w-full object-cover rounded-l-xl"
              src={mainImage}
              alt="Room"
            ></img>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[30rem] overflow-hidden rounded-r-xl">
            {roomPictures &&
              roomPictures?.map((picture, index) => (
                <div
                  key={picture.picture_id}
                  className="max-h-[19rem] cursor-pointer hover:opacity-90 "
                  onClick={() => handleImageClick(picture.room_picture)}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={picture.room_picture}
                    alt="Room"
                  ></img>
                </div>
              ))}
          </div>
          <div
            className="absolute bottom-6 right-6 bg-violet-950 p-2 rounded-lg cursor-pointer"
            onClick={openModal}
          >
            <p className="text-white font-semibold text-sm">
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
