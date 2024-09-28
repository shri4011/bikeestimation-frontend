import React from "react";
import GearImage from "../assets/images/gear.webp";

const Loader = () => {
  return (
    <>
      <div class="loader-container">
        <div class="gear">
          <img src={GearImage} alt="an illustration of a gear" />
        </div>
      </div>
    </>
  );
};

export default Loader;
