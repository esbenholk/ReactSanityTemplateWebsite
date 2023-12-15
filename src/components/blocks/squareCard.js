import React from "react";
import sanityClient from "../../client";
import { Link } from "react-router-dom";
import Image from "./image";
import imageUrlBuilder from "@sanity/image-url";
// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function SquareCard({ post, class_name, width }) {
  return (
    <div className="cube_card">
      {post.mainImage && (
        <Link to={"/" + post.slug.current}>
          <img
            src={urlFor(post.mainImage).height(width).url()}
            alt={post.mainImage.alt}
            style={{
              objectPosition:
                post.mainImage.hotspot &&
                `${post.mainImage.hotspot.x * 100}% ${
                  post.mainImage.hotspot.y * 100
                }%`,
              width: width,
            }}
            className={class_name}
          />
        </Link>
      )}
    </div>
  );
}

export function SquareImage({ image, class_name, width }) {
  return (
    <div className="cubedImage">
      <Image image={image} width={width} class={class_name} cubed={true} />
    </div>
  );
}
