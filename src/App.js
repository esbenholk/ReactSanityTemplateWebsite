/* eslint-disable no-lone-blocks */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState, createRef } from "react";
// import NavBar from "./components/NavBar.js";
import "./App.css";
import sanityClient from "./client";
import Header from "./components/Header";
import AppContext from "./globalState";

import { motion } from "framer-motion";

import { HeadTags } from "./components/blocks/helmetHeaderTags";
import { pageBuilderquerystring } from "./components/queeries.js";

import SlugContext from "./components/slugContext";
import TickerComp from "./components/blocks/ticker.js";
import Footer from "./components/Footer";

const LandingPage = lazy(() => import("./components/LandingPage.js"));

function App() {
  const [siteSettings, setSiteSettings] = useState();
  const [projectList, setProjectList] = useState();

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const mainRef = createRef();
  const [categoryNames, setCategoryNames] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  const [pageTitle, setPageTitle] = useState();
  const [projectTitle, setProjectTitle] = useState();
  const [projectLogo, setProjectLogo] = useState();

  const updatePageTitle = (newTitle) => {
    setPageTitle(newTitle);
  };
  const updateProjectTitle = (newTitle) => {
    setProjectTitle(newTitle);
  };

  const updateProjectLogo = (newLogo) => {
    setProjectLogo(newLogo);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get sitesettings and page names (for slug redirection)
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteSettings" ]{junglenavigation[]{title, url, frameTitle, frameDescription, image}, greetings,mainImage{asset->{_id,url}, hotspot}, title,favicon{asset->{_id,url}}, title,  greeting, logo{asset->{_id,url}, hotspot}, institutions, breadContent,footerMenuSocials[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, ${pageBuilderquerystring}, burgerTop, burgerBottom, leftButtonLink{page->{slug}, project->{slug},url, title, image}, rightButtonLink{page->{slug}, project->{slug},url, title, image}, cubeMap, headerMenu[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, footerMenu {_type == "linkArrayColumns" => { _type,heading, columns[]{heading, links{external_links[]{title, image, url, page->{slug}, project->{slug}}}}}}}`
      )
      .then((data) => {
        setSiteSettings(data[0]);
        console.log(data);
      })
      .catch(console.error);

    sanityClient
      .fetch('*[_type == "page" ]{title, slug}')
      .then((data) => {
        setPageNames(data);
      })
      .catch(console.error);
  }, []);

  ///get project data, set category names
  useEffect(() => {
    sanityClient
      .fetch(
        ' *[_type == "project"]{ title, slug, description, year, mainImage, heroImage, buttons, tags, categories[]->{title, slug, color, isFeatured}, collaborators[]->{title, color, code, slug}}'
      )
      .then((data) => {
        data.sort((a, b) => b.year - a.year);
        setProjectList(data);

        var categories = [];
        var tempCategoryNames = [];
        for (let index = 0; index < data.length; index++) {
          const post = data[index];
          if (post.categories != null && Array.isArray(post.categories)) {
            for (let index = 0; index < post.categories.length; index++) {
              const category = post.categories[index];

              if (!tempCategoryNames.includes(category.title)) {
                tempCategoryNames.push(category.title);
                categories.push(category);
              }
            }
          }
        }
        setCategoryNames(tempCategoryNames);
      })
      .catch(console.error);
  }, []);

  ///set global context available
  const globalContext = {
    siteSettings: siteSettings,
    projectList: projectList,
    tags: tags,
    categories: categories,
    mainRef: mainRef,
    setSiteSettings,
    setProjectList,
    setTags,
    setCategories,
  };

  return (
    <>
      {siteSettings && (
        <>
          <HeadTags
            title={siteSettings.title}
            description={siteSettings.greeting}
            imageUrl={siteSettings.logo.asset.url}
            faviconUrl={siteSettings.logo.asset.url}
          />
          <Suspense fallback={<div className="loader"></div>}>
            <AppContext.Provider value={globalContext}>
              <BrowserRouter>
                {siteSettings && (
                  <Header
                    pageName={pageTitle}
                    projectName={projectTitle}
                    projectLogo={projectLogo}
                  />
                )}
                <motion.div
                  className="mainContainer"
                  ref={mainRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Routes>
                    <Route
                      exact
                      path="/"
                      element={siteSettings && <LandingPage />}
                    ></Route>
                    <Route
                      exact
                      path="/:slug"
                      element={
                        categoryNames && (
                          <SlugContext
                            CategoryNames={categoryNames}
                            PageNames={pageNames}
                            updatePageTitle={updatePageTitle}
                            updateProjectTitle={updateProjectTitle}
                            updateProjectLogo={updateProjectLogo}
                          />
                        )
                      }
                    ></Route>
                  </Routes>
                </motion.div>
                <TickerComp />
                {siteSettings && <Footer />}
              </BrowserRouter>
            </AppContext.Provider>
          </Suspense>
        </>
      )}
    </>
  );
}

export default App;
