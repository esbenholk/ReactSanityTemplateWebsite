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
  const [shouldShowPopUp, setshouldShowPopUp] = useState(true);

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const [basket_message, setBasket_message] = useState("Your cart is empty.");

  const [hasFeaturedPosts, setHasFeaturedPosts] = useState(false);

  const mainRef = createRef();

  const { width } = useWindowDimensions();

  ///get data from website and so
  useEffect(() => {
    ///get the site settings and basic info
    // sanityClient
    //   .fetch(
    //     '*[_type == "siteSettings"]{title, greeting, More_skills_and_ideas, More_skills_and_ideas2, featured_project_title, mainImage{asset->{_id,url}, hotspot, alt}, mainImages, mainImageLinks, authorImage{asset->{_id,url}, hotspot, alt}, shouldpopup, popupimage{asset->{_id,url}},  logo{asset->{_id,url}}, footerlogo{asset->{_id,url}}, desktopfooterlogo{asset->{_id,url}},featuredProjects, about, contact, socialMediaHandles[]{logo{asset->{_id,url}},url, URLName}, contactDetails, contactHours, email}'
    //   )
    //   .then((data) => {
    //     setSiteSettings(data[0]);
    //     if (data[0].featuredProjects && data[0].featuredProjects.length > 0) {
    //       setHasFeaturedPosts(true);
    //     }
    //   })
    //   .catch(console.error);
    ////get all the projects
    sanityClient
      .fetch(
        '*[_type == "Post"]{title,mainImage{asset->{_id,url}, hotspot, alt}, productImage{asset->{_id,url}, hotspot, alt}, year, abbreviated_year, abbreviated_year2, star_rating ,slug, categories[]->{title, slug}, tags, color, recap,description, yearString}'
      )
      .then((data) => {
        console.log("CMS DATA:" + data);
        data.sort((a, b) => b.year - a.year);
        setProjectList(data);
      })
      .catch(console.error);
    // sanityClient
    //   .fetch('*[_type == "category"]{ title, slug, description, priority}')
    //   .then((data) => {
    //     data.sort((a, b) => a.priority - b.priority);
    //     console.log("has categories", data);
    //     // for (let index = 0; index < data.length; index++) {
    //     //   const category = data[index];
    //     //   if (category.title !== "Freebie") {
    //     //     categories.push(category);
    //     //   }
    //     // }
    //     setCategories(data);
    //   })
    //   .catch(console.error);
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
    basket: basket,
    tags: tags,
    categories: categories,
    hasFeaturedPosts: hasFeaturedPosts,
    mainRef: mainRef,
    setSiteSettings,
    setProjectList,
    setBasket,
    setTags,
    setCategories,
    setHasFeaturedPosts,
  };

  function updatebasket(string) {
    if (string !== "remove") {
      if (string !== "Thanks for shopping with us") {
        setIsBasketOpen(!isBasketOpen);
      }
    }
    setBasket_message(string);
  }

  return (
    <>
      <main>
        <Suspense fallback={<Loader />}>
          <AppContext.Provider value={globalContext}>
            <BrowserRouter>
              {siteSettings && (
                <>
                  {" "}
                  {width > 1050 ? (
                    <nav className="fullWidthPadded normPaddingMobile">
                      <Header />
                      <div className="flex-row" style={{ minWidth: "40%" }}>
                        <Dropdown categories={categories} mainRef={mainRef} />
                        <Basket
                          basket={basket}
                          basket_message={basket_message}
                          isBasketOpen={isBasketOpen}
                          updatebasket={updatebasket}
                        />
                      </div>
                    </nav>
                  ) : (
                    <>
                      <nav
                        className="fullWidthPadded"
                        style={{ width: "100%" }}
                      >
                        <div className="flex-row" style={{ width: "100%" }}>
                          <Header />
                          <Basket
                            basket={basket}
                            isBasketOpen={isBasketOpen}
                            basket_message={basket_message}
                            updatebasket={updatebasket}
                          />
                        </div>
                        <Dropdown categories={categories} mainRef={mainRef} />
                      </nav>
                    </>
                  )}
                </>
              )}

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
                        <SinglePost updatebasket={updatebasket} />
                      </Route>
                    </Switch>
                  </ScrollToTop>
                </motion.div>
              </AnimatePresence>
              {siteSettings && <Footer />}
              {siteSettings &&
              siteSettings.shouldpopup &&
              siteSettings.popupimage &&
              shouldShowPopUp ? (
                <>
                  <div className="overlay popupcontainer"></div>
                  <div className="popup">
                    <img
                      src={siteSettings.popupimage.asset.url}
                      style={{
                        width: "100%",
                      }}
                      alt="popupimage"
                    ></img>
                    <div className="popupheader">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setshouldShowPopUp(false);
                        }}
                      >
                        <img
                          alt="closeicon"
                          src="../assets/CloseCross.svg"
                        ></img>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </BrowserRouter>
          </AppContext.Provider>
        </Suspense>
      </main>
    </>
  );
}

export default App;
