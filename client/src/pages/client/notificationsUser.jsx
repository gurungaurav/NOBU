import { useSelector } from "react-redux";
import {
  getNotifications,
  readAllNoti,
} from "../../services/client/user.service";
import { useEffect, useState, useCallback } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";

export default function NotificationsUser() {
  const { id } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotifications(page, id);
      setNotifications(res.data.data);
      // setNotifications((prevNotifications) => [
      //   ...prevNotifications,
      //   ...res.data.data,
      // ]);
      // setLoading(false);
      // if (res.data.data.length === 0) {
      //   setHasMore(false);
      // }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [id, page]);

  const readAllNotifi = async () => {
    try {
      const res = await readAllNoti(id);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    userNotifications();
    readAllNotifi();
  }, [id, page, userNotifications]);

  // const fetchMoreData = () => {
  //   setPage((prevPage) => prevPage + 1);
  // };

  return (
    <div className=" h-full mx-[20rem] my-10">
      <div className="text-3xl mb-6 font-semibold flex items-center gap-2">
        <p>Notifications</p>
        <p className="text-sm">({notifications?.length})</p>
      </div>

      <div className="flex flex-col gap-10 items-start ">
        {notifications.map((noti, index) => (
          <div
            className="flex gap-6 border-b w-full pb-2"
            key={noti.notification_id}
          >
            <div className="flex gap-6 w-full">
              <img
                src={noti?.sender?.profile}
                className="w-14 h-14 rounded-full object-cover"
                alt="notification"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">
                    {noti.sender.user_name}
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">
                    {moment(new Date(noti?.createdAt)).fromNow()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  {noti.message}
                </p>
                <p>{noti?.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <InfiniteScroll
        dataLength={notifications.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<CircularProgress />}
        scrollableTarget=".notification-list"
        className="flex flex-col gap-10 items-start notification-list"
      >
        {notifications.map((noti, index) => (
          <div
            className="flex gap-6 border-b w-full pb-2"
            key={noti.notification_id}
          >
            <div className="flex gap-6 w-full">
              <img
                src={noti?.sender?.profile}
                className="w-14 h-14 rounded-full object-cover"
                alt="notification"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">
                    {noti.sender.user_name}
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">
                    {moment(new Date(noti?.createdAt)).fromNow()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  {noti.message}
                </p>
                <p>{noti?.type}</p>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll> */}
    </div>
  );
}
