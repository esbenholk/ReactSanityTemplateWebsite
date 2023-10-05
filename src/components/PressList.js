import sanityClient from "../client";
import React, { useState, useEffect, useContext } from "react";

import imageUrlBuilder from "@sanity/image-url";

import { motion } from "framer-motion";

import { toggleHover } from "./functions/toggleHover";
import AppContext from "../globalState";

import useWindowDimensions from "./functions/useWindowDimensions";
import { HeadTags } from "./blocks/helmetHeaderTags";

import { Link } from "react-router-dom";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}
function hover(e) {
  toggleHover({ e });
}

export default function Projects() {
  const { width } = useWindowDimensions();
  const [pressList, setPressList] = useState();
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  useEffect(() => {
    sanityClient
      .fetch(
        '*[_type == "press"]{title,mainImage{asset->{_id,url}, hotspot, alt}, url, year, categories[]->{title, slug}, yearString}'
      )
      .then((press) => {
        setPressList(press);
      })
      .catch(console.error);
  }, []);

  return (
    <motion.div
      className="projectList fullWidthPadded"
      // layout
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
    >
      {info && (
        <HeadTags
          title={info.title}
          description={info.greeting}
          image={info.mainImage.asset.url}
        />
      )}
      <div className="projectList-item">
        <h1 className={width > 900 ? "categories" : "categories headline"}>
          Press
        </h1>
        <div>
          <h1 className="hidden"> Category</h1>
        </div>
        {width > 900 ? <h1>Year</h1> : null}
      </div>
      {pressList &&
        pressList.map((project, index) => (
          <>
            {project.categories[0].title === "Creative" ? (
              <></>
            ) : (
              <>
                <div key={index} className="projectList-item">
                  {width > 900 ? (
                    <div
                      onMouseEnter={hover}
                      onMouseLeave={hover}
                      className="categories"
                    >
                      {" "}
                      <a
                        href={project.url}
                        target={"_blank"}
                        rel="noopener noreferrer"
                        class="underlined"
                      >
                        {project.title ? project.title : "undefined"}
                      </a>
                      {project.mainImage.hotspot && width > 900 ? (
                        <img
                          src={urlFor(project.mainImage.asset.url).url()}
                          alt={project.mainImage.alt}
                          style={{
                            objectPosition: `${
                              project.mainImage.hotspot.x * 100
                            }% ${project.mainImage.hotspot.y * 100}%`,
                          }}
                          className="thumbnail seeOnHover hidden"
                        />
                      ) : (
                        <img
                          src={urlFor(project.mainImage.asset.url).url()}
                          alt={project.mainImage.alt}
                          className="thumbnail seeOnHover hidden"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="categories">
                      {" "}
                      <Link to={project.slug.current} class="underlined">
                        {project.title ? project.title : "undefined"}
                      </Link>
                    </div>
                  )}
                  <div className="projectList-item">
                    {project.categories &&
                      project.categories.map((category, index) => (
                        <>
                          {category.title === "Freebie" ||
                            (category.title === "Freebie" ? (
                              <></>
                            ) : (
                              <Link
                                key={index}
                                class="underlined"
                                id={"category_" + category.title + ""}
                                to={"/category/" + category.slug.current}
                              >
                                {category.title}
                                {index + 1 !== project.categories.length
                                  ? ", "
                                  : null}
                              </Link>
                            ))}
                        </>
                      ))}
                  </div>

                  {width > 900 ? (
                    <p className="flex-row align-left">
                      {project.year ? project.year : "undefined"}{" "}
                      {project.yearString ? <u>{project.yearString}</u> : null}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </>
        ))}
    </motion.div>
  );
}
