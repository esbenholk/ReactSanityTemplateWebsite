import React from "react";

import Image from "./image";
import BlockContent from "./BlockContent";
import { Button } from "../menuItem";

export default function PostCard({ post }) {
  return (
    <div className="pressCard">
      {post.source && <p className="smallp">{post.source}</p>}

      <a href={post.slug ? post.slug.current : post.url ? post.url : null}>
        {post.year && <p className="year standardButton minip">{post.year}</p>}
        <Image image={post.mainImage} width={596} />
      </a>

      <div className="pressCardContent">
        <h1 className="boldh1">{post.title}</h1>
        {post.description && (
          <div className="smallp">
            <BlockContent blocks={post.description} />
          </div>
        )}

        <div className="flex-row">
          {post.categories &&
            post.categories.map((category, index) => (
              <p className="minip tag" key={index}>
                {category.title}
                {index !== post.categories.length - 1 && ", "}
                {index === post.categories.length - 1 && " —"}
              </p>
            ))}
          {post.tags &&
            post.tags.map((tag, index) => (
              <p className="minip tag" key={index}>
                {tag}
                {index !== post.tags.length - 1 && ", "}
              </p>
            ))}
        </div>
      </div>

      {post.buttons && (
        <div className="flex-column">
          {post.buttons.buttons.map((button, index) => (
            <Button
              key={index}
              name={button.name}
              url={button.external_link}
              color={button.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
