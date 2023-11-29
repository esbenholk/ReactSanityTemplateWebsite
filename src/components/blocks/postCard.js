import React, { useState } from "react";
import sanityClient from "../../client";
import { Link } from "react-router-dom";
import useWindowDimensions from "../functions/useWindowDimensions";

import imageUrlBuilder from "@sanity/image-url";
// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function PostCard({ post, card }) {
  const { height } = useWindowDimensions();

  var color;
  if (post.color) {
    color = post.color;
  } else {
    color = "#FFFFFF";
  }

  return (
    <div
      className={
        post.classes ? "post_card card " + post.classes : "post_card card "
      }
    >
      <Link to={post.slug.current} className="w-full teaser-link">
        <h1 className="noMargin">{post.title}</h1>
      </Link>
      <div className="flex-row">
        {post.tags &&
          post.tags.map((tag, index) => (
            <p className="tag postCardTag" key={index}>
              {tag}
            </p>
          ))}
      </div>
      <div className="flex-row">
        {post.categories &&
          post.categories.map((category, index) => (
            <p className="tag postCardTag" key={index}>
              {category.title}
            </p>
          ))}
      </div>
      <Link to={post.slug.current}>
        {post.mainImage.hotspot ? (
          <img
            src={urlFor(post.mainImage).width(200).url()}
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
            src={urlFor(post.mainImage).width(200).url()}
            alt={post.mainImage.alt}
            className="post_card_image"
          />
        )}
      </Link>
    </div>
  );
}
