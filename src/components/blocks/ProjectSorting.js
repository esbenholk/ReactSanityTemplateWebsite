import React, { useState, useEffect, useContext } from "react";
import HeroProjectGrid from "./heroProjectGrid.js";
import AppContext from "../../globalState.js";
import ShowcaseCard from "../blocks/showcaseCard.js";
import useWindowDimensions from "../functions/useWindowDimensions.js";
import { useParams, useSearchParams } from "react-router-dom";
import { Pill } from "../blocks/heroProjectGrid.js";
import { HeaderLogoButton } from "../Header.js";

export default function Projects({
  projectList,
  displayCategoryButton,
  displayTagButton,
  displayStyle,
  displayYearButton,
  heading,
}) {
  const myContext = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const { slug } = useParams();
  const [searchSlug, setSearchSlug] = useState();
  const [searchParams] = useSearchParams();

  const [sortingMenuOpen, setSortingMenuOpen] = useState(false);
  const [shouldShowSortingMenu, setShouldShowSortingMenu] = useState(false);
  const [showFilteringTags, setShowFilteringTags] = useState(true);
  const [mode, setMode] = useState("grid");

  const [allPosts, setAllPosts] = useState(projectList);
  const [sortedPosts, setSortedPosts] = useState(null);
  const [tags, setTags] = useState(myContext.tags);
  const [currentTags, setCurrentTags] = useState([]);
  const [categories, setCategories] = useState(myContext.categories);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYears, setCurrentYears] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [fullCollaborators, setFullCollaborators] = useState([]);
  const [currentCollaborators, setCurrentCollaborators] = useState([]);
  const [filtersHasChanged, setFilterHasChanged] = useState(false);
  const [isMenuIntro, setIsMenuIntro] = useState(true);

  const [timelineYears, setTimelineYears] = useState([]);

  useEffect(() => {
    if (displayTagButton || displayCategoryButton || displayYearButton) {
      setShouldShowSortingMenu(true);
    }
  }, [displayTagButton, displayCategoryButton, displayYearButton]);

  useEffect(() => {
    var tags = [];
    var tagNames = [];
    var categories = [];
    var categoryNames = [];
    var years = [];
    var collaborators = [];
    var fullCollaborators = [];
    var tempProjectList;

    if (!projectList) {
      setAllPosts(myContext.projectList);
      setSortedPosts(myContext.projectList);
      tempProjectList = myContext.projectList;
    } else {
      setAllPosts(projectList);
      setSortedPosts(projectList);
      tempProjectList = projectList;
    }

    for (let index = 0; index < tempProjectList.length; index++) {
      const post = tempProjectList[index];
      post.value = 0;

      if (!years.includes(post.year)) {
        years.push(post.year);
      }

      if (post.collaborators != null && Array.isArray(post.collaborators)) {
        for (let index = 0; index < post.collaborators.length; index++) {
          const collaborator = post.collaborators[index];
          if (!collaborators.includes(collaborator.title)) {
            collaborators.push(collaborator.title);
            fullCollaborators.push(collaborator);
          }
        }
      }

      if (post.tags != null && Array.isArray(post.tags)) {
        for (let index = 0; index < post.tags.length; index++) {
          const tag = post.tags[index];
          if (!tagNames.includes(tag)) {
            tagNames.push(tag);
            tags.push(tag);
          }
        }
      }

      if (post.categories != null && Array.isArray(post.categories)) {
        for (let index = 0; index < post.categories.length; index++) {
          const category = post.categories[index];

          if (!categoryNames.includes(category.title)) {
            categoryNames.push(category.title);
            categories.push(category);
          }
        }
      }
    }

    let sortedTags = [...new Set(tags)];
    setTags(sortedTags);

    let sortedCategories = [...new Set(categories)];
    setCategories(sortedCategories);
    //

    let sortedYears = [...new Set(years)];
    setYears(sortedYears);

    let sortedCollaborators = [...new Set(collaborators)];
    setCollaborators(sortedCollaborators);

    setFullCollaborators(fullCollaborators);
  }, [projectList, currentTags, myContext, currentCategories, searchSlug]);

  useEffect(() => {
    if (
      currentTags.length > 0 ||
      currentCategories.length > 0 ||
      currentYears.length > 0 ||
      currentCollaborators.length > 0
    ) {
      const tempSortedPosts = [];

      setFilterHasChanged(true);

      ///loop through all posts
      for (let index = 0; index < allPosts.length; index++) {
        const post = allPosts[index];
        let post_score = 0;

        ///check the posts tags
        if (post.tags) {
          for (let index = 0; index < post.tags.length; index++) {
            const tag = post.tags[index];

            ///compare post tags to currentTags
            if (currentTags.includes(tag)) {
              //set post_score depending on how many currentTags the post is matching
              post_score = post_score + 1;
            }
          }
        }

        if (post.categories) {
          for (let index = 0; index < post.categories.length; index++) {
            const category = post.categories[index];
            // console.log("checks post categories", category);

            ///compare post tags to currentTags
            if (currentCategories.includes(category.title)) {
              //set post_score depending on how many currentTags the post is matching
              post_score = post_score + 5;
              // console.log("post matches a category");
            }
          }
        }

        if (post.collaborators) {
          for (let index = 0; index < post.collaborators.length; index++) {
            const collaborator = post.collaborators[index];

            ///compare post tags to currentTags
            if (currentCollaborators.includes(collaborator.title)) {
              //set post_score depending on how many currentTags the post is matching
              post_score = post_score + 10;
              // console.log("post matches a category");
            }
          }
        }

        if (currentYears.includes(post.year)) {
          post_score = post_score + 2;
        } else if (currentYears.length > 0) {
          post_score = 0;
        }

        if (post_score > 0) {
          post.value = post_score;
          tempSortedPosts.push(post);
        }
      }

      // in order to sort posts by sorted value
      tempSortedPosts.sort((a, b) => b.value - a.value);
      setSortedPosts(tempSortedPosts);

      createTimeLineObjects(tempSortedPosts);
    } else {
      setSortedPosts(allPosts);

      createTimeLineObjects(allPosts);
    }
  }, [
    currentTags,
    allPosts,
    currentCategories,
    currentYears,
    currentCollaborators,
  ]);

  function createTimeLineObjects(_sortedPosts) {
    let tempTimeLineYearObjects = [];
    let detectedYears = [];

    if (_sortedPosts) {
      _sortedPosts.sort((a, b) => b.year - a.year);

      _sortedPosts.forEach((project) => {
        if (!detectedYears.includes(project.year)) {
          let yearObject = { year: project.year, projects: [project] };
          tempTimeLineYearObjects.push(yearObject);
          detectedYears.push(project.year);
        } else if (detectedYears.includes(project.year)) {
          let yearObject = tempTimeLineYearObjects.find(
            (yearObject) => yearObject.year === project.year
          );
          yearObject.projects.push(project);
          // tempTimeLineYearObjects.push(yearObject);
        }
      });
    }

    setTimelineYears(tempTimeLineYearObjects);
  }

  function doElsCollide(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  useEffect(() => {
    const params = [];

    const handleScroll = (event) => {
      let yearHeadlines = document.getElementsByClassName("yearHeadline");

      let headlinePLace = document.getElementById("headLinePlace");
      if (yearHeadlines && yearHeadlines.length > 0 && headlinePLace !== null) {
        for (let index = 0; index < yearHeadlines.length; index++) {
          const element = yearHeadlines[index];
          if (element && doElsCollide(element, headlinePLace)) {
            headlinePLace.childNodes[0].innerText = element.innerText;
            headlinePLace.classList.add("visible");
          } else if (window.scrollY < 150) {
            headlinePLace.classList.remove("visible");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    searchParams.forEach((value, key) => {
      params.push([key, value]);
    });

    for (let index = 0; index < params.length; index++) {
      const element = params[index];

      if (element.length > 1) {
        setSearchSlug(element[0]);
      }
    }

    if (allPosts) {
      for (let index = 0; index < allPosts.length; index++) {
        const post = allPosts[index];
        post.value = 0;
        if (post.tags != null && Array.isArray(post.tags)) {
          const tempTags = [];

          for (let index = 0; index < post.tags.length; index++) {
            const tag = post.tags[index];
            if (searchSlug === tag) {
              tempTags.push(tag);
              setCurrentTags(tempTags);
              // let button = document.getElementById("tag_" + tag);
              // if (button) {
              //   button.classList.add("active");
              // }
              setTimeout(() => {
                setFilterHasChanged(false);
              }, 10);
            }
          }
        }

        if (post.categories != null && Array.isArray(post.categories)) {
          const tempCategories = [];
          for (let index = 0; index < post.categories.length; index++) {
            const category = post.categories[index];

            if (searchSlug === category.slug.current) {
              tempCategories.push(category.title);
              setCurrentCategories(tempCategories);

              setTimeout(() => {
                setFilterHasChanged(false);
              }, 10);
            }
          }
        }

        if (post.collaborators != null && Array.isArray(post.collaborators)) {
          const tempCollaborators = [];
          for (let index = 0; index < post.collaborators.length; index++) {
            const collaborator = post.collaborators[index];
            if (searchSlug === collaborator.slug) {
              tempCollaborators.push(collaborator.title);
              setCurrentCollaborators(tempCollaborators);
              console.log("has collaborator", collaborator.title);
              setTimeout(() => {
                setFilterHasChanged(false);
              }, 10);
            }
          }
        }
      }
    }
  }, [slug, searchParams, allPosts, searchSlug]);

  function setTag(_tag) {
    let tag;
    if (_tag.tag) {
      tag = _tag.tag;
    } else {
      tag = _tag;
    }

    if (!currentTags.includes(tag)) {
      const tempTags = [...currentTags];
      tempTags.push(tag);
      setCurrentTags(tempTags);
      let button = document.getElementById("tag_" + tag);
      if (button) {
        button.classList.add("active");
      }
    } else if (currentTags.includes(tag)) {
      var tagIndex = currentTags.indexOf(tag);
      currentTags.splice(tagIndex, 1);
      const tempTags = [...currentTags];
      setCurrentTags(tempTags);
      let button = document.getElementById("tag_" + tag);
      if (button) {
        button.classList.remove("active");
      }
    }
  }
  function setYear(year) {
    if (!currentYears.includes(year)) {
      const tempYears = [...currentYears];
      // the difference between being able to select several years
      // const tempYears = [];

      tempYears.push(year);
      setCurrentYears(tempYears);

      let button = document.getElementById("year_" + year.toString());
      if (button) {
        button.classList.add("active");
      }
    } else if (currentYears.includes(year)) {
      var ndex = currentYears.indexOf(year);
      currentYears.splice(ndex, 1);
      const tempYears = [...currentYears];
      let button = document.getElementById("year_" + year.toString());
      if (button) {
        button.classList.remove("active");
      }
      setCurrentYears(tempYears);
    }
  }
  function setCollaborator(collaborator) {
    if (!currentCollaborators.includes(collaborator)) {
      const tempCollaborators = [...currentCollaborators];
      // the difference between being able to select several years
      // const tempYears = [];
      tempCollaborators.push(collaborator);
      setCurrentCollaborators(tempCollaborators);

      let button = document.getElementById(
        "collaborator_" + collaborator.toString()
      );
      if (button) {
        button.classList.add("active");
      }
    } else if (currentCollaborators.includes(collaborator)) {
      var ndex = currentCollaborators.indexOf(collaborator);
      currentCollaborators.splice(ndex, 1);
      const tempCollaborators = [...currentCollaborators];

      setCurrentCollaborators(tempCollaborators);
      let button = document.getElementById(
        "collaborator_" + collaborator.toString()
      );
      if (button) {
        button.classList.remove("active");
      }
    }
  }
  function setCategory(category) {
    if (!currentCategories.includes(category.category.title)) {
      const tempCategories = [...currentCategories];
      tempCategories.push(category.category.title);
      setCurrentCategories(tempCategories);

      let button = document.getElementById(
        "category_" + category.category.title
      );

      if (button) {
        button.classList.add("active");
      }
    } else if (currentCategories.includes(category.category.title)) {
      var categoryIndex = currentCategories.indexOf(category.category.title);
      currentCategories.splice(categoryIndex, 1);
      const tempCategories = [...currentCategories];
      let button = document.getElementById(
        "category_" + category.category.title
      );

      if (button) {
        button.classList.remove("active");
      }

      setCurrentCategories(tempCategories);
    }
  }
  function removeCategory(category) {
    if (currentCategories.includes(category)) {
      var categoryIndex = currentCategories.indexOf(category);
      currentCategories.splice(categoryIndex, 1);
      const tempCategories = [...currentCategories];
      let button = document.getElementById("category_" + category);

      if (button) {
        button.classList.remove("active");
      }

      setCurrentCategories(tempCategories);
    }
  }
  function removeAllQueries() {
    console.log(currentCategories);

    currentCategories.forEach((category) => {
      removeCategory(category);
      console.log("removes CAT:", category, currentCategories);
    });

    setCurrentCategories([]);

    currentTags.forEach((tag) => {
      let button = document.getElementById("tag_" + tag);
      if (button) {
        button.classList.remove("active");
      }
    });
    setCurrentTags([]);

    currentCollaborators.forEach((collaborator) => {
      let button = document.getElementById("collaborator_" + collaborator);
      if (button) {
        button.classList.remove("active");
      }
    });
    setCurrentCollaborators([]);

    currentYears.forEach((year) => {
      let button = document.getElementById("year_" + year);
      if (button) {
        button.classList.remove("active");
      }
    });
    setCurrentYears([]);
  }

  return (
    <div className="projects">
      {mode !== "grid" && showFilteringTags && (
        <div
          className="headingButton lightButton projectTitle fixed top center"
          id="headLinePlace"
        >
          <p></p>
        </div>
      )}

      {shouldShowSortingMenu && (
        <>
          <div className={"fixed top flex-row wrap"}>
            <HeaderLogoButton projectName={""} />
            <div className={"flex-row align-center wrapcenter buttonList"}>
              {(showFilteringTags &&
                currentTags.length +
                  currentCategories.length +
                  currentYears.length +
                  currentCollaborators.length <
                  2) ||
              (showFilteringTags && width > 900) ? (
                <>
                  {" "}
                  {currentTags.length +
                    currentCategories.length +
                    currentYears.length +
                    currentCollaborators.length >
                  1 ? (
                    <>
                      {" "}
                      <button
                        style={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        className="catButtonBig sortingButton interactable"
                        onClick={(evt) => {
                          removeAllQueries();
                        }}
                      >
                        <img
                          alt="filter icon"
                          className={"unused"}
                          src={process.env.PUBLIC_URL + "/close.png"}
                        ></img>
                        <p>Clear All</p>
                      </button>
                    </>
                  ) : null}
                  {currentTags.length === 0 &&
                    currentCategories.length === 0 &&
                    currentYears.length === 0 &&
                    currentCollaborators.length === 0 && (
                      <div className="headingButton lightButton">
                        <p>TIMELINE</p>
                      </div>
                    )}
                  {currentCategories &&
                    currentCategories.map((category, index) => (
                      <button
                        style={{
                          backgroundColor: categories.find(
                            (e) => e.title === category
                          ).color,
                        }}
                        className="catButtonBig interactable"
                        key={index}
                        onClick={(evt) => {
                          removeCategory(category);
                        }}
                      >
                        <p> {category}</p>
                      </button>
                    ))}
                  {currentCollaborators &&
                    currentCollaborators.map((collaborator, index) => (
                      <button
                        style={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        className="catButtonBig interactable"
                        key={index}
                        onClick={() => {
                          setCollaborator(collaborator);
                        }}
                      >
                        <p> {collaborator}</p>
                      </button>
                    ))}{" "}
                  {currentTags &&
                    currentTags.map((tag, index) => (
                      <button
                        style={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        className="catButtonBig interactable"
                        key={index}
                        onClick={() => {
                          setTag(tag);
                        }}
                      >
                        <p> {tag}</p>
                      </button>
                    ))}
                  {currentYears &&
                    currentYears.map((year, index) => (
                      <button
                        style={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        className="catButtonBig interactable"
                        key={index}
                        onClick={() => {
                          setYear(year);
                        }}
                      >
                        <p>{year}</p>
                      </button>
                    ))}
                </>
              ) : null}
              <button
                onClick={(evt) => {
                  if (sortingMenuOpen) {
                    setSortingMenuOpen(false);
                    setFilterHasChanged(false);
                    setIsMenuIntro(true);
                    setShowFilteringTags(true);
                  } else {
                    setSortingMenuOpen(true);
                    setShowFilteringTags(false);
                  }
                }}
                className={
                  sortingMenuOpen && !filtersHasChanged
                    ? "active catButtonBig "
                    : sortingMenuOpen && filtersHasChanged
                    ? "active hasChanged catButtonBig"
                    : "catButtonBig noPadding"
                }
                style={{
                  backgroundColor:
                    filtersHasChanged && sortingMenuOpen
                      ? "#ffeb01"
                      : sortingMenuOpen
                      ? "black"
                      : "rgba(0,0,0,0)",
                  color: filtersHasChanged ? "black" : "white",
                }}
              >
                <img
                  alt="filter icon"
                  className={
                    sortingMenuOpen && filtersHasChanged
                      ? "applySign"
                      : currentTags.length > 0 ||
                        currentCategories.length > 0 ||
                        currentYears.length > 0 ||
                        currentCollaborators.length > 0
                      ? "plusSign"
                      : "unused"
                  }
                  src={
                    sortingMenuOpen && filtersHasChanged
                      ? process.env.PUBLIC_URL + "/filter_list.png"
                      : sortingMenuOpen
                      ? process.env.PUBLIC_URL + "/assets/close.svg"
                      : currentTags.length +
                          currentCategories.length +
                          currentYears.length +
                          currentCollaborators.length >
                        0
                      ? process.env.PUBLIC_URL + "/assets/close.svg"
                      : process.env.PUBLIC_URL + "/filter_list.png"
                  }
                ></img>

                {sortingMenuOpen && filtersHasChanged ? (
                  <>
                    {" "}
                    <p>APPLY FILTERS </p>
                    {currentTags.length +
                      currentCategories.length +
                      currentYears.length +
                      currentCollaborators.length >
                      0 && (
                      <p>
                        {" "}
                        {currentTags.length +
                          currentCategories.length +
                          currentYears.length +
                          currentCollaborators.length}
                      </p>
                    )}
                  </>
                ) : sortingMenuOpen ? (
                  <p>CLOSE FILTERS</p>
                ) : null}
              </button>{" "}
            </div>
          </div>
          {!sortingMenuOpen && width > 800 && (
            <div className={"fixed top modeButtonContainer header-padding"}>
              <button
                className="modeButton"
                onClick={() => {
                  if (mode === "grid") {
                    setMode("scroll");
                  } else {
                    setMode("grid");
                  }
                }}
              >
                <img
                  src={
                    process.env.PUBLIC_URL + mode === "grid"
                      ? "assets/gridIcon.svg"
                      : "assets/scrollIcon.svg"
                  }
                  alt="mode icon"
                />
              </button>
            </div>
          )}
        </>
      )}

      {width < 900 &&
        shouldShowSortingMenu &&
        showFilteringTags &&
        currentTags.length +
          currentCategories.length +
          currentYears.length +
          currentCollaborators.length >
          1 && (
          <div className="tagbuttongrid flex-row wrap align-center gap">
            {" "}
            {currentTags.length +
              currentCategories.length +
              currentYears.length +
              currentCollaborators.length >
            1 ? (
              <>
                {" "}
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  className="catButtonBig"
                  onClick={(evt) => {
                    removeAllQueries();
                    setFilterHasChanged(false);
                  }}
                >
                  <img
                    alt="filter icon"
                    className={"unused"}
                    src={process.env.PUBLIC_URL + "/close.png"}
                  ></img>
                  <p>Clear All</p>
                </button>
              </>
            ) : null}
            {currentTags.length === 0 &&
              currentCategories.length === 0 &&
              currentYears.length === 0 &&
              currentCollaborators.length === 0 && (
                <div className="headingButton">
                  <p>TIMELINE</p>
                </div>
              )}
            {currentCategories &&
              currentCategories.map((category, index) => (
                <button
                  style={{
                    backgroundColor: categories.find(
                      (e) => e.title === category
                    ).color,
                  }}
                  className="catButtonBig"
                  key={index}
                  onClick={(evt) => {
                    removeCategory(category);
                  }}
                >
                  <p> {category}</p>
                </button>
              ))}
            {currentCollaborators &&
              currentCollaborators.map((collaborator, index) => (
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  className="catButtonBig"
                  key={index}
                  onClick={() => {
                    setCollaborator(collaborator);
                  }}
                >
                  <p> {collaborator}</p>
                </button>
              ))}{" "}
            {currentTags &&
              currentTags.map((tag, index) => (
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  className="catButtonBig"
                  key={index}
                  onClick={() => {
                    setTag(tag);
                  }}
                >
                  <p> {tag}</p>
                </button>
              ))}
            {currentYears &&
              currentYears.map((year, index) => (
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  className="catButtonBig"
                  key={index}
                  onClick={() => {
                    setYear(year);
                  }}
                >
                  <p>{year}</p>
                </button>
              ))}
          </div>
        )}

      <div
        className={
          isMenuIntro
            ? "introStage sortingMenu flex-column"
            : " sortingMenu flex-column"
        }
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          pointerEvents: sortingMenuOpen ? "all" : "none",
          display: sortingMenuOpen ? "flex" : "none",
          zIndex: 9,
          overflowY: "scroll",
        }}
      >
        <div className={isMenuIntro ? "flex-column gap" : "flex-row fold"}>
          <div
            className={isMenuIntro ? "flex-column gap" : "flex-row column wrap"}
          >
            {isMenuIntro && (
              <button
                className="catButtonBig featured interactable allfilterButton"
                onClick={(evt) => {
                  setIsMenuIntro(false);
                  window.scrollTo(0, 0);
                }}
                style={{
                  height: `${
                    (height - 200) /
                    (categories.filter((category) => category.isFeatured)
                      .length +
                      1)
                  }px`,
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/assets/close.svg"}
                  alt="plussign"
                  style={{ transform: "rotate(45deg)", filter: "invert(1)" }}
                />
                <p>VIEW ALL FILTERS</p>
              </button>
            )}{" "}
            {displayCategoryButton &&
              categories &&
              categories.map(
                (category, index) =>
                  category.isFeatured && (
                    <button
                      style={{
                        height:
                          isMenuIntro &&
                          `${
                            (height - 200) /
                            (categories.filter(
                              (category) => category.isFeatured
                            ).length +
                              1)
                          }px`,
                        backgroundColor: !currentCategories.includes(
                          category.title
                        )
                          ? category.color
                          : "#ffeb01",
                      }}
                      className={`${isMenuIntro && "featured"} ${
                        currentCategories.includes(category.title) && "active"
                      } catButtonBig interactable category`}
                      key={index}
                      id={"category_" + category.title + ""}
                      onClick={(evt) => {
                        if (
                          isMenuIntro &&
                          !currentCategories.includes(category.title)
                        ) {
                          setSortingMenuOpen(false);
                          setShowFilteringTags(true);
                          setIsMenuIntro(true);
                          setTimeout(() => {
                            setFilterHasChanged(false);
                          }, 10);
                        } else {
                          setFilterHasChanged(true);
                        }
                        setCategory({ category });
                      }}
                    >
                      {category.title}
                    </button>
                  )
              )}
            {displayCategoryButton &&
              categories &&
              categories.map(
                (category, index) =>
                  !category.isFeatured && (
                    <button
                      style={{
                        backgroundColor: !currentCategories.includes(
                          category.title
                        )
                          ? category.color
                          : "#ffeb01",
                      }}
                      className={` ${
                        currentCategories.includes(category.title) && "active"
                      } catButtonBig interactable category`}
                      key={index}
                      id={"category_" + category.title + ""}
                      onClick={(evt) => {
                        setCategory({ category });
                      }}
                    >
                      {category.title}
                    </button>
                  )
              )}
          </div>
          <div className={isMenuIntro ? "flex-column" : "flex-row column wrap"}>
            {" "}
            {displayTagButton &&
              tags.map((tag, index) => (
                <button
                  className={` ${
                    currentTags.includes(tag) && "active"
                  } catButtonBig interactable tag`}
                  style={{
                    backgroundColor: currentTags.includes(tag)
                      ? "#ffeb01"
                      : "black",
                    color: currentTags.includes(tag) ? "black" : "white",
                  }}
                  key={index}
                  id={"tag_" + tag + ""}
                  onClick={() => {
                    setTag(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
          </div>
          <div className={isMenuIntro ? "flex-column" : "flex-row column wrap"}>
            {" "}
            {displayYearButton &&
              years &&
              years.map((year, index) => (
                <button
                  className={` ${
                    currentYears.includes(year) && "active"
                  } catButtonBig interactable tag`}
                  style={{
                    backgroundColor: currentYears.includes(year)
                      ? "#ffeb01"
                      : "black",
                    color: currentYears.includes(year) ? "black" : "white",
                  }}
                  key={index}
                  id={"year_" + year.toString()}
                  onClick={() => {
                    setYear(year);
                  }}
                >
                  {year}
                </button>
              ))}
          </div>
        </div>
        <div
          className={
            isMenuIntro
              ? "flex-column collaborators"
              : "flex-row wrap collaborators"
          }
        >
          {displayYearButton &&
            collaborators &&
            collaborators.map((collaborator, index) => (
              <button
                className={`${
                  currentCollaborators.includes(collaborator) && "active"
                } catButtonBig interactable tag`}
                style={{
                  backgroundColor: currentCollaborators.includes(collaborator)
                    ? "#ffeb01"
                    : "rgba(0,0,0,0)",
                }}
                key={index}
                id={"collaborator_" + collaborator.toString()}
                onClick={() => {
                  setCollaborator(collaborator);
                }}
              >
                <div
                  className="littelCircle"
                  style={{
                    backgroundColor: fullCollaborators.find(
                      (_collaborator) => _collaborator.title === collaborator
                    ).color,
                  }}
                ></div>
                <p>
                  {collaborator} {collaborator.color}
                </p>
              </button>
            ))}
        </div>
      </div>

      {heading ? (
        <h2 className="blockItemOpenRight blockItemHeadline">{heading}</h2>
      ) : null}

      {displayStyle === "showcase" && displayYearButton && (
        <div
          className={
            width < 900 &&
            shouldShowSortingMenu &&
            showFilteringTags &&
            currentTags.length +
              currentCategories.length +
              currentYears.length +
              currentCollaborators.length >
              1
              ? "block showcaseGrid lilpadding"
              : "block showcaseGrid"
          }
        >
          {timelineYears &&
            timelineYears.map((timelineYearObject, index) => (
              <div
                key={index}
                className={`${
                  mode === "grid"
                    ? ""
                    : "flex-column justify-center align-center"
                } `}
              >
                <p className="timelineYear yearHeadline">
                  {timelineYearObject.year}
                </p>
                <div
                  className={`${
                    mode === "grid"
                      ? "flex-row wrap foldOnPhone gridView"
                      : "flex-column scrollView justify-center align-center"
                  } `}
                >
                  {timelineYearObject.projects &&
                    timelineYearObject.projects.map((project, index) => (
                      <ShowcaseCard post={project} key={index} mode={mode} />
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {displayStyle === "showcase" && !displayYearButton && (
        <div className="flex-row wrap fold block showcaseGrid">
          {sortedPosts &&
            sortedPosts.map((project, index) => (
              <ShowcaseCard post={project} key={index} />
            ))}
        </div>
      )}
      {displayStyle === "cover" && (
        <div className="list">
          {sortedPosts &&
            sortedPosts.map((project, index) => (
              <HeroProjectGrid
                key={index}
                image={
                  project.heroImage ? project.heroImage : project.mainImage
                }
                heading={project.title}
                logo={project.logoImage}
                time={project.time}
                year={project.year}
                place={project.place}
                slug={project.slug.current}
              />
            ))}
        </div>
      )}

      {displayStyle === "pill" && (
        <div className="flex-column connectedprojectpill fullWidthBlock">
          {sortedPosts
            ? sortedPosts.map((project, index) => (
                <Pill
                  key={index}
                  image={
                    project.heroImage ? project.heroImage : project.mainImage
                  }
                  logo={project.logoImage}
                  time={project.time}
                  year={project.year}
                  place={project.place}
                  slug={project.slug.current}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
}
