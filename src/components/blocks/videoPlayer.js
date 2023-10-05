import React, { createRef } from "react";

import Image from "./image";

import ReactPlayer from "react-player";

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video: props.video,
      display: "block",
      showThumb: props.showThumb,
      shouldPlay: props.isPlaying,
      url: props.video.embedID,
    };
  }

  render() {
    const cover = createRef();

    function handleThumbnail() {
      console.log("changes thumb");

      if (cover.current) {
        if (cover.current.style.display === "none") {
          cover.current.style.display = "block";
        } else {
          cover.current.style.display = "none";
        }
      }
    }

    return (
      <>
        {this.state.video.thumbnail && this.state.showThumb ? (
          <div className="videoContainer">
            <ReactPlayer
              width="100%"
              height="100%"
              style={{ transform: "translate(0,50%);" }}
              url={this.state.url}
              // playing={this.state.shouldPlay}
              controls
              onPause={handleThumbnail}
              playsinline
              config={{
                youtube: {
                  playerVars: { modestbranding: 1 },
                },
                file: {
                  attributes: {
                    controlsList: "nofullscreen",
                  },
                },
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                width: "100%",
                height: "100%",
              }}
              ref={cover}
              onClick={(e) => {
                e.preventDefault();
                this.setState({ shouldPlay: true });

                handleThumbnail();
                // e.target.classList.add("hidden")
              }}
            >
              <Image image={this.state.video.thumbnail} class={"cover"} />
            </div>
          </div>
        ) : (
          <div className="videoContainer">
            <ReactPlayer
              width="100%"
              height="100%"
              url={this.state.url}
              playing={this.state.shouldPlay}
              controls
              onPause={handleThumbnail}
              playsinline
              config={{
                youtube: {
                  playerVars: { modestbranding: 1 },
                },
                file: {
                  attributes: {
                    controlsList: "nofullscreen",
                  },
                },
              }}
            />
          </div>
        )}
      </>
    );
  }
}
