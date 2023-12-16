import React, { useState, useEffect } from "react";
import PostCard from "./blocks/pressCard";
import sanityClient from ".././client";

function ConnectedPress({ press, heading, type }) {
  const [connectedPressInstances, setPressInstances] = useState([]);

  useEffect(() => {
    if (press.pressOccurances != null) {
      setPressInstances(press.pressOccurances);
    } else if (press.category != null && press.category.length > 0) {
      for (let index = 0; index < press.category.length; index++) {
        const category = press.category[index];
        console.log("category for query", category, index);
        sanityClient
          .fetch(
            `*[_type == "category" && title=="${category.title}"] {title, "press": *[_type == "press" && references(^._id)]}`
          )
          .then((data) => {
            for (let index = 0; index < data.length; index++) {
              const category = data[index];
              if (category.press) {
                for (let index = 0; index < category.press.length; index++) {
                  const press = category.press[index];
                  console.log(
                    "HAS PRESS OCCURANCE FOR CATEGORY",
                    category.title,
                    press
                  );
                  setPressInstances((prevArray) => [...prevArray, press]);
                }
              }
            }
          })
          .catch(console.error);
      }
    }
  }, [press.category, press.pressOccurances]);

  console.log("Connected press", connectedPressInstances, heading);
  return (
    <>
      {heading ? <h4 className="fullWidthBlock blockTop ">{heading}</h4> : null}
      {type === "list" ? (
        <div className="list fullWidthBlock blockTop blockBottom">
          <div className="flex-column">
            {" "}
            {connectedPressInstances &&
              connectedPressInstances.map((press, index) => (
                // <PostCard post={press} key={index} />
                <div className="flex-row">
                  {" "}
                  <div className="flex-row align-center">
                    <p>{press.year}</p>
                    <a to="_blank" href={press.url}>
                      {press.title}
                    </a>
                  </div>
                  <p>{press.place}</p>
                </div>
              ))}
          </div>
        </div>
      ) : type === "card" ? (
        <div className="horizontalScroll fullWidthBlock blockItemOpenRight blockTop ">
          {" "}
          {connectedPressInstances &&
            connectedPressInstances.map((press, index) => (
              <PostCard post={press} key={index} />
            ))}
        </div>
      ) : null}
    </>
  );
}

export default ConnectedPress;
