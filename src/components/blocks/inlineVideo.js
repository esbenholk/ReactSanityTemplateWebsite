import React, { createRef } from "react";

import ReactPlayer from "react-player";

export default class InlineVideoPlayer extends React.Component {
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

  componentDidUpdate() {
    console.log("video mounts", this.state.video);
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
      <ReactPlayer
        width="100%"
        style={{
          display: "inline-block",
          height: "416px",
          position: "relative",
          width: "100%",
          marginTop: "45px",
          marginBottom: "45px",
        }}
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
    );
  }
}
