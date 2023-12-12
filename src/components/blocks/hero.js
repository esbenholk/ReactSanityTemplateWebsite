import React from "react";
import Image from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";

function Hero({ image, tagLine, type, heading }) {
  let { height } = useWindowDimensions();

  return (
    <div className={`hero ${type === "contain" ? "contain" : "cover"}`}>
      <Image
        image={image}
        // width={width}
        height={height}
      />

      <div className="heroContent">
        {heading && <h1>{heading}</h1>}
        {tagLine && <h2>{tagLine}</h2>}
      </div>
    </div>
  );
}

export default Hero;
