import React, { useState, useEffect } from "react";
import PostCard from "./blocks/pressCard";
import sanityClient from ".././client";
import useWindowDimensions from "./functions/useWindowDimensions";

function ConnectedPress({ press, heading, type, color, title }) {
  const [connectedPressInstances, setPressInstances] = useState([]);
  const { width } = useWindowDimensions();

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
    } else {
      sanityClient
        .fetch(
          `*[_type == "press"] { title, year, time, mainImage, slug, description, tags, categories[]->{title, slug}}`
        )
        .then((data) => {
          setPressInstances((prevArray) => [...prevArray, data[0]]);
        })
        .catch(console.error);
    }
  }, [press.category, press.pressOccurances]);

  return (
    <>
      {type === "list" ? (
        <div className="block">
          {heading ? <p className="headlinep">{heading}</p> : null}
          <div className="flex-column">
            {" "}
            {connectedPressInstances &&
              connectedPressInstances.map((press, index) => (
                // <PostCard post={press} key={index} />

                <div className="flex-row" key={index}>
                  {width > 900 ? (
                    <div className="flex-row align-center listsentence">
                      <p>{press.year}, </p>
                      <a to="_blank" href={press.url} style={{ color: color }}>
                        {press.title},
                      </a>
                      <p> {press.place}</p>
                    </div>
                  ) : (
                    <div className="flex-column listsentence">
                      <div className="flex-row">
                        <p>{press.place}, </p>
                        <p>{press.year}</p>
                      </div>
                      <a to="_blank" href={press.url} style={{ color: color }}>
                        {press.title}
                      </a>
                    </div>
                  )}{" "}
                </div>
              ))}
          </div>
        </div>
      ) : type === "card" ? (
        <div>
          {heading ? <p className="headlinep">{heading}</p> : null}
          <div className="horizontalScroll fullWidthBlock blockItemOpenRight blockTop ">
            {connectedPressInstances &&
              connectedPressInstances.map((press, index) => (
                <PostCard post={press} key={index} />
              ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ConnectedPress;
