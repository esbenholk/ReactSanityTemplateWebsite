import React, { useState, useEffect } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";
import { HeadTags } from "./blocks/helmetHeaderTags";
// import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";

export default function SinglePage({ updatePageTitle, updateProjectTitle }) {
  const { slug } = useParams();
  const [singlePage, setSinglePage] = useState();

  console.log("loads page", slug);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "page" && slug.current == "${slug}"]{ title, slug, mainImage, tags, categories[]->{title, slug},${pageBuilderquerystring}} `
      )
      .then((data) => {
        console.log("page details", data, slug);
        setSinglePage(data[0]);
        updatePageTitle(data[0].title);
        updateProjectTitle("");
      })
      .catch(console.error);
  }, [slug, updatePageTitle, updateProjectTitle]);

  // if (!singlePage) return <Loader />;

  return (
    <div className="page">
      {singlePage && (
        <>
          <HeadTags
            title={singlePage.title}
            //   description={singlePost.recap[0].children[0].text}
            // image={singlePage.mainImage.asset.url}
          />
          {singlePage.pageBuilder && (
            <PageBuilder pageBuilder={singlePage.pageBuilder} />
          )}
        </>
      )}
    </div>
  );
}
