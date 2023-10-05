import React from "react";
import sanityClient from "../../client";

import { Link } from "react-router-dom";

import imageUrlBuilder from "@sanity/image-url";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function FeaturedCard({ post }) {
  var color;
  if (post.color) {
    color = post.color;
  } else {
    color = "#FFFFFF";
  }

  return (
    <div className="featured_post_card" key={post}>
      <Link
        to={post.slug.current}
        key={post.slug.current}
        className="featured_post_card_image"
      >
        {post.mainImage.hotspot ? (
          <img
            src={urlFor(post.mainImage.asset.url)}
            alt={post.mainImage.alt}
            style={{
              objectPosition: `${post.mainImage.hotspot.x * 100}% ${
                post.mainImage.hotspot.y * 100
              }%`,
            }}
          />
        ) : (
          <img
            src={urlFor(post.mainImage.asset.url)}
            alt={post.mainImage.alt}
          />
        )}
      </Link>
      <div
        className="featured_post_card_overlay"
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

          <div className="flex-row featuredCardTags">
            {post.tags &&
              post.tags.map((tag, index) => (
                <p className="tag postCardTag" key={index}>
                  {tag}
                  {index + 1 !== post.tags.length ? ",  " : null}
                </p>
              ))}
          </div>
        </div>
        <div className="flex-row align-center post_category_list">
          {post.categories &&
            post.categories.map((category, index) => (
              <div key={index} className="buttonOnWrapList">
                {category.title === "Freebie" ||
                  (category.title === "Freebie" ? (
                    <></>
                  ) : (
                    <a
                      className="standardTransparent-button fcButton"
                      key={index}
                      href={"/category/" + category.slug.current}
                    >
                      {" "}
                      {category.title}{" "}
                    </a>
                  ))}
              </div>
            ))}
          <Link
            to={post.slug.current}
            className="w-full teaser-link standard-button tag active extraBorder buttonOnWrapList fcButton"
          >
            See project
          </Link>
        </div>
      </div>
    </div>
  );
}
