/* eslint-disable no-lone-blocks */
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState, createRef } from "react";
// import NavBar from "./components/NavBar.js";
import "./App.css";
import sanityClient from "./client";
import Header from "./components/Header_function";

import { AnimatePresence, motion } from "framer-motion";

import Footer from "./components/Footer";

import AppContext from "./globalState";

import ScrollToTop from "./components/blocks/scrollToTop";

import Basket from "./components/blocks/basket";
import Dropdown from "./components/blocks/dropdown";

import useWindowDimensions from "./components/functions/useWindowDimensions";

import Loader from "./components/blocks/loader";

const SinglePost = lazy(() => import("./components/stickyScrollComponent.js"));
const LandingPage = lazy(() => import("./components/LandingPage.js"));
const ProjectList = lazy(() => import("./components/ProjectList.js"));
const PressList = lazy(() => import("./components/PressList.js"));

const Category = lazy(() => import("./components/Category.js"));
// const Home = lazy(() => import("./components/Home.js"));

function App() {
  const [siteSettings, setSiteSettings] = useState();
  const [projectList, setProjectList] = useState();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const mainRef = createRef();
  const { width } = useWindowDimensions();

  useEffect(() => {
    sanityClient
      .fetch(
        '*[_type == "siteSettings"]{title, greeting,logo{asset->{_id,url}}, socialMediaHandles[]{logo{asset->{_id,url}},url, URLName}}'
      )
      .then((data) => {
        console.log("CMS SITE DATA:", data);
        setSiteSettings(data[0]);
      })
      .catch(console.error);
  }, []);
  ///get data from website and so
  useEffect(() => {
    sanityClient
      .fetch(
        ' *[_type == "project"]{ title, slug, mainImage, tags, categories[]->{title, slug}, pageBuilder[]{ _type == "hero" => { _type, heading, tagline, image}, _type == "gallery" => { _type, heading,images}, _type == "breadContent" => { _type, heading, content}, _type == "connectedProjects" => {_type, heading, projects[]->{title, slug}}},}'
      )
      .then((data) => {
        console.log("CMS PROJECT DATA:", data[0]);
        data.sort((a, b) => b.year - a.year);
        setProjectList(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    var tags = [];
    if (projectList) {
      for (let index = 0; index < projectList.length; index++) {
        const post = projectList[index];

        if (post.tags != null && Array.isArray(post.tags)) {
          for (let index = 0; index < post.tags.length; index++) {
            const tag = post.tags[index];
            tags.push(tag);
          }
        }
      }
      let sortedTags = [...new Set(tags)];
      setTags(sortedTags);
    }
  }, [projectList]);

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
      <main>
        <Suspense fallback={<Loader />}>
          <AppContext.Provider value={globalContext}>
            <BrowserRouter>
              {siteSettings && <Header />}

              <AnimatePresence>
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
                        {siteSettings && (
                          <LandingPage
                            info={siteSettings}
                            projectList={projectList}
                          />
                        )}
                      </Route>

                      <Route path="/projects">
                        <ProjectList projectList={projectList} />
                      </Route>
                      {/* <Route path="/about">
                        <Home info={siteSettings} projectList={projectList} />
                      </Route> */}
                      <Route path="/loader">
                        <Loader />
                      </Route>
                      <Route path="/category/:slug">
                        <Category />
                      </Route>
                      <Route exact path="/press">
                        <PressList />
                      </Route>
                      <Route exact path="/:slug">
                        <SinglePost />
                      </Route>
                    </Switch>
                  </ScrollToTop>
                </motion.div>
              </AnimatePresence>
              {/* {siteSettings && <Footer />} */}
            </BrowserRouter>
          </AppContext.Provider>
        </Suspense>
      </main>
    </>
  );
}

export default App;
