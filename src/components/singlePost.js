import React, { useState, useEffect } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";

import { HeadTags } from "./blocks/helmetHeaderTags";

import useWindowDimensions from "./functions/useWindowDimensions";

import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";

export default function SinglePost({ updatePageTitle, updateProjectTitle }) {
  const { slug } = useParams();
  const [project, setProject] = useState();
  let { width } = useWindowDimensions();
  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "project" && slug.current == "${slug}"]{ title, headline, description, slug,year,time, mainImage, heroImage, type, tags, categories[]->{title, slug, color},${pageBuilderquerystring}} `
      )
      .then((data) => {
        console.log("project details", data, slug);
        setProject(data[0]);
        updatePageTitle("");
        updateProjectTitle(data[0].title);
      })
      .catch(console.error);
  }, [slug, updatePageTitle, updateProjectTitle]);

  if (!project) return <Loader />;
  console.log("PROJECT", project);
  return (
    <>
      {project && (
        <>
          <HeadTags title={project.title} image={project.mainImage.asset.url} />

          {project.type === "heroImage" && project.heroImage != null ? (
            <div>
              <Hero image={project.heroImage} type={"cover"} />
              <img
                className="absolute bottom right header-padding"
                src={process.env.PUBLIC_URL + "/assets/arrowDown.png"}
                alt="arrow down"
              />
            </div>
          ) : project.type === "image" ? (
            <>
              <Hero image={project.heroImage} type={"contain"} />
            </>
          ) : null}

          <div style={{ position: "relative" }}>
            <div className="projectDetails">
              {project.headline && (
                <div className="blockItem">
                  <h1 className="bigH1">{project.headline}</h1>
                </div>
              )}

              {project.description && (
                <div className="blockItem">
                  <BlockContent blocks={project.description} />
                </div>
              )}
            </div>

            <div
              className={`projectData blockItem flex-column ${
                width > 600 ? "absolute top right align-right" : null
              }`}
            >
              {project.categories &&
                project.categories.map((category, index) => (
                  <div
                    className="standardButton interactable"
                    style={{ backgroundColor: category.color }}
                    key={index}
                  >
                    <p>{category.title}</p>
                  </div>
                ))}
              {project.tags &&
                project.tags.map((tag, index) => (
                  <div className="standardButton interactable" key={index}>
                    <p href="">{tag}</p>{" "}
                  </div>
                ))}
              {project.time ? (
                <div className="standardButton">
                  <BlockContent blocks={project.time} />
                </div>
              ) : project.year ? (
                <p className="standardButton">{project.year} </p>
              ) : null}
            </div>
          </div>
          {}
          {project.pageBuilder && (
            <PageBuilder pageBuilder={project.pageBuilder} />
          )}
        </>
      )}
    </>
  );
}
