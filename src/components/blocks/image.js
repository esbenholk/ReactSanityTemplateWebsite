import React, { useState } from "react";
import sanityClient from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useWindowDimensions from "../functions/useWindowDimensions";
// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

export default function Image(props) {
  const image = props.image;
  const classs = props.class;
  const assignedWidth = props.width;
  const maxHeight = props.height;
  const onLoad = props.onLoad;
  const { width } = useWindowDimensions();
  const imageDescription = props.imageDescription;
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {image && (
        <LazyLoadImage
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={
            assignedWidth && assignedWidth < width
              ? urlFor(image.asset).width(assignedWidth).url()
              : assignedWidth && assignedWidth > width
              ? urlFor(image.asset)
                  .width(width - 20)
                  .url()
              : urlFor(image.asset).url()
          }
          onLoad={(e) => {
            onLoad && onLoad(true);
            setIsLoaded(true);
          }}
          placeholdersrc={urlFor(image.asset).height(2).url()}
          key={image.asset._ref}
          alt={image.alt}
          style={{
            objectPosition: image.hotspot
              ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
              : "50% 50%",
            height: maxHeight,
            maxWidth: width ? width : "100%",
          }}
          className={classs}
          effect="opacity"
        />
      )}
      {isLoaded && imageDescription && (
        <p className="smallp">{imageDescription}</p>
      )}{" "}
    </>
  );
}
export function ProjectImage(props) {
  const image = props.image;
  const classs = props.class;
  const assignedWidth = props.width;
  const maxHeight = props.height;
  const onLoad = props.onLoad;
  const { width } = useWindowDimensions();
  const imageDescription = props.imageDescription;
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {image && (
        <LazyLoadImage
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={
            assignedWidth && assignedWidth < width
              ? urlFor(image.asset).width(assignedWidth).url()
              : assignedWidth && assignedWidth > width
              ? urlFor(image.asset)
                  .width(width - 20)
                  .url()
              : urlFor(image.asset).url()
          }
          onLoad={(e) => {
            onLoad && onLoad(true);
            setIsLoaded(true);
          }}
          placeholdersrc={urlFor(image.asset).height(2).url()}
          key={image.asset._ref}
          alt={image.alt}
          style={{
            objectPosition: image.hotspot
              ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
              : "50% 50%",
            height: maxHeight,
            maxWidth: assignedWidth,
          }}
          className={classs}
          effect="opacity"
        />
      )}
      {isLoaded && imageDescription && (
        <p className="smallp">{imageDescription}</p>
      )}{" "}
    </>
  );
}

export function ConstrainedImage(props) {
  const image = props.image;
  const classs = props.class;
  const assignedWidth = props.width;
  const maxHeight = props.height;
  const onLoad = props.onLoad;
  const { width } = useWindowDimensions();
  const imageDescription = props.imageDescription;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {image && (
        <LazyLoadImage
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={
            assignedWidth && assignedWidth < width
              ? urlFor(image.asset).width(assignedWidth).url()
              : assignedWidth && assignedWidth > width
              ? urlFor(image.asset).width(width).url()
              : urlFor(image.asset).url()
          }
          onLoad={(e) => {
            onLoad && onLoad(true);
            setIsLoaded(true);
          }}
          placeholdersrc={urlFor(image.asset).height(2).url()}
          key={image.asset._ref}
          alt={image.alt}
          style={{
            objectPosition: image.hotspot
              ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
              : "50% 50%",
            height: maxHeight,
            // maxWidth: width ? width : "100%",
          }}
          className={classs}
          effect="opacity"
        />
      )}
      {isLoaded && imageDescription && (
        <p className="smallp">{imageDescription}</p>
      )}{" "}
    </>
  );
}
