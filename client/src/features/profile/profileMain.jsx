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
    <div className="min-h-screen bg-gray-50">
      <Dialog
        className="z-50"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="flex justify-center items-center p-4">
          <img
            className="max-h-96 sm:max-h-[500px] lg:max-h-[600px] w-full object-contain rounded-lg"
            src={user.profile_picture}
            alt="Profile"
          />
        </div>
      </Dialog>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Profile Sidebar */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 lg:sticky lg:top-28">
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Profile Image */}
                  <div className="flex justify-center">
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                      onClick={viewUserImage}
                    >
                      <img
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        src={user.profile_picture}
                        alt="Profile"
                      />
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <div className="text-center lg:text-left">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {user.user_name}
                      </h2>
                      <p className="text-sm text-gray-600 capitalize">
                        {user.roles}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-1">
                        <span className="font-semibold text-gray-700">
                          Email:
                        </span>
                        <span className="text-gray-600 break-all">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-1">
                        <span className="font-semibold text-gray-700">
                          Phone:
                        </span>
                        <span className="text-gray-600">
                          {user.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-3">
                    {user?.verified ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <MdVerified className="text-green-600 text-xl flex-shrink-0" />
                        <span className="text-sm font-medium text-green-800">
                          Email verified
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="p-1.5 rounded-full bg-red-600 text-white flex-shrink-0">
                            <RxCross1 className="text-xs" />
                          </div>
                          <span className="text-sm font-medium text-red-800">
                            Email not verified
                          </span>
                        </div>
                        <Alert
                          variant="outlined"
                          severity="error"
                          className="text-xs"
                        >
                          Please verify your account! Without verifying your
                          account you will miss the provided features! Click
                          below to send email verification.
                        </Alert>
                        <button
                          onClick={verifyUser}
                          className="w-full bg-violet-950 hover:bg-violet-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                          Verify Email
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Join Date and Edit Profile */}
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-500 text-center lg:text-left">
                      Member since {formattedDate}
                    </p>

                    {user?.verified && (
                      <Menu as="div" className="relative">
                        <Menu.Button className="w-full bg-violet-950 hover:bg-violet-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                          Edit Profile
                        </Menu.Button>
                        <Transition
                          as={React.Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/profile/${user_id}/editProfile`}
                                  className={`${
                                    active
                                      ? "bg-gray-50 text-gray-900"
                                      : "text-gray-700"
                                  } block px-4 py-3 text-sm font-medium transition-colors`}
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
                                      ? "bg-gray-50 text-gray-900"
                                      : "text-gray-700"
                                  } block px-4 py-3 text-sm font-medium transition-colors`}
                                >
                                  Change password
                                </Link>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {loading ? (
                  <UserProfileDetailsSkeleton />
                ) : (
                  <>
                    {/* Reviews Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Your Reviews
                          </h3>
                          <div className="flex items-center gap-2">
                            <MdStar className="text-yellow-400 text-lg sm:text-xl" />
                            <span className="text-sm sm:text-base font-semibold text-gray-700">
                              {user?.reviews != null
                                ? user?.reviews?.length
                                : 0}{" "}
                              Reviews
                            </span>
                          </div>
                        </div>
                        <ProfileReviews reviews={user?.reviews} />
                      </div>
                    </div>

                    {/* Bookmarks Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Your Bookmarks
                          </h3>
                          <span className="text-sm sm:text-base font-semibold text-gray-700">
                            {user?.bookMarkLists != null
                              ? user?.bookMarkLists?.length
                              : 0}{" "}
                            Bookmarks
                          </span>
                        </div>
                        {user?.bookMarkLists &&
                        user?.bookMarkLists.length > 0 ? (
                          <ProfileBookMarks bookMarks={user?.bookMarkLists} />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm sm:text-base">
                              No bookmarks found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Blogs Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Your Blogs
                          </h3>
                          <span className="text-sm sm:text-base font-semibold text-gray-700">
                            {user?.blogs != null ? user?.blogs?.length : 0}{" "}
                            Blogs
                          </span>
                        </div>
                        {user?.blogs && user?.blogs.length > 0 ? (
                          <ProfileBlogs blogs={user?.blogs} />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm sm:text-base">
                              No blogs posted yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
