import React from "react";

import { Link } from "react-router-dom";

import Image from "./image";

export default function BasketCard({
  post,
  classssss,
  isInCart,
  removeFromCart,
  openMenu,
}) {
  function remove() {
    removeFromCart(post);
  }
  function closeMenuLocal() {
    openMenu();
  }

  return (
    <div className={classssss + " flex-row align-top basketCard"}>
      <Link
        to={post.slug.current}
        key={post.slug.current + ""}
        className="basketCard_image_link"
        onClick={closeMenuLocal}
      >
        {post.productImage ? (
          <div className="basketCard_image">
            <div className="squareImage">
              <Image image={post.productImage} />
            </div>
          </div>
        ) : (
          <div className="squareImage">
            <Image image={post.mainImage} />
          </div>
        )}
      </Link>

      <div className="details">
        <Link
          to={post.slug.current}
          key={post.slug.current + ""}
          className="w-full teaser-link"
          onClick={closeMenuLocal}
        >
          <h2>{post.title}</h2>
        </Link>
        <div className="flex-row align-left">
          {post.tags &&
            post.tags.map((tag, index) => (
              <p className="tag" key={index}>
                {tag}
                {index + 1 !== post.tags.length ? "," : null}
              </p>
            ))}
        </div>

        {post.star_rating ? <p className="stars">{post.star_rating}</p> : null}

        {isInCart ? <button onClick={remove}>remove from cart</button> : null}
      </div>
    </div>
  );
}
