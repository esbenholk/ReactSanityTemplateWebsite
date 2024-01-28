import React, { useState } from "react";
import Image from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";
import BlockContent from "./BlockContent";
import { NavLink } from "react-router-dom";
function HeroProjectGrid({ image, logo, time, place, slug, year, heading }) {
  let { height, width } = useWindowDimensions();
  const [isActive, setIsActive] = useState(false);

  console.log(heading);
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

          <NavLink
            className="heroContent flex-column"
            to={"/" + slug}
            style={{ visibility: isActive ? "visible" : "hidden" }}
          >
            <div className="timeText">
              {time ? (
                <BlockContent blocks={time} />
              ) : year ? (
                <p>{year} </p>
              ) : null}
            </div>
            {logo ? (
              <Image image={logo} height={height / 5} class={"hero-image"} />
            ) : (
              <h1 className="heroHeading">{heading}</h1>
            )}

            <p className="placeText">{place}</p>
          </NavLink>
        </div>
      ) : (
        <div className="pill">
          <NavLink className="pillContent" to={"/" + slug}>
            <div className="timeText">
              <BlockContent blocks={time} />
            </div>
            {logo ? (
              <Image
                image={logo}
                height={179 / 2.2}
                class={"hero-image iconThatShouldChangebackInNightMode"}
              />
            ) : (
              <h1 className="heroHeading">{heading}</h1>
            )}
            <p>{place}</p>
          </NavLink>
        </div>
      )}
    </>
  );
}

export function Pill({ logo, time, place, slug, year }) {
  let { width } = useWindowDimensions();

  return (
    <div className="pill blockitem">
      <NavLink className="pillContent" to={"/" + slug}>
        <div className="timeText">
          {time ? <BlockContent blocks={time} /> : year ? <p>{year} </p> : null}
        </div>
        <Image
          image={logo}
          height={width > 900 ? 170 : 179 / 2.2}
          class={"hero-image iconThatShouldChangeInNIghtMode"}
        />
        <p>{place}</p>
      </NavLink>
    </div>
  );
}
export default HeroProjectGrid;
