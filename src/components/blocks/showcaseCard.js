import React, { useState } from "react";

import Image from "./image";
import BlockContent from "./BlockContent";
import { Button } from "../menuItem";
import useWindowDimensions from "../functions/useWindowDimensions";
import { NavLink } from "react-router-dom";

export default function ShowcaseCard({ post }) {
  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);

  const updateSetIsLoaded = (bool) => {
    console.log("update isloaded");
    setIsLoaded(bool);
  };
  return (
    <div
      className={isLoaded ? "showcaseCard " : "showcaseCard hidden"}
      style={{ position: "relative" }}
    >
      <div className="flex-row year gap">
        <div className="standardButton">
          {post.time ? (
            <BlockContent blocks={post.time} />
          ) : post.year ? (
            <p>{post.year} </p>
          ) : null}
        </div>
        {post.categories && post.categories.length > 0 && (
          <p className="standardButton">{post.categories[0].title}</p>
        )}
      </div>
      <a href={post.slug ? post.slug.current : post.url ? post.url : null}>
        <Image
          image={post.mainImage}
          height={width > 600 ? 450 : null}
          width={width > 600 ? null : width - 26}
          onLoad={updateSetIsLoaded}
        />
      </a>
      <div className="pressCardContent">
        <h4>
          <strong>{post.title}</strong>
        </h4>
        {post.description && (
          <div className="smallp">
            <BlockContent blocks={post.description} />
          </div>
        )}

        <div className="flex-row">
          {post.categories &&
            post.categories.map((tag, index) => (
              <NavLink
                className="minip tag"
                to={"/timeline?" + tag.slug.current}
                key={index}
              >
                <p href="">
                  {index !== 0 && ","} {tag.title}{" "}
                </p>{" "}
              </NavLink>
            ))}
          {post.tags &&
            post.tags.map((tag, index) => (
              <NavLink
                className="minip tag"
                to={"/timeline?" + tag}
                key={index}
              >
                <p href="">
                  {post.categories.length > 0 && index === 0 && ", "}
                  {index !== 0 && post.tags.length - 1 && ","} {tag}{" "}
                </p>{" "}
              </NavLink>
            ))}
        </div>
      </div>

      {post.buttons && (
        <div className="flex-row wrap">
          {post.buttons.buttons.map((button, index) => (
            <Button
              key={index}
              name={button.name}
              url={
                button.linksToProject ? post.slug.current : button.external_link
              }
              color={button.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
