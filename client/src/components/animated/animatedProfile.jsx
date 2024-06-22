import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
import bill from "../../assets/bill.png";

export default function AnimatedProfile({ details }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };
  console.log(details);
  return (
    <div
      onMouseEnter={() => setHoveredIndex(1)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="rounded-full border border-gray-500 w-14 h-14 flex items-center justify-center relative cursor-pointer ">
        <AnimatePresence>
          {hoveredIndex && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                whiteSpace: "nowrap",
              }}
              className="absolute -top-5  -right-16 transform -translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2 whitespace-nowrap text-white"
            >
              <div className="font-semibold text-white relative z-30 text-xs">
                <p> {details?.user_name}</p>
                {/* {details.role} */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <img
          onMouseMove={handleMouseMove}
          className="rounded-full w-full h-full object-cover  !m-0 !p-0 object-top  relative transition duration-500"
          src={details?.profile_picture}
          alt="Profile"
        />
      </div>
    </div>
  );
}

AnimatedProfile.propTypes = {
  details: PropTypes.object.isRequired,
};
