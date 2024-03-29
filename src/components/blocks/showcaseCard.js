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
      <div className="flex-row">
        {post.categories && post.categories.length > 0 && (
          <NavLink to={"/timeline?" + post.categories[0].slug.current}>
            <p className="year catButtonSmall interact minip">
              {post.categories[0].title}
            </p>
          </NavLink>
        )}
      </div>
      <NavLink
        to={
          post.slug ? "/" + post.slug.current : post.url ? "/" + post.url : null
        }
      >
        {mode === "grid" ? (
          <Image
            image={post.mainImage}
            height={width > 900 ? 330 : null}
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
            width={width > 900 ? 900 : width - 26}
            onLoad={updateSetIsLoaded}
          />
        )}
      </NavLink>
      <div className="pressCardContent showCardContent">
        <h4>
          <strong>{post.title}</strong>
        </h4>
        {post.description && (
          <div className="smallp">
            <BlockContent blocks={post.description} />
          </div>
        )}

        <div className="flex-row  miniwrap">
          {post.categories &&
            post.categories.map((tag, index) => (
              <NavLink
                className="minip tag"
                to={"/timeline?" + tag.slug.current}
                key={index}
              >
                <p style={{ marginRight: "5px" }}>
                  {tag.title}
                  {post.categories.length > 1 ? ", " : null}
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
                <p style={{ marginRight: "5px" }}>
                  {tag}
                  {index !== post.tags.length - 1 && ", "}
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
