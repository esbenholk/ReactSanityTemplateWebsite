import React, { useState } from "react";
import Image from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";
import BlockContent from "./BlockContent";

function HeroProjectGrid({ image, logo, time, place, slug, year }) {
  let { height, width } = useWindowDimensions();
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {" "}
      {width > 900 ? (
        <div
          className="hero"
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          <Image
            image={image}
            width={width}
            height={height}
            class={isActive ? "hero-image blur" : "hero-image "}
          />

          <a
            className="heroContent flex-column"
            href={slug}
            style={{ visibility: isActive ? "visible" : "hidden" }}
          >
            <div className="timeText">
              {time ? (
                <BlockContent blocks={time} />
              ) : year ? (
                <p>{year} </p>
              ) : null}
            </div>
            <Image image={logo} height={height / 5} class={"hero-image"} />
            <p className="placeText">{place}</p>
          </a>
        </div>
      ) : (
        <div className="pill">
          <a className="pillContent" href={slug}>
            <div className="timeText">
              <BlockContent blocks={time} />
            </div>
            <Image image={logo} height={179 / 2.5} class={"hero-image"} />
            <p>{place}</p>
          </a>
        </div>
      )}
    </>
  );
}

export function Pill({ logo, time, place, slug, year }) {
  let { width } = useWindowDimensions();

  return (
    <div className="pill blockitem">
      <a className="pillContent" href={slug}>
        <div className="timeText">
          {time ? <BlockContent blocks={time} /> : year ? <p>{year} </p> : null}
        </div>
        <Image
          image={logo}
          height={width > 900 ? 170 : 67}
          class={"hero-image"}
        />
        <p>{place}</p>
      </a>
    </div>
  );
}
export default HeroProjectGrid;
