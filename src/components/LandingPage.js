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
    <motion.div>
      {info.greeting && (
        <motion.h1 className="headline flex-column fullWidthPadded">
          {info.greeting}
        </motion.h1>
      )}

      {info && <HeadTags title={info.title} description={info.greeting} />}

      {projectList ? (
        <div className="regContainer">
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
