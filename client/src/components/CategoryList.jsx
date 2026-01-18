import React from "react";
import { category } from "../assets/asset";

const CategoryList = () => {
  return (
    <section className="category_list py-12">
      <div className="container">
        <ul className="flex overflow-x-auto sm:justify-center sm:items-center pb-6 gap-4 snap-x snap-mandatory md:overflow-visible scrollbar-hide">
          {category.map((item) => (
            <li
              key={item.id}
              className="category-item cursor-pointer flex justify-center items-center flex-col hover:scale-105 hover:text-green-700 transition-all duration-300"
            >
              <div className="category_img bg-white h-30 w-30 rounded-full p-3 border-2 border-gray-300 flex justify-center items-center mb-2 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover"
                />
              </div>

              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoryList;
