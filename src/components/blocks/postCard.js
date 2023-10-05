import React, { useState } from "react";
import sanityClient from "../../client";

import { Link } from "react-router-dom";

import imageUrlBuilder from "@sanity/image-url";
import useWindowDimensions from "../functions/useWindowDimensions";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function PostCard({ post }) {
  const [isShown, setIsShown] = useState(false);

  const { width } = useWindowDimensions();

  var color;
  if (post.color) {
    color = post.color;
  } else {
    color = "#FFFFFF";
  }

  return (
    <div
      className="post_card"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {width > 700 && isShown ? (
        <div
          className="post_card_overlay seeOnHover"
          style={{ backgroundColor: color }}
        >
          <div className="details">
            <Link
              to={post.slug.current}
              key={post.slug.current}
              className="w-full teaser-link"
            >
              <h1 className="noMargin">{post.title}</h1>
            </Link>

            <div className="flex-row">
              {post.tags &&
                post.tags.map((tag, index) => (
                  <p className="tag postCardTag" key={index}>
                    {tag}
                    {index + 1 !== post.tags.length ? "," : null}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex-row post_card_overlay_buttons">
            {post.categories &&
              post.categories.map((category, index) => (
                <>
                  {category.title === "Freebie" ||
                    (category.title === "Freebie" ? (
                      <></>
                    ) : (
                      <a
                        className="standardTransparent-button"
                        key={index}
                        href={"/category/" + category.slug.current}
                      >
                        {" "}
                        {category.title}{" "}
                      </a>
                    ))}
                </>
              ))}
            <Link
              to={post.slug.current}
              key={post.slug.current}
              className="w-full teaser-link standard-button tag active extraBorder"
            >
              See project
            </Link>
          </div>
        </div>
      ) : null}

      <Link to={post.slug.current} key={post.slug.current}>
        {post.mainImage.hotspot ? (
          <img
            src={urlFor(post.mainImage.asset.url)}
            alt={post.mainImage.alt}
            style={{
              objectPosition: `${post.mainImage.hotspot.x * 100}% ${
                post.mainImage.hotspot.y * 100
              }%`,
            }}
            className="post_card_image"
          />
        ) : (
          <img
            src={urlFor(post.mainImage.asset.url)}
            alt={post.mainImage.alt}
            className="post_card_image"
          />
        )}
      </Link>
    </div>
  );
}
