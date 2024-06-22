import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getUserDetailss,
  sendVerificationMail,
} from "../../services/client/user.service";
import { MdStar, MdVerified } from "react-icons/md";
import { format } from "date-fns/format";
import ProfileReviews from "./profileReviews";
import ProfileBookMarks from "./profileBookMarks";
import { Menu, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import { Alert, Dialog } from "@mui/material";
import { toast } from "react-toastify";
import ProfileBlogs from "./profileBlogs";
import UserProfileDetailsSkeleton from "../../components/skeletons/userProfileDetailsSkeleton";

export default function ProfileMain() {
  const [user, setUser] = useState({});
  const { user_id } = useParams();
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const res = await getUserDetailss(user_id);
      setUser(res.data.data);
      setLoading(false);
    } catch (e) {
      navigate(-1);
      console.log(e);
    }
  };

  const verifyUser = async () => {
    try {
      const res = await sendVerificationMail(user_id);
      toast.success(res.data.message);
      console.log(res.data);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const formattedDate = user.createdAt
    ? format(new Date(user.createdAt), "MMMM dd, yyyy")
    : "";

  console.log(user);

  const viewUserImage = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className=" flex justify-center items-center relative">
      <Dialog
        className="absolute w-full h-full  "
        style={{ backgroundColor: "transparent" }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="lg"
      >
        <div className=" flex  items-center ">
          <img
            className=" h-[40rem]  object-cover"
            src={user.profile_picture}
            alt="Profile"
          />
        </div>
      </Dialog>
      <div className="p-4 flex gap-6 w-[80%] ">
        <div className="shadow-lg bg-gray-300 p-4 rounded-lg px-6  sticky top-28 h-fit z-30">
          <div className="flex flex-col gap-3">
            <div className="flex justify-center items-center ">
              <div
                className="w-[10rem] h-[10rem] rounded-full cursor-pointer hover:opacity-90"
                onClick={viewUserImage}
              >
                <img
                  className="w-full h-full  rounded-full object-cover"
                  src={user.profile_picture}
                  alt="Profile"
                />
              </div>
            </div>
            <div className=" flex flex-col gap-3 text-sm">
              <p>
                <strong>Name: </strong>
                {user.user_name}
              </p>
              <p>
                <strong>Email: </strong>
                {user.email}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {user.phone_number}
              </p>
            </div>
            <div className=" font-semibold">
              <p>
                {user.user_name} - {user.roles}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user?.verified ? (
                <>
                  <MdVerified className="text-blue-500 text-2xl" />
                  <p>Email verified</p>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 rounded-full bg-red-600 text-white">
                      <RxCross1 />
                    </div>
                    <p>Email not verified</p>
                  </div>
                  <Alert
                    variant="outlined"
                    severity="error"
                    className="mb-2 items-center text-xs"
                  >
                    Please verify your account please! Without verifying your
                    account you will miss the provided features! Click below to
                    send a email verification on your email!
                  </Alert>
                  <div
                    onClick={verifyUser}
                    className="inline-flex cursor-pointer  bg-violet-950 justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <p>Veirfy</p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2 ">
                Joined in {formattedDate}
              </p>
              {/* <Link to={`/profile/${user_id}/editProfile`}> */}
              {/* <div className="flex flex-col items-center mt-2 cursor-pointer">
                <div className="rounded-lg p-4 bg-violet-950 text-white font-bold w-fit">
                  <p>Edit Profile</p>
                </div>
              </div> */}
              {user?.verified && (
                <Menu as="div" className="relative text-left ">
                  <div className="">
                    <Menu.Button className="inline-flex  bg-violet-950 justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Edit Profile
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* Replace the below Menu.Item with your dropdown options */}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/profile/${user_id}/editProfile`}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block px-4 py-2 text-sm`}
                          >
                            Change user details
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/profile/${user_id}/editPassword`}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block px-4 py-2 text-sm`}
                          >
                            Change password
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}

              {/* </Link> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {loading ? (
            <UserProfileDetailsSkeleton />
          ) : (
            <>
              <div className="flex flex-col gap-4 ">
                <div className="border-b-2 border-b-black w-fit font-semibold cursor-pointer">
                  <p className="text-sm">Reviewed by you</p>
                </div>
                <div className="flex gap-1 items-center">
                  <MdStar className="text-yellow-400 text-2xl" />
                  <p className="text-sm font-bold">
                    {user?.reviews != null ? user?.reviews?.length : 0} Reviews
                  </p>
                </div>
                <ProfileReviews reviews={user?.reviews} />
              </div>
              <div className="flex flex-col gap-6 ">
                <div className="border-b-2 border-b-black w-fit font-semibold cursor-pointer">
                  <p className="text-sm">Book marked by you</p>
                </div>
                <div className="flex gap-1 items-center ">
                  <p className="text-sm font-bold">
                    {user?.reviews != null ? user?.bookMarkLists?.length : 0}{" "}
                    Bookmarks
                  </p>
                </div>
                {user?.bookMarkLists && user?.bookMarkLists.length > 0 ? (
                  <ProfileBookMarks bookMarks={user?.bookMarkLists} />
                ) : (
                  <p className="text-black ">No bookmarks found</p>
                )}
              </div>
              <div className="flex flex-col gap-4 text-sm">
                <div className="border-b-2 border-b-black w-fit font-semibold cursor-pointer">
                  <p className="text-sm">Blogs posted by you</p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="text-sm font-bold">
                    {user?.blogs != null ? user?.blogs?.length : 0} Blogs
                  </p>
                </div>
                {user?.blogs && user?.blogs.length > 0 ? (
                  <ProfileBlogs blogs={user?.blogs} />
                ) : (
                  <p className="text-black ">No blogs posted by you</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
