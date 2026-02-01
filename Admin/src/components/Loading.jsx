import React from "react";
import { Oval } from "react-loader-spinner";
import { useAppContext } from "../context/AppContent";

const Loading = () => {
  const { loading } = useAppContext();
  return (
    <section
      className={`loader_com absolute top-0 left-0 z-50 h-full w-full bg-gray-100 opacity-65 flex justify-center items-center ${!loading && "hidden"}`}
    >
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </section>
  );
};

export default Loading;
