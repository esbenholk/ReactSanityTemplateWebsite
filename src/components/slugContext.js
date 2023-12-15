import React, { lazy, useEffect } from "react";

import { useParams } from "react-router-dom";

const SinglePost = lazy(() => import("./singlePost.js"));
// const Category = lazy(() => import("./Category.js"));
const SinglePage = lazy(() => import("./page"));

export default function SlugContext({
  // CategoryNames,
  PageNames,
  updatePageTitle,
  updateProjectTitle,
}) {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {PageNames.find((name) => name.slug.current.toLowerCase() === slug) ? (
        <SinglePage
          updatePageTitle={updatePageTitle}
          updateProjectTitle={updateProjectTitle}
        />
      ) : (
        <>
          <SinglePost
            updatePageTitle={updatePageTitle}
            updateProjectTitle={updateProjectTitle}
          />
          {/* {CategoryNames.find((name) => name.toLowerCase() === slug) ? (
            <Category />
          ) : (
            <SinglePost updatePageTitle={updatePageTitle} />
          )} */}
        </>
      )}
    </>
  );
}
