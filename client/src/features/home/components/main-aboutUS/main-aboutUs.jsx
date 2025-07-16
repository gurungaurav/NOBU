import React from "react";
import MainHeaders from "../../../../components/mainHeaders/mainHeaders";
import Aos from "aos";
import "aos/dist/aos.css";

export default function MainaboutUs() {
  Aos.init();

  return (
    <div className="flex flex-col pt-16 justify-center items-center">
      <MainHeaders Headers={"About us"} />
      <div className="flex flex-col items-center mt-10 max-w-5xl">
        <div
          className=""
          style={{ textAlign: "center" }}
          // data-aos="fade-right"
          // data-aos-once="true"
          // data-aos-duration="2000"
        >
          <p>
            Hotels encompass a diverse range of accommodations offering
            amenities like pools, gyms, dining options, and services such as
            room service, concierge, and shuttle facilities. Varying from
            budget-friendly to luxury, hotels classify by star ratings,
            providing different room types, catering to diverse travelers'
            needs. Accessible via multiple booking platforms, hotels emphasize
            location, attractions, and business facilities, often under
            established chains or independent branding. Reviews and eco-friendly
            practices increasingly influence guests' choices, reflecting the
            evolving landscape of hospitality.
          </p>
        </div>
        <div
          className=" pt-5"
          style={{ textAlign: "center" }}
          // data-aos="fade-left"
          // data-aos-once="true"
          // data-aos-duration="2000"
        >
          <p>
            Hotels encompass a diverse range of accommodations offering
            amenities like pools, gyms, dining options, and services such as
            room service, concierge, and shuttle facilities. Varying from
            budget-friendly to luxury, hotels classify by star ratings,
            providing different room types, catering to diverse travelers'
            needs. Accessible via multiple booking platforms, hotels emphasize
            location, attractions, and business facilities, often under
            established chains or independent branding. Reviews and eco-friendly
            practices increasingly influence guests' choices, reflecting the
            evolving landscape of hospitality.
          </p>
        </div>
      </div>
    </div>
  );
}
