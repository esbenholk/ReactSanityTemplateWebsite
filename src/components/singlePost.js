import React, { useState, useEffect } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";

import { HeadTags } from "./blocks/helmetHeaderTags";

import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import { NavLink } from "react-router-dom";

export default function SinglePost({ updatePageTitle, updateProjectTitle }) {
  const { slug } = useParams();
  const [project, setProject] = useState();
  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "project" && slug.current == "${slug}"]{ title, color, introduction, place, description, slug,year,time, mainImage, heroImage, type, tags, categories[]->{title, slug, color},${pageBuilderquerystring}} `
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

          <div className="projectPage">
            {project.introduction && (
              <div className="blockItem">
                <div className="textBlock">
                  <BlockContent blocks={project.introduction} />
                  <div className={`flex-row projectDetails`}>
                    {project.time ? (
                      <div>
                        <BlockContent blocks={project.time} />
                      </div>
                    ) : project.year ? (
                      <p>{project.year} </p>
                    ) : null}
                    {project.place && <p>{project.place}</p>}
                    {project.categories &&
                      project.categories.map((category, index) => (
                        <NavLink
                          className="interactable category"
                          to={"/timeline?" + category.slug.current}
                          style={{ backgroundColor: category.color }}
                          key={index}
                        >
                          <p>{category.title}</p>
                        </NavLink>
                      ))}
                    {project.tags &&
                      project.tags.map((tag, index) => (
                        <NavLink
                          className="interactable tag"
                          to={"/timeline?" + tag}
                          key={index}
                        >
                          <p href="">{tag}</p>{" "}
                        </NavLink>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {}
            {project.pageBuilder && (
              <PageBuilder
                pageBuilder={project.pageBuilder}
                color={project.color}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
