import React, { useState } from "react";

import Image from "./image";
import BlockContent from "./BlockContent";
import { Button } from "../menuItem";
import useWindowDimensions from "../functions/useWindowDimensions";
import { NavLink } from "react-router-dom";

export default function ShowcaseCard({ post, mode }) {
  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);

  const updateSetIsLoaded = (bool) => {
    setIsLoaded(bool);
  };
  return (
    <div
      className={isLoaded ? "showcaseCard " : "showcaseCard hidden"}
      style={{ position: "relative" }}
    >
      <div className="flex-row year gap">
        {post.categories && post.categories.length > 0 && (
          <NavLink to={"/timeline?" + post.categories[0].slug.current}>
            <p className="year catButtonSmall interact minip">
              {post.categories[0].title}
            </p>
          </NavLink>
        )}
      </div>
      <a href={post.slug ? post.slug.current : post.url ? post.url : null}>
        {mode === "grid" ? (
          <Image
            image={post.mainImage}
            height={width > 900 ? 450 : null}
            width={
              width < 600
                ? width - 26
                : width < 900
                ? Math.floor(width / 2 - 18)
                : null
            }
            onLoad={updateSetIsLoaded}
          />
        ) : (
          <Image
            image={post.mainImage}
            // height={width > 600 ? 450 : null}
            width={width > 900 ? 713 : width - 26}
            onLoad={updateSetIsLoaded}
          />
        )}
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
                  {post.categories &&
                    post.categories.length > 0 &&
                    index === 0 &&
                    ", "}
                  {index !== 0 && post.tags.length - 1 && ","} {tag}{" "}
                </p>{" "}
              </NavLink>
            ))}
        </div>
      </div>

      {post.buttons && post.buttons.buttons && (
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
