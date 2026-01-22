import React, { useState } from "react";
import { ArrowUp } from "lucide-react";

const ToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`to-top-btn fixed bottom-8 ${isVisible ? "right-8" : "-right-100"} z-50 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-500`}
      onClick={scrollToTop}
    >
      <ArrowUp />
    </button>
  );
};

export default ToTopBtn;
