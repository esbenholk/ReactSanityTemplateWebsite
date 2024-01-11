import React, { useState, useEffect } from "react";
import sanityClient from "../client";
import { useParams, useSearchParams } from "react-router-dom";
import { HeadTags } from "./blocks/helmetHeaderTags";
// import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";

export default function SinglePage({ updatePageTitle, updateProjectTitle }) {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [singlePage, setSinglePage] = useState();

  useEffect(() => {
    console.log("loads page", slug);
    window.scrollTo(0, 0);
  }, [slug]);
  ///get project data, set category names
  useEffect(() => {
    const params = [];

    searchParams.forEach((value, key) => {
      params.push([key, value]);
    });

    sanityClient
      .fetch(
        `*[_type == "page" && slug.current == "${slug}"]{ title, slug, mainImage, tags, categories[]->{title, slug},${pageBuilderquerystring}} `
      )
      .then((data) => {
        setSinglePage(data[0]);

        console.log("page", data[0]);

        if (params.length === 0) {
          updatePageTitle(data[0].title);
        }
        updateProjectTitle("");
      })
      .catch(console.error);
  }, [slug, updatePageTitle, updateProjectTitle, searchParams]);

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
            <PageBuilder
              pageBuilder={singlePage.pageBuilder}
              updatePageTitle={updatePageTitle}
              updateProjectTitle={updateProjectTitle}
            />
          )}
        </>
      )}
    </div>
  );
}
