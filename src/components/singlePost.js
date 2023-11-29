import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import sanityClient from "../client";
import { useParams, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "./blocks/image";
import CustomCarousel from "./blocks/Carousel";
import { Link } from "react-router-dom";

import BlockContent from "./blocks/BlockContent";

import Masonry from "react-masonry-css";
import { HeadTags } from "./blocks/helmetHeaderTags";

import useWindowDimensions from "./functions/useWindowDimensions";

import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";

export default function SinglePost({}) {
  const { slug } = useParams();
  const [singlePost, setSinglePost] = useState();
  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "project" && slug.current == "${slug}"]{ title, slug, mainImage, tags, categories[]->{title, slug}, pageBuilder[]{ _type == "hero" => { _type, heading, tagline, image}, _type == "video" => { _type, heading, description, url, cover}, _type == "gallery" => { _type, heading,images}, _type == "breadContent" => { _type, heading, content}, _type == "connectedProjects" => {_type, heading, projects[]->{title, slug, mainImage}}},} `
      )
      .then((data) => {
        console.log("project details", data, slug);
        setSinglePost(data[0]);
      })
      .catch(console.error);
  }, []);

  if (!singlePost) return <Loader />;
  console.log("PROJECT", singlePost);
  return (
    <>
      {singlePost && (
        <>
          <HeadTags
            title={singlePost.title}
            //   description={singlePost.recap[0].children[0].text}
            image={singlePost.mainImage.asset.url}
          />
          {singlePost.pageBuilder && (
            <PageBuilder pageBuilder={singlePost.pageBuilder} />
          )}
        </>
      )}
    </>
  );
}
