import PortableText from "react-portable-text";
import React, { useState } from "react";
import Image from "./image";

function BlockContent({ blocks, heading, readmore }) {
  const [isReadingMore, setIsReadingMore] = useState(false);
  return (
    <>
      {heading != null && <h1>{heading}</h1>}
      <PortableText
        content={blocks}
        projectId="qx8f23wj"
        dataset="production"
        serializers={{
          image: (props) => <Image image={props} width={500} />,
        }}
      />

      {readmore && (
        <div style={{ position: "relative" }}>
          {!isReadingMore && (
            <button
              className="readmorebutton"
              onClick={() => {
                setIsReadingMore(true);
              }}
            >
              <p>
                <strong>Read all</strong>
              </p>
            </button>
          )}
          <div
            className={
              isReadingMore ? "readmorecontent open" : "readmorecontent closed"
            }
          >
            <PortableText
              content={readmore}
              projectId="qx8f23wj"
              dataset="production"
              serializers={{
                image: (props) => <Image image={props} width={500} />,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default BlockContent;
