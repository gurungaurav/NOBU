import React, { useEffect, useState } from "react";
import ReviewsCard from "../../components/reviews/reviewsCard";
import ReviewTop from "../../components/reviews/reviewTop";
import { useParams } from "react-router-dom";
import { getHotelReviewss } from "../../services/client/user.service";
import ReviewSkeleton from "../../components/skeletons/reviewsSkeleton";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { hotel_id } = useParams();

  const reviewsHotel = async () => {
    try {
      const res = await getHotelReviewss(hotel_id);
      console.log(res.data);
      setReviews(res.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    reviewsHotel();
  }, []);

  const roundToHalf = (num) => Math.round(num * 2) / 2;

  const averageRatings =
    reviews.length > 0
      ? roundToHalf(
          reviews.reduce((sum, review) => sum + parseInt(review.ratings), 0) /
            reviews.length
        )
      : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 mb-[10rem]">
      <ReviewTop
        averageRatings={averageRatings}
        totalReviews={reviews.length}
      />
      {loading ? (
        [1, 2, 3, 4].map(() => <ReviewSkeleton />)
      ) : (
        <ReviewsCard reviews={reviews} />
      )}
    </div>
  );
}
