import PortableText from "react-portable-text";
import React from "react";
import Image from "./image";

function BlockContent({ blocks, heading }) {
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
    </>
  );
}

export default BlockContent;
