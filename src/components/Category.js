import React, { useEffect, useState, useContext } from "react";
import { Suspense } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";
import Projects from "./blocks/Projects";

import BlockContent from "./blocks/BlockContent";
import { HeadTags } from "./blocks/helmetHeaderTags";
import AppContext from "../globalState";

export default function Category() {
  const { slug } = useParams();
  const [projectList, setProjectList] = useState();
  const [category, setCategory] = useState();
  const [shouldHaveFreebieSign, setShouldHaveFreebieSign] = useState(false);
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  useEffect(() => {
    if (slug === "freebies") {
      setShouldHaveFreebieSign(true);
    }
    sanityClient
      .fetch(
        `*[_type == "category" && slug.current=="${slug}"]{ title, slug, description}`
      )
      .then((data) => {
        setCategory(data[0]);
      })
      .catch(console.error);
    sanityClient
      .fetch(
        `*[_type == "category" && slug.current=="${slug}"]{
          _id,
          _type,
          title, 
          slug, 
          description,
          "posts": *[_type == "project" && references(^._id)]
          {title,mainImage{asset->{_id,url}, hotspot, alt}, productImage{asset->{_id,url}, hotspot, alt}, year, abbreviated_year, abbreviated_year2, star_rating ,slug, categories[]->{title, slug}, tags, color, recap, yearString}
        }`
      )
      .then((data) => {
        console.log(data);
        setProjectList(data[0].posts);
      })
      .catch(console.error);
  }, [slug]);

  return (
    <div className="content-container ">
      {info && (
        <HeadTags
          title={info.title}
          description={info.description}
          image={info.mainImage.asset.url}
        />
      )}
      <div className="fullWidthPadded category_details">
        {category && category.title ? (
          <h1 className="noMargin categoryTitle">{category.title}</h1>
        ) : null}

        {/* <h1 className="subheadline">Filter projects by tags</h1> */}
        {category && category.description ? (
          <div className="subheadline">
            <BlockContent blocks={category.description} />
          </div>
        ) : null}
      </div>

      <Suspense fallback={null}>
        {projectList && projectList.length > 0 ? (
          <Projects
            projectList={projectList}
            show_tags={true}
            columns={4}
            shouldHaveFreebieSign={shouldHaveFreebieSign}
            columnAmountOn390={2}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
