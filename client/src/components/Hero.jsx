import { motion } from "framer-motion";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import Navbar from "./Navbar";

export const Hero = () => {
  // Ultra-snappy spring for that premium "mechanical" feel
  const springTransition = { type: "spring", stiffness: 100, damping: 20 };
  const { loading } = useContext(AppContent);

  return (
    <section className="bg-white overflow-hidden flex flex-col justify-center relative bg-[url('/src/assets/images/hero_bg.png')] bg-center bg-cover bg-fixed">
      <Navbar />

      {/* Background Decorative Text - Large and Faint */}
      {!loading && (
        <>
          <div className="container relative z-10 grid h-full lg:grid grid-cols-1 items-center sm:block sm:pt-8 md:grid place-items-center pb-6">
            {/* TEXT CONTENT */}
            <div className="text-center grid place-items-center mb-10 text-gray-800">
              <div className="overflow-hidden">
                {" "}
                {/* The "Mask" */}
                <motion.h5
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, ...springTransition }}
                  className="text-green-600 font-bold! uppercase tracking-[0.2em]"
                >
                  Style destination
                </motion.h5>
              </div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ letterSpacing: "10px", y: "100%" }}
                  animate={{ y: 0, letterSpacing: "0px" }}
                  transition={{ delay: 0.4, ...springTransition }}
                  className="text-7xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-slate-900"
                >
                  THE NEW <br /> COLLECTION
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-gray-700 max-w-sm leading-relaxed my-3"
              >
                Engineering meets aesthetics. Discover the future of footwear
                with our limited XPro release.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <NavLink
                  to="/shop"
                  className="group relative inline-flex! items-center gap-4 px-8 py-4 bg-black text-white rounded-md overflow-hidden transition-all z-20"
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-sm">
                    Shop Now
                  </span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </NavLink>
              </motion.div>
            </div>

            {/* THE HERO IMAGE - Dynamic Tilt & Entrance */}
            {/* <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 100, rotate: 15 }}
              animate={{ opacity: 1, x: 0, rotate: -5 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Custom cubic-bezier
            >
              {assets.xpro_1 && (
                <motion.img
                  src={assets.xpro_1}
                  alt="XPro 1"
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    filter: "drop-shadow(0px 20px 50px rgba(0,0,0,0.2))",
                  }}
                  className="w-full h-auto object-contain cursor-grab active:cursor-grabbing transition-filter duration-500"
                />
              )}

              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-10 bg-orange-100 rounded-full blur-[100px] -z-10"
              />
            </motion.div> */}
          </div>
        </>
      )}
    </section>
  );
};
