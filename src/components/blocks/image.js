import React from "react";
import sanityClient from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

export default function Image(props) {
  const image = props.image;
  const classs = props.class;
  const width = props.width;
  const maxHeight = props.height;
  return (
    <>
      {image && (
        <>
          {image.hotspot ? (
            <div style={{ maxHeight: maxHeight }}>
              <LazyLoadImage
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={
                  width
                    ? urlFor(image.asset).width(width).url()
                    : urlFor(image.asset).url()
                }
                placeholdersrc={urlFor(image.asset).height(2).url()}
                key={image.asset._ref}
                alt={image.alt}
                style={{
                  objectPosition: `${image.hotspot.x * 100}% ${
                    image.hotspot.y * 100
                  }%`,
                  height: maxHeight,
                  width: width ? width : "100%",
                  objectFit: "cover",
                }}
                className={classs}
                effect="blur"
              />
            </div>
          ) : (
            <div style={{ height: maxHeight }}>
              <LazyLoadImage
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={
                  width
                    ? urlFor(image.asset).width(width).url()
                    : urlFor(image.asset).url()
                }
                placeholdersrc={urlFor(image.asset).height(2).url()}
                key={image.asset._ref}
                alt={image.alt}
                className={classs}
                effect="blur"
                style={{ height: maxHeight, width: width }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
