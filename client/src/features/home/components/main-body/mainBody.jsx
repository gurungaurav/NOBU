import React from "react";
import MainHotels from "../mainHotels/mainHotels";
import MainaboutUs from "../main-aboutUS/main-aboutUs";
import MainVendors from "../main-Vendors/mainVendors";
import bill from "../../../../assets/bill.png";
import MainHeaders from "../../../../components/mainHeaders/mainHeaders";
import Aos from "aos";
import "aos/dist/aos.css";
import MainBlogsSlider from "../main-blogs/mainBlogsSlider";

export default function MainBody() {
  Aos.init();

  return (
    <div className=" mb-6">
      <div className="">
        <div className=" inline-block">
          <h1 className="font-bold text-4xl text-violet-950">
            Explore Pokharas Finest Hotels and Restros
          </h1>
        </div>
        <div className="pt-5 text-sm">
          <p>
            For a comfortable stay amidst Pokhara's natural beauty, our online
            hotel booking platform offers a diverse range of accommodations,
            from lakeside resorts to cozy guesthouses. Whether you're a nature
            enthusiast, adventure seeker, or cultural explorer, Pokhara promises
            an unforgettable experience, and our platform ensures a hassle-free
            booking process for your ideal stay. Immerse yourself in the magic
            of Pokhara and let our hotels be your home away from home in this
            Himalayan paradise.
          </p>
        </div>
        <MainHotels />
        <MainaboutUs />
        {/* <MainVendors /> */}
        {/* <div className="border-b border-b-1 border-b-violet-950 pb-10 flex flex-col gap-10">
          <MainHeaders Headers={"What our vendors say"} />
          <div className="grid grid-cols-2">
            <div className="sticky top-64 h-fit flex flex-col justify-center items-center ">
              <p> Know about me</p>
              <p>Heheheh</p>
              <p>Heheheh</p>
              <p>Heheheh</p>
            </div>
            <div className="flex flex-col gap-10 ">
              <div
                className="flex flex-col"
                data-aos="fade-down"
                data-aos-once="true"
              >
                <img src={bill}></img>
                <p className="text-sm font-semibold">Hehehe</p>
                <p className="text-2xl font-bold ">hehshahah</p>
              </div>
              <div
                className="flex flex-col"
                data-aos="fade-down"
                data-aos-once="true"
              >
                <img src={bill}></img>
                <p className="text-sm font-semibold">Hehehe</p>
                <p className="text-2xl font-bold ">hehshahah</p>
              </div>
              <div
                className="flex flex-col"
                data-aos="fade-down"
                data-aos-once="true"
              >
                <img src={bill}></img>
                <p className="text-sm font-semibold">Hehehe</p>
                <p className="text-2xl font-bold ">hehshahah</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <MainBlogsSlider /> */}
    </div>
  );
}
