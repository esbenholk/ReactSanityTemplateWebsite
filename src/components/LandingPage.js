import React, { useContext, useEffect, useState } from "react";

import { motion } from "framer-motion";

import Projects from "./blocks/Projects";

import AppContext from "../globalState";

import FeaturedCard from "./blocks/featuredCard";

import CustomCarousel from "./blocks/Carousel";
import Image from "./blocks/image";

import { Link } from "react-router-dom";
import { HeadTags } from "./blocks/helmetHeaderTags";

import useWindowDimensions from "./functions/useWindowDimensions";

export default function LandingPage() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const projectList = myContext.projectList;
  const { width } = useWindowDimensions();
  console.log(info);

  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    if (myContext.hasFeaturedPosts === true && projectList) {
      const featuredProjects = [];
      for (let index = 0; index < projectList.length; index++) {
        const post = projectList[index];
        if (info.featuredProjects.includes(post.title)) {
          featuredProjects.push(post);
        }
      }
      setFeaturedProjects(featuredProjects);
    }
  }, [myContext.hasFeaturedPosts, projectList, info]);

  return (
    <motion.div
    // layout
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1 }}
    // exit={{ opacity: 0 }}
    >
      {info.greeting && (
        <motion.h1 className="headline flex-column fullWidthPadded">
          {info.greeting}
        </motion.h1>
      )}

      {info && (
        <HeadTags
          title={info.title}
          description={info.greeting}
          image={info.mainImage.asset.url}
        />
      )}

      <>
        {info.mainImages ? (
          <div className={width > 900 ? "fullWidthPadded" : ""}>
            {width > 900 ? (
              <CustomCarousel
                arrows={true}
                swipe={true}
                classsss={""}
                autoplay={true}
                currentIndex={0}
              >
                {info.mainImages.map((image, index) => (
                  <>
                    {info.mainImageLinks[index].includes("http") ? (
                      <a
                        href={info.mainImageLinks[index]}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div key={index}>
                          <Image image={image} class={"mainImage fullwidth"} />
                        </div>
                      </a>
                    ) : (
                      <Link to={info.mainImageLinks[index]} key={index}>
                        <div key={index}>
                          <Image image={image} class={"mainImage fullwidth"} />
                        </div>
                      </Link>
                    )}{" "}
                  </>
                ))}
              </CustomCarousel>
            ) : (
              <CustomCarousel
                arrows={false}
                swipe={true}
                classsss={""}
                autoplay={true}
                currentIndex={0}
              >
                {info.mainImages.map((image, index) => (
                  <>
                    {info.mainImageLinks[index].includes("http") ? (
                      <a
                        href={info.mainImageLinks[index]}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div key={index}>
                          <Image image={image} class={"mainImage fullwidth"} />
                        </div>
                      </a>
                    ) : (
                      <Link to={info.mainImageLinks[index]} key={index}>
                        <div key={index}>
                          <Image image={image} class={"mainImage fullwidth"} />
                        </div>
                      </Link>
                    )}{" "}
                  </>
                ))}
              </CustomCarousel>
            )}
          </div>
        ) : (
          <>
            {info.mainImage ? (
              <div className="fullWidthPadded">
                <Image image={info.mainImage} class={"mainImage fullwidth"} />
              </div>
            ) : null}{" "}
          </>
        )}
      </>

      {myContext.hasFeaturedPosts && featuredProjects ? (
        <div
          className={
            info.mainImage || info.mainImages.length > 0
              ? "regContainer"
              : "regContainer no-top"
          }
        >
          {info.featured_project_title ? (
            <motion.h1 className="headline flex-column fullWidthPadded">
              {info.featured_project_title}
            </motion.h1>
          ) : null}

          {width > 1050 ? (
            <div className="fullWidthPadded">
              <CustomCarousel
                arrows={true}
                classsss={"featured_post_container"}
              >
                {featuredProjects.map((post, index) => (
                  <FeaturedCard post={post} key={index} />
                ))}
              </CustomCarousel>
            </div>
          ) : (
            <div className="horizontalScroll overscrollPadded">
              {featuredProjects.map((post, index) => (
                <FeaturedCard post={post} key={index} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {projectList ? (
        <div className="regContainer">
          {info.More_skills_and_ideas && (
            <motion.h1 className="flex-column fullWidthPadded noMargin">
              {info.More_skills_and_ideas}{" "}
            </motion.h1>
          )}
          {info.More_skills_and_ideas2 && (
            <motion.h1 className="subheadline flex-column fullWidthPadded">
              {info.More_skills_and_ideas2}{" "}
            </motion.h1>
          )}

          <Projects
            projectList={projectList}
            show_categories={true}
            postcard={true}
            columns={3}
            shouldHaveFreebieSign={false}
            columnAmountOn390={1}
          />
        </div>
      ) : null}
    </motion.div>
  );
}
