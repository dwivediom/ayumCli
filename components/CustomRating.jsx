import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CustomRating = ({ rating }) => {
  // Calculate the number of full, half, and empty stars based on the rating
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar
        style={{
          color: "gold",
          width: "25px",
          height: "25px",
        }}
        key={`full-${i}`}
      />
    );
  }

  // Add a half star if needed
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt
        style={{ color: "gold", width: "25px", height: "25px" }}
        key="half"
      />
    );
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar
        style={{
          width: "24px",
          height: "24px",
        }}
        key={`empty-${i}`}
      />
    );
  }

  return <div>{stars}</div>;
};

export default CustomRating;
