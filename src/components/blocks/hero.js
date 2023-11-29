import React, { useEffect } from "react";
import Image from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";

function Hero({ image, tagLine, heading }) {
  let { height, width } = useWindowDimensions();

  return (
    <div className={`hero ${image.type === "contain" ? "contain" : "cover"}`}>
      <Image
        image={image}
        width={width > 1000 ? 1000 : width}
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
