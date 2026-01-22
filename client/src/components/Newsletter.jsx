import React from "react";

const Newsletter = () => {
  return (
    <section className="py-10 bg-green-300">
      <div className="container text-center">
        <h3>
          Sign Up For Exclusive<br></br> Offers From Us
        </h3>
        <form>
          <div className="form_group block sm:flex items-center justify-center gap-2 bg-transparent sm:bg-white px-3 max-w-xl mx-auto my-10 rounded-md">
            <input
              type="email"
              name="email"
              placeholder="email"
              className="w-full sm:flex-1 lg:bg-transparent md:bg-transparent sm:bg-white bg-white outline-none p-3 rounded-md"
              required
            />
            <button className="pry-btn w-full! sm:w-fit!">Sign up</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
