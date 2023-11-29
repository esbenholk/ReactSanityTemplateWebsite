import React, { useState } from "react";
import Image from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";
import BlockContent from "./BlockContent";

function HeroProjectGrid({ image, logo, time, place }) {
  let { height, width } = useWindowDimensions();
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {" "}
      {width > 600 ? (
        <div
          className="hero"
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          <Image
            image={image}
            width={width > 1000 ? 1000 : width}
            height={height}
            class={isActive ? "hero-image blur" : "hero-image "}
          />
          {isActive && (
            <div className="heroContent">
              <div className="timeText">
                <BlockContent blocks={time} />
              </div>
              <Image image={logo} height={height / 4} class={"hero-image"} />
              <h2>{place}</h2>
            </div>
          )}
        </div>
      ) : (
        <div className="pill">
          <div className="pillContent">
            <div className="timeText">
              <BlockContent blocks={time} />
            </div>
            <Image image={logo} height={179 / 2.5} class={"hero-image"} />
            <h2>{place}</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroProjectGrid;
