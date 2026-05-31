import PropTypes from "prop-types";
import Navbar from "./Navbar";

const Jumbotron = ({ text }) => {
  return (
    <header className="jumbotron">
      <Navbar />
      <div className="container">
        <h1 className="text-center">{text}</h1>
      </div>
    </header>
  );
};

Jumbotron.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Jumbotron;
