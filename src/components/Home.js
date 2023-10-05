import React, { useContext, useState, useEffect } from "react";

import AppContext from "../globalState";
import { motion } from "framer-motion";

import BlockContent from "./blocks/BlockContent";

import useWindowDimensions from "./functions/useWindowDimensions";

import Image from "./blocks/image";

import { Link } from "react-router-dom";

import sanityClient from "../client";

import imageUrlBuilder from "@sanity/image-url";

import { toggleHover } from "./functions/toggleHover";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}
function hover(e) {
  toggleHover({ e });
}

export default function Home() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const { width } = useWindowDimensions();

  const [pressList, setPressList] = useState();

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

  function ShowDetails() {
    return (
      <div className="flex-row align-top justifyBetween contactDetails fullWidthPadded">
        {info && (
          <>
            <div className="flex-column align-with-projectlist-categories">
              {info.contactHours ? <h2>Opening Hours</h2> : null}

              {info.contactHours ? (
                <div className="contact_detail_content">
                  <BlockContent blocks={info.contactHours} />
                </div>
              ) : null}
            </div>
            <div className="flex-column">
              {info.contactDetails ? <h2>Contact</h2> : null}

              {info.contactDetails ? (
                <div className="contact_detail_content">
                  <BlockContent blocks={info.contactDetails} />
                </div>
              ) : null}
            </div>
            <div
              className={
                width > 900 ? "flex-column align-right" : "flex-column"
              }
            >
              {info.socialMediaHandles ? <h2>Follow</h2> : null}

              {info.socialMediaHandles &&
                info.socialMediaHandles.map((handle, index) => (
                  <a
                    href={handle.url}
                    key={index}
                    id={"category_" + handle.url + ""}
                  >
                    {handle.URLName}
                  </a>
                ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={
          width > 900
            ? "content-container fullWidthPadded"
            : "content-container"
        }
      >
        {info ? (
          <div className="flex-row align-top reverse-direction">
            {width > 900 && info.authorImage ? (
              <>
                <Image image={info.authorImage} class={"authorImage"} />
              </>
            ) : null}
            <div className="aboutSection">
              <div>
                <motion.h1
                  className={
                    width < 900 ? "headline  fullWidthPadded" : "headline "
                  }
                >
                  About Tomato Cappelletti
                </motion.h1>

                {info.about ? (
                  <div
                    className={
                      width < 900
                        ? "content aboutContent fullWidthPadded"
                        : "content aboutContent"
                    }
                  >
                    <BlockContent blocks={info.about} />
                  </div>
                ) : null}

                {width < 900 && info.authorImage ? (
                  <Image
                    image={info.authorImage}
                    class={"mainImage fullwidth authorImage"}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className={
          width > 900
            ? "content-container fullWidthPadded regContainer"
            : "content-container fullWidthPadded regContainer"
        }
      >
        {pressList && (
          <div className="projectList-item">
            <h1 className="categories">Press</h1>
            <div>
              <h1 className="hidden">Category</h1>
            </div>
            {width > 900 ? <h1>Year</h1> : null}
          </div>
        )}
        {pressList &&
          pressList.map((project, index) => (
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
                    >
                      {project.title ? project.title : "undefined"}
                    </a>
                    {project.mainImage.hotspot ? (
                      <img
                        src={urlFor(project.mainImage.asset.url).url()}
                        alt={project.mainImage.alt}
                        style={{
                          objectPosition: `${
                            project.mainImage.hotspot.x * 100
                          }% ${project.mainImage.hotspot.y * 100}%`,
                        }}
                        className="thumbnail minThumbnail seeOnHover hidden"
                      />
                    ) : (
                      <img
                        src={urlFor(project.mainImage.asset.url).url()}
                        alt={project.mainImage.alt}
                        className="thumbnail minThumbnail seeOnHover hidden"
                      />
                    )}
                  </div>
                ) : (
                  <div className="categories">
                    {" "}
                    <a
                      href={project.url}
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      {project.title ? project.title : "undefined"}
                    </a>
                    {project.mainImage.hotspot ? (
                      <img
                        src={urlFor(project.mainImage.asset.url).url()}
                        alt={project.mainImage.alt}
                        style={{
                          objectPosition: `${
                            project.mainImage.hotspot.x * 100
                          }% ${project.mainImage.hotspot.y * 100}%`,
                        }}
                        className="thumbnail minThumbnail seeOnHover hidden"
                      />
                    ) : (
                      <img
                        src={urlFor(project.mainImage.asset.url).url()}
                        alt={project.mainImage.alt}
                        className="thumbnail minThumbnail seeOnHover hidden"
                      />
                    )}
                  </div>
                )}

                <div>
                  {project.categories &&
                    project.categories.map((category, index) => (
                      <>
                        {category.title === "Freebie" ||
                          (category.title === "Freebie" ? (
                            <></>
                          ) : (
                            <Link
                              key={index}
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
          ))}
      </div>

      <ShowDetails />
    </div>
  );
}
