import React from "react";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CustomCarousel({
  children,
  arrows,
  classsss,
  autoplay,
  currentIndex,
  stopVideo,
  id,
}) {
  if (!autoplay) {
    autoplay = false;
  }
  console.log("current index in carousel", id);

  if (!currentIndex) {
    currentIndex = 0;
    console.log("sets index to 0", currentIndex);
  }

  return (
    <Carousel
      swipeable={true}
      key={id}
      preventMovementUntilSwipeScrollTolerance
      axis={"horizontal"}
      swipeScrollTolerance={5}
      stopOnHover={true}
      showIndicators={true}
      emulateTouch={true}
      showStatus={false}
      interval={6000}
      showThumbs={false}
      autoPlay={autoplay}
      showArrows={arrows}
      className={`carousel ${classsss}`}
      infiniteLoop={false}
      // selectedItem={currentIndex}
      selectedItem={currentIndex}
      onChange={(e) => {
        if (stopVideo) {
          stopVideo();
        }
      }}
      renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
        hasPrev && (
          <button
            onClick={(e) => {
              clickHandler();
              if (stopVideo) {
                stopVideo();
              }
            }}
            className="featuredCardArrow prevArrow"
          >
            <img
              style={{
                height: "55px",
                width: "55px",
                transform: "rotate(180deg)",
              }}
              src={`../assets/arrow_in_circle.svg`}
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
              if (stopVideo) {
                stopVideo();
              }
            }}
          >
            <img
              style={{ height: "55px", width: "55px" }}
              src={`../assets/arrow_in_circle.svg`}
              alt="nextArrow"
            />
          </button>
        )
      }
    >
      {children}
    </Carousel>
  );
}
