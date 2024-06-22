import { MdStar } from "react-icons/md";

// Function to generate star components based on ratings
export const generateStars = (ratings) => {
  const filledStars = Math.floor(ratings);
  const hasHalfStar = ratings % 1 !== 0;

  const starArray = [];

  // Add filled stars
  for (let i = 0; i < filledStars; i++) {
    starArray.push(<MdStar key={i} />);
  }

  // Add half star if applicable
  if (hasHalfStar) {
    starArray.push(<MdStar key="half" className="text-yellow-400" />);
  }

  // Add empty stars to fill the remaining space
  for (let i = starArray.length; i < 5; i++) {
    starArray.push(<MdStar key={`empty${i}`} className="text-gray-400" />);
  }

  return starArray;
};
