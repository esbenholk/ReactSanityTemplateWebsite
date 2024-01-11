import React, { createRef } from "react";

import Image from "./image";

import ReactPlayer from "react-player";

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "block",
      thumbnail: props.cover,
      url: props.url,
      shouldPlay: false,
      width: props.width,
    };
  }

  render() {
    const cover = createRef();

    function handleThumbnail() {
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
        <div className="videoContainer" style={{ position: "relative" }}>
          <ReactPlayer
            playing={this.state.shouldPlay}
            width="100%"
            height={this.state.width > 900 ? "700px" : "350px"}
            url={this.state.url}
            // playing={this.state.shouldPlay}
            controls
            onPause={() => {
              this.setState({ shouldPlay: false });

              handleThumbnail();
              // e.target.classList.add("hidden")
            }}
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
            className="videoThumbnail"
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
            {this.props.cover && (
              <Image image={this.props.cover} height={700} class={"cover"} />
            )}
          </div>
        </div>
      </>
    );
  }
}
