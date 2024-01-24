import React, { useState, useEffect } from "react";
import CollaboratorCard from "./blocks/collaboratorCard";
import sanityClient from "../client";
import useWindowDimensions from "./functions/useWindowDimensions";

export default function ConnectedCollaborators({
  press,
  heading,
  type,
  color,
}) {
  const [connectedPressInstances, setPressInstances] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (press.collaborators != null) {
      setPressInstances(press.collaborators);
    } else if (press.category != null && press.category.length > 0) {
      for (let index = 0; index < press.category.length; index++) {
        const category = press.category[index];
        sanityClient
          .fetch(
            `*[_type == "category" && title=="${category.title}"] {title, "press": *[_type == "collaborator" && references(^._id)]}`
          )
          .then((data) => {
            for (let index = 0; index < data.length; index++) {
              const category = data[index];
              if (category.press) {
                for (let index = 0; index < category.press.length; index++) {
                  const press = category.press[index];

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
          `*[_type == "collaborator"] { title, year, color, time, mainImage, slug, description, tags, categories[]->{title, slug}, buttons }`
        )
        .then((data) => {
          setPressInstances(data);
        })
        .catch(console.error);
    }
  }, [press.category, press.collaborators]);

  useEffect(() => {
    connectedPressInstances.sort(() => Math.random() - 0.5);
  }, [connectedPressInstances]);

  return (
    <>
      {type === "list" ? (
        <div className="blockItemOpenRight">
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
      ) : (
        <div>
          {heading ? <p className="headlinep">{heading}</p> : null}

          <div className="flex-row wrap fold block showcaseGrid">
            {connectedPressInstances &&
              connectedPressInstances.map((project, index) => (
                <CollaboratorCard post={project} key={index} />
              ))}
          </div>
        </div>
      )}
    </>
  );
}
