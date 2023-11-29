import React, { useContext, useState, useEffect, useRef } from "react";
import AppContext from "../../globalState";
import { urlFor } from "./image";
import denseCapColors from "../denseCapColors";
import useWindowDimensions from "../functions/useWindowDimensions";

import Marquee from "react-marquee-slider";

let speed = 100;
function tripleArrayContent(inputArray) {
  return [...inputArray, ...inputArray, ...inputArray];
}
const TickerComp = () => {
  const [velocity, setVelocity] = useState(speed);
  const marqueeRef = useRef();
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  let { width } = useWindowDimensions();

  useEffect(() => {
    if (width > 1000) {
      speed = 100;
    } else if (width > 600) {
      speed = 50;
    } else {
      speed = 20;
    }
  }, [width]);

  const links = tripleArrayContent(info.institutions.external_links);

  setTimeout(() => {
    setVelocity(speed);
  }, 3000);

  console.log("render ticker comp");
  const TickerContent = () => {
    return (
      <>
        {links.map((link, index) => (
          <a key={index} href={link.url} id={index}>
            {link.image != null ? (
              <img
                src={urlFor(link.image.asset).height(64).url()}
                style={{
                  minHeight: "64px",
                  objectFit: "contain",
                  maxWidth: "none",
                }}
              />
            ) : (
              <>
                {" "}
                {link.name != null ? (
                  <h1 className="standardButton">{link.name}</h1>
                ) : (
                  <h1 className="standardButton">content incoming</h1>
                )}
              </>
            )}
          </a>
        ))}
      </>
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor:
            denseCapColors[Math.floor(Math.random() * denseCapColors.length)],
          height: "90px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Marquee
          velocity={velocity}
          direction="rtl"
          onInit={() => console.log("start")}
        >
          {Array.from(Array(2)).map((id, index) => (
            <div
              className="marquee"
              ref={marqueeRef}
              key={index}
              onMouseOver={() => setVelocity(0)}
              onMouseLeave={() => setVelocity(speed)}
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                height: "90px",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <TickerContent />
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
};

export default TickerComp;
