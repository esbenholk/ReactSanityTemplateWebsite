import React, { useContext, useState, useEffect } from "react";
// import Ticker from "react-ticker";
import AppContext from "../../globalState";
import { urlFor } from "./image";
import times from "lodash/times";
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";

//import Marquee from "react-simple-marquee";
//import Marquee from "react-easy-marquee";
// import Marquee from "react-fast-marquee";
// import Ticker from "react-moveable-ticker

const TickerContent = () => {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  return (
    <div
      className="tickerContent"
      style={{
        display: "flex",
        position: "relative",
        width: "auto",
        height: "90px",
      }}
    >
      {" "}
      {info.institutions.external_links.map((link, index) => (
        <a href={link.external_link} key={index} className="institutionLink">
          <>
            {link.image != null ? (
              <img src={urlFor(link.image.asset).height(90).url()} />
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
          </>
        </a>
      ))}
    </div>
  );
};

const CollaborationTicker = () => {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  function onInit() {
    console.log("TICKER INITS");
  }
  return (
    <div
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        height: "90px",
        overflow: "hidden",
      }}
    >
      {info.institutions != null ? (
        // <Ticker speed={100} height={"4.8rem"} mode={"loop"}>
        //   {(index) => (
        //     <div
        //       style={{
        //         display: "block",
        //         position: "relative",
        //         width: "auto",
        //         backgroundColor: "yellow",
        //         margin: "5px",
        //       }}
        //     >
        //       <TickerContent />
        //     </div>
        //   )}
        // </Ticker>
        // <Marquee
        //   height="90px"
        //   width="100%"
        //   Axis="X"
        //   Align="center"
        //   pauseOnHover={true}
        //   reverse={true}
        //   duration={10000}
        //   Width="auto"
        //   className="marquee"
        // >
        //   <h1>hej</h1>
        //   {/* <TickerContent /> */}
        // </Marquee>
        <Marquee
          onInit={onInit}
          velocity={5}
          minScale={0.7}
          resetAfterTries={200}
          scatterRandomly={false}
        >
          <TickerContent />
          <TickerContent />
          <TickerContent />
        </Marquee>
      ) : (
        //
        <h1>u dont have any collab links yet</h1>
      )}
    </div>
  );
};

export default CollaborationTicker;

// // <Marquee
//       //   height="90px"
//       //   width="100%"
//       //   Axis="X"
//       //   Align="center"
//       //   pauseOnHover={true}
//       //   reverse={true}
//       //   duration={10000}
//       //   Width="auto"
//       //   className="marquee"
//       // >
//       //   <TickerContent />
//       // </Marquee>
