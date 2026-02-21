import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2"; // Modern icons
import { reviews } from "../assets/asset";
import ReviewCard from "./ReviewCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Reviews = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto relative">
        <h4 className="text-4xl font-bold text-gray-900 mb-6 capitalize text-center">
          Happy customer reviews
        </h4>
        <Swiper
          className="mySwiper"
          modules={[Autoplay, Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          //   pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide className="my-8" key={index}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="navigate-btn hidden sm:flex justify-between">
        {/* Previous Button */}
        <button
          className="custom-prev w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 
        shadow-sm text-gray-800 transition-all hover:bg-black hover:text-white hover:shadow-xl
        disabled:opacity-0 cursor-pointer"
        >
          <HiArrowLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          className="custom-next
        w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 
        shadow-sm text-gray-800 transition-all hover:bg-black hover:text-white hover:shadow-xl
        disabled:opacity-0 cursor-pointer"
        >
          <HiArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Reviews;
