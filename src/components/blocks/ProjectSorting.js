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
  const { width } = useWindowDimensions();
  const { slug } = useParams();
  const [searchSlug, setSearchSlug] = useState();
  const [searchParams] = useSearchParams();

  const [sortingMenuOpen, setSortingMenuOpen] = useState(false);
  const [shouldShowSortingMenu, setShouldShowSortingMenu] = useState(false);
  const [showFilteringTags, setShowFilteringTags] = useState(true);

  const [allPosts, setAllPosts] = useState(projectList);
  const [sortedPosts, setSortedPosts] = useState(null);
  const [tags, setTags] = useState(myContext.tags);
  const [currentTags, setCurrentTags] = useState([]);
  const [categories, setCategories] = useState(myContext.categories);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYears, setCurrentYears] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
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
    var tempProjectList;

    if (!projectList) {
      setAllPosts(myContext.projectList);
      setSortedPosts(myContext.projectList);
      console.log("finds all projects", myContext);
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
              post_score = post_score + 2;
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
              post_score = post_score + 2;
              // console.log("post matches a category");
            }
          }
        }

        if (currentYears.includes(post.year.toString())) {
          post_score = post_score + 3;
        }

        if (post_score > 0) {
          post.value = post_score;
          tempSortedPosts.push(post);
        }
      }

      // in order to sort posts by sorted value
      tempSortedPosts.sort((a, b) => b.value - a.value);

      // in order to sort posts by year
      // tempSortedPosts.sort((a, b) => b.year - a.year);

      setSortedPosts(tempSortedPosts);
    } else {
      setSortedPosts(allPosts);

      console.log(
        "search is empty",
        currentTags,
        currentCollaborators,
        currentCategories,
        currentYears,
        allPosts
      );
    }
  }, [
    currentTags,
    allPosts,
    currentCategories,
    currentYears,
    currentCollaborators,
  ]);

  useEffect(() => {
    let tempTimeLineYearObjects = [];
    if (sortedPosts) {
      sortedPosts.sort((a, b) => b.year - a.year);

      sortedPosts.forEach((project) => {
        if (!tempTimeLineYearObjects.includes(project.year)) {
          let yearObject = { year: project.year, projects: [project] };
          tempTimeLineYearObjects.push(yearObject);
        } else if (tempTimeLineYearObjects.includes(project.year)) {
          let yearObject = tempTimeLineYearObjects.find(
            (yearObject) => yearObject.year === project.year
          );
          tempTimeLineYearObjects.push(yearObject);
        }
      });
    }

    console.log(
      "TIMELINE YEARS in seperate useeffect",
      tempTimeLineYearObjects
    );
    setTimelineYears(tempTimeLineYearObjects);
  }, [sortedPosts]);

  useEffect(() => {
    const params = [];

    searchParams.forEach((value, key) => {
      params.push([key, value]);
    });

    for (let index = 0; index < params.length; index++) {
      const element = params[index];
      console.log("NEW PARAMS", params);

      if (element.length > 1) {
        setSearchSlug(element[0]);
      }
    }

    console.log("NEW SLUG", slug, searchSlug);
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

              // console.log("sets category active from url");
              // let button = document.getElementById(
              //   "category_" + category.title
              // );
              // if (button) {
              //   button.classList.add("active");
              // }
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
      console.log("SETS TAG", tag);
      const tempTags = [...currentTags];
      tempTags.push(tag);
      setCurrentTags(tempTags);
      let button = document.getElementById("tag_" + tag);
      if (button) {
        button.classList.add("active");
      }
    } else if (currentTags.includes(tag)) {
      console.log("REMOVES TAG", tag);
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
      console.log("sets collaborator", collaborator);
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

      console.log("removes collaborator", collaborator);

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
    currentCategories.forEach((category) => {
      removeCategory(category);
    });

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
      {shouldShowSortingMenu && (
        <div className="fixed top flex-row align-center gap">
          <HeaderLogoButton projectName={""} />
          {showFilteringTags && (
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
                    className="standardButton sortingButton filterButton"
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
                  <div className="standardButton">
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
                    className="standardButton sortingButton"
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
                    className="standardButton sortingButton"
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
                    className="standardButton sortingButton"
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
                    className="standardButton sortingButton"
                    key={index}
                    onClick={() => {
                      setYear(year);
                    }}
                  >
                    <p>{year}</p>
                  </button>
                ))}
            </>
          )}
          <button
            className={
              sortingMenuOpen && !filtersHasChanged
                ? "active standardButton filterButton flex-row align-center justify-center"
                : sortingMenuOpen && filtersHasChanged
                ? "standardButton active hasChanged filterButton flex-row align-center justify-center"
                : "standardButton filterButton flex-row align-center justify-center"
            }
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
              // style={{
              //   transform:
              //     currentTags.length > 0 ||
              //     currentCategories.length > 0 ||
              //     currentYears.length > 0 ||
              //     currentCollaborators.length > 0
              //       ? "rotate(45deg)"
              //       : filtersHasChanged
              //       ? "rotate(180g)"
              //       : null,
              //   // filter:
              //   //   currentTags.length > 0 ||
              //   //   currentCategories.length > 0 ||
              //   //   currentYears.length > 0 ||
              //   //   currentCollaborators.length > 0
              //   //     ? "invert(1)"
              //   //     : filtersHasChanged
              //   //     ? "invert(0)"
              //   //     : null,
              // }}
              src={
                sortingMenuOpen && filtersHasChanged
                  ? process.env.PUBLIC_URL + "/filter_list.png"
                  : sortingMenuOpen
                  ? process.env.PUBLIC_URL + "/close.png"
                  : currentTags.length > 0 ||
                    currentCategories.length > 0 ||
                    currentYears.length > 0 ||
                    currentCollaborators.length > 0
                  ? process.env.PUBLIC_URL + "/close.png"
                  : process.env.PUBLIC_URL + "/filter_list.png"
              }
            ></img>
            <p>
              {sortingMenuOpen && filtersHasChanged
                ? "APPLY FILTERS"
                : sortingMenuOpen
                ? "CLOSE FILTERS"
                : currentTags.length > 0 ||
                  currentCategories.length > 0 ||
                  currentYears.length > 0 ||
                  currentCollaborators.length > 0 ||
                  width < 900
                ? ""
                : "FILTER BY"}
            </p>
          </button>{" "}
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
          zIndex: 999,
          overflowY: "scroll",
        }}
      >
        <div className={isMenuIntro ? "flex-column gap" : "flex-row fold"}>
          <div
            className={isMenuIntro ? "flex-column gap" : "flex-row column wrap"}
          >
            {" "}
            {displayCategoryButton &&
              categories &&
              categories.map(
                (category, index) =>
                  category.isFeatured && (
                    <>
                      {" "}
                      <button
                        style={{
                          backgroundColor: !currentCategories.includes(
                            category.title
                          )
                            ? category.color
                            : "yellow",
                        }}
                        className={
                          isMenuIntro
                            ? "standardButton featured interactable"
                            : "standardButton interactable"
                        }
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
                    </>
                  )
              )}
            {displayCategoryButton &&
              categories &&
              categories.map(
                (category, index) =>
                  !category.isFeatured && (
                    <>
                      {" "}
                      <button
                        style={{
                          backgroundColor: !currentCategories.includes(
                            category.title
                          )
                            ? category.color
                            : "yellow",
                        }}
                        className="sortingButton standardButton"
                        key={index}
                        id={"category_" + category.title + ""}
                        onClick={(evt) => {
                          setCategory({ category });
                        }}
                      >
                        {category.title}
                      </button>
                    </>
                  )
              )}
          </div>
          <div className={isMenuIntro ? "flex-column" : "flex-row column wrap"}>
            {" "}
            {displayTagButton &&
              tags.map((tag, index) => (
                <button
                  className="sortingButton standardButton"
                  style={{
                    backgroundColor: currentTags.includes(tag) && "yellow",
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
                  className="sortingButton standardButton"
                  style={{
                    backgroundColor: currentYears.includes(year) && "yellow",
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
                className="sortingButton standardButton"
                style={{
                  backgroundColor:
                    currentCollaborators.includes(collaborator) && "yellow",
                }}
                key={index}
                id={"collaborator_" + collaborator.toString()}
                onClick={() => {
                  setCollaborator(collaborator);
                }}
              >
                {collaborator}
              </button>
            ))}
        </div>
        {isMenuIntro && (
          <button
            className="standardButton featured interactable "
            onClick={(evt) => {
              setIsMenuIntro(false);
            }}
            style={{ backgroundColor: "yellow" }}
          >
            ALL FILTERS
          </button>
        )}
      </div>

      {displayStyle === "showcase" && displayYearButton && (
        <div className="block showcaseGrid">
          {timelineYears &&
            timelineYears.map((timelineYearObject, index) => (
              <div key={index}>
                <p className="timelineYear">{timelineYearObject.year}</p>
                <div className="flex-row wrap fold">
                  {timelineYearObject.projects &&
                    timelineYearObject.projects.map((project, index) => (
                      <>
                        <ShowcaseCard post={project} key={index} />
                      </>
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
          {heading ? <p className="headlinep">{heading}</p> : null}
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
