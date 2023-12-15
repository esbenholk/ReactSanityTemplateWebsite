import React from "react";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useWindowDimensions from "../functions/useWindowDimensions";
import { SquareImage } from "./squareCard";

export default function CustomCarousel({ images, classsss }) {
  const { width } = useWindowDimensions();
  return (
    <div className="fullWidthBlock blockItemOpenRight carouselContainer">
      {width < 900 ? (
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
          infiniteLoop={true}
          // selectedItem={currentIndex}
          renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
            hasPrev && (
              <button
                onClick={(e) => {
                  clickHandler();
                }}
                className="featuredCardArrow prevArrow"
              >
                <img
                  style={{
                    height: "30px",
                    width: "30px",
                    transform: "rotate(180deg)",
                  }}
                  src={`../assets/returnArrow.png`}
                  alt="prevArrow"
                />
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
                }}
              >
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={`../assets/returnArrow.png`}
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
      ) : (
        <>
          <div className="flex-row wrap align-center">
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
    </div>
  );
}
