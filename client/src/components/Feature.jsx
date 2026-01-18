import React from "react";
import { assets, features } from "../assets/asset";

const Feature = () => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1">
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`${feature.bg} py-10 flex flex-col items-center text-center text-white`}
        >
          <div className="icon">
            <img src={feature.icon} alt={feature.title} />
          </div>
          <p className="title text-xl! font-medium mt-2">{feature.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Feature;
