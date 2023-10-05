import React from "react";
import sanityClient from "../../client";
import { motion } from "framer-motion";

import imageUrlBuilder from "@sanity/image-url";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function Image(props) {
  const image = props.image;
  const classs = props.class;

  return (
    <>
      {image && (
        <>
          {image.hotspot ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={urlFor(image.asset)}
              key={image.asset._ref}
              alt={image.alt}
              style={{
                objectPosition: `${image.hotspot.x * 100}% ${
                  image.hotspot.y * 100
                }%`,
              }}
              className={classs}
            />
          ) : (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={urlFor(image.asset)}
              key={image.asset._ref}
              alt={image.alt}
              className={classs}
            />
          )}
        </>
      )}
    </>
  );
}
