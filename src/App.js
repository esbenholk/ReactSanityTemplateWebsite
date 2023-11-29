/* eslint-disable no-lone-blocks */
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState, createRef } from "react";
// import NavBar from "./components/NavBar.js";
import "./App.css";
import sanityClient from "./client";
import Header from "./components/Header";
import AppContext from "./globalState";

import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "./components/functions/useWindowDimensions";
import { HeadTags } from "./components/blocks/helmetHeaderTags";
import { pageBuilderquerystring } from "./components/queeries.js";

import SlugContext from "./components/slugContext";

import Footer from "./components/Footer";

import ScrollToTop from "./components/blocks/scrollToTop";

const LandingPage = lazy(() => import("./components/LandingPage.js"));

function App() {
  const [siteSettings, setSiteSettings] = useState();
  const [projectList, setProjectList] = useState();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const mainRef = createRef();
  const { width } = useWindowDimensions();
  const [categoryNames, setCategoryNames] = useState([]);
  const [pageNames, setPageNames] = useState([]);

  // get sitesettings and page names (for slug redirection)
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteSettings" ]{mainImage{asset->{_id,url}, hotspot}, title,favicon{asset->{_id,url}}, title,  greeting, logo{asset->{_id,url}, hotspot}, institutions, breadContent,footerMenuSocials[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, ${pageBuilderquerystring}, burgerTop, burgerBottom, leftButtonLink{page->{slug}, project->{slug},url, title, image}, rightButtonLink{page->{slug}, project->{slug},url, title, image}, cubeMap, headerMenu[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, footerMenu {_type == "linkArrayColumns" => { _type,heading, columns[]{heading, links{external_links[]{title, image, url, page->{slug}, project->{slug}}}}}}}`
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
        ' *[_type == "project"]{ title, slug, mainImage, heroImage, buttons, tags, categories[]->{title, slug}}'
      )
      .then((data) => {
        console.log(data);
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
                {siteSettings && <Header />}

                <motion.div
                  className="mainContainer"
                  ref={mainRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ScrollToTop>
                    <Switch>
                      <Route exact path="/">
                        {siteSettings && <LandingPage />}
                      </Route>
                      <Route exact path="/:slug">
                        {categoryNames && (
                          <SlugContext
                            CategoryNames={categoryNames}
                            PageNames={pageNames}
                          />
                        )}
                      </Route>
                    </Switch>
                  </ScrollToTop>
                </motion.div>

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
