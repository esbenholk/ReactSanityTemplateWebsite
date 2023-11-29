import React, { lazy } from "react";

import { useParams } from "react-router-dom";

const SinglePost = lazy(() => import("./singlePost.js"));
const Category = lazy(() => import("./Category.js"));
const SinglePage = lazy(() => import("./page"));

export default function SlugContext({ CategoryNames, PageNames }) {
  const { slug } = useParams();
  return (
    <>
      {PageNames.find((name) => name.slug.current.toLowerCase() === slug) ? (
        <SinglePage />
      ) : (
        <>
          {CategoryNames.find((name) => name.toLowerCase() === slug) ? (
            <Category />
          ) : (
            <SinglePost />
          )}
        </>
      )}
    </>
  );
}
