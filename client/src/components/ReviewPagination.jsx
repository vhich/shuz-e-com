import { Star } from "lucide-react";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";
import ReviewCard from "./ReviewCard";
const review_input_style =
  "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm!";

const ReviewPagination = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState({
    error: false,
    message: "",
  });

  const { backendUrl, setLoading, setProduct, product, api } =
    useContext(AppContent);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Validation check
    if (email === "" || name === "" || comment === "") {
      toast.error("All input fields are required!");
      setLoading(false);
      return;
    }
    if (email.length < 6) {
      toast.error("Please provide a valid email address.");
      setLoading(false);
      return;
    }
    if (name.length < 3) {
      toast.error("name must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (comment.length < 20) {
      setLoading(false);
      setCommentError({
        error: true,
        message: "Comment cannot be less thn 20 characters",
      });
      return;
    }

    if (rating === 0) {
      setLoading(false);
      toast.error("Please select a star rating!");
      return;
    }

    const reviewData = {
      name,
      email,
      rating,
      comment,
    };

    try {
      const response = await api.post(
        `${backendUrl}/review/products/${id}/reviews`,
        reviewData,
      );
      const data = response.data;
      console.log(response);
      if (data?.success) {
        toast.success(data?.message);
        document.body.style.pointerEvents = "none";
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(data.error);
        return;
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews grid grid-cols-[40%_50%] gap-10">
      <div className="order-2">
        <h6>Add a review</h6>
        <small className="block text-gray-600 mt-4">
          Your email address will not be published.
        </small>
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your rating <span className="text-lg text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                // Determine if star should look filled based on hover or click state
                const isFilled = hoverRating >= star || rating >= star;

                return (
                  <button
                    key={star}
                    type="button" // Prevents the form from submitting when clicking stars
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform duration-100 hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isFilled
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="my-4">
            <label htmlFor="name" className="text-slate-600 text-sm!">
              Names <span className="text-lg text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className={review_input_style}
              placeholder="Victor OG."
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="my-4">
            <label htmlFor="email" className="text-slate-600 text-sm!">
              E-mail <span className="text-lg text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={review_input_style}
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label htmlFor="comment" className="text-slate-600 text-sm!">
              Comment <span className="text-lg text-red-500">*</span>
            </label>
            <textarea
              onChange={(e) => {
                (e.target.value.length > 120
                  ? setCommentError({
                      error: true,
                      message: "Must not be more than 120 characters!",
                    })
                  : setCommentError({
                      error: false,
                      message: "",
                    }),
                  setComment(e.target.value));
              }}
              name="comment"
              id="comment"
              className={`w-full h-32 p-3 border ${commentError.error ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none ${commentError.error === false && "focus:border-black"} resize-none text-sm!`}
              placeholder="I love the quality of the shoe"
              value={comment}
            ></textarea>

            <p className="text-right text-slate-500 text-sm! italic">
              {comment.length} / 100 characters
            </p>
            {commentError.error && (
              <p className="text-red-500 text-sm! text-right">
                {commentError.message}
              </p>
            )}
          </div>
          <button type="submit" className="mt-2 pry-btn">
            Submit Review
          </button>
        </form>
      </div>
      <div className={`flex flex-col gap-y-6`}>
        {product?.reviews.length > 0 ? (
          product.reviews
            .slice(0, 3)
            .map((review, index) => (
              <ReviewCard review={review} key={review?._id} />
            ))
        ) : (
          <h6 className="text-center text-slate-400 mt-10">
            No reviews for this product.
          </h6>
        )}
      </div>
    </div>
  );
};

export default ReviewPagination;
