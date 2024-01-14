import React, { useState } from "react";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useWindowDimensions from "../functions/useWindowDimensions";
import { SquareImage } from "./squareCard";

export default function CustomCarousel({ images, classsss, description }) {
  const { width } = useWindowDimensions();
  const [imageIndex, setImageIndex] = useState(1);
  return (
    <div className="carouselContainer">
      {width < 900 ? (
        <>
          <p className="counter">
            {imageIndex}/{images.length}
          </p>
          <Carousel
            swipeable={true}
            preventMovementUntilSwipeScrollTolerance
            axis={"horizontal"}
            swipeScrollTolerance={5}
            stopOnHover={true}
            showIndicators={false}
            emulateTouch={true}
            showStatus={false}
            interval={6000}
            showThumbs={false}
            showArrows={true}
            className={`carousel ${classsss}`}
            infiniteLoop={false}
            // selectedItem={currentIndex}
            renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
              hasPrev && (
                <button
                  onClick={(e) => {
                    clickHandler();
                    setImageIndex(imageIndex - 1);
                  }}
                  className="featuredCardArrow prevArrow"
                >
                  <img src={`../assets/arrowLeft.svg`} alt="prevArrow" />
                </button>
              )
            }
            renderArrowNext={(clickHandler, hasNext, labelNext) =>
              hasNext && (
                <button
                  // onClick={clickHandler}
                  className="featuredCardArrow nextArrow"
                  onClick={(e) => {
                    clickHandler();
                    setImageIndex(imageIndex + 1);
                  }}
                >
                  <img
                    style={{
                      transform: "rotate(180deg)",
                    }}
                    src={`../assets/arrowLeft.svg`}
                    alt="nextArrow"
                  />
                </button>
              )
            }
          >
            {images.map((image, index) => (
              <SquareImage
                image={image}
                key={index}
                class_name={"instagrampic"}
                width={width}
              />
            ))}
          </Carousel>
        </>
      ) : (
        <>
          <div className="flex-row wrap align-center justify-center">
            {" "}
            {images.map((image, index) => (
              <SquareImage
                image={image}
                key={index}
                class_name={"instagrampic"}
                width={500}
              />
            ))}
          </div>
        </>
      )}
      {description && <p className="smallp">{description}</p>}{" "}
    </div>
  );
}
