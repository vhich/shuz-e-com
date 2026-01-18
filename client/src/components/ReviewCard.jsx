import React from "react";
import { FaStar } from "react-icons/fa";
import { Quote } from "lucide-react";

const ReviewCard = ({ review }) => {
  return (
    <div className="p-6 bg-green-50 rounded-lg shadow-md relative overflow-hidden">
      <Quote
        className="absolute -top-10 -right-10 opacity-10 text-green-300"
        size={200}
      />
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < review.rate_given ? "text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
      <h6 className="text-sm! font-bold text-gray-900 capitalize my-2">
        {review.title}
      </h6>

      <p className="text-gray-600 italic mb-4">{review.comment}</p>

      <div className="flex items-center gap-3 pt-4 border-t border-green-200">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 capitalize">
            {review.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
