import React, { useState, useEffect, useRef } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";

import { HeadTags } from "./blocks/helmetHeaderTags";

import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import { NavLink } from "react-router-dom";

export default function SinglePost({
  updatePageTitle,
  updateProjectTitle,
  updateProjectLogo,
}) {
  const { slug } = useParams();
  const [project, setProject] = useState();
  const scollToRef = useRef();
  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "project" && slug.current == "${slug}"]{ title, color, introduction, place, description, slug,year,time, mainImage, heroImage,logoImage{asset->{url}}, type, tags, categories[]->{title, slug, color},${pageBuilderquerystring}} `
      )
      .then((data) => {
        setProject(data[0]);
        updatePageTitle("");
        updateProjectTitle(data[0].title);

        if (data[0].logoImage !== null) {
          console.log("updates logo", data[0].logoImage);
          updateProjectLogo(data[0].logoImage.asset.url);
        }
      })
      .catch(console.error);
  }, [slug, updatePageTitle, updateProjectTitle, updateProjectLogo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) return <Loader />;
  return (
    <div className="page">
      {project && (
        <>
          <HeadTags title={project.title} image={project.mainImage.asset.url} />

          {project.type === "heroImage" && project.heroImage != null ? (
            <div>
              <Hero image={project.heroImage} type={"cover"} />
              <img
                onClick={() =>
                  scollToRef.current.scrollIntoView({ behavior: "smooth" })
                }
                className="buttonDown"
                src={process.env.PUBLIC_URL + "/assets/arrowDown.svg"}
                alt="arrow down"
              />
            </div>
          ) : project.type === "Image" ? (
            <>
              <Hero image={project.mainImage} type={"contain"} />
            </>
          ) : null}

          <div className="projectPage" ref={scollToRef}>
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
                          className="catButtonSmall interactable"
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
                          className="catButtonSmall colored interactable"
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
    </div>
  );
}
