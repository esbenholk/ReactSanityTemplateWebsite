import React, { useContext } from "react";
import AppContext from "../../globalState";
import { urlFor } from "./image";
import Marquee from "react-marquee-slider";

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
        <Marquee
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
