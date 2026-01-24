import React, { useContext } from "react";
import { Oval } from "react-loader-spinner";
import { AppContent } from "../context/AppContent";

const Loading = () => {
  const { loading } = useContext(AppContent);
  return (
    <section
      className={`loader_com fixed top-0 left-0 z-50 h-screen w-screen bg-gray-100 flex justify-center items-center ${!loading && "hidden"}`}
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
