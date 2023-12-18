import React, { useState, useEffect, useContext } from "react";
import HeroProjectGrid from "./heroProjectGrid.js";
import AppContext from "../../globalState.js";
import ShowcaseCard from "../blocks/showcaseCard.js";
import useWindowDimensions from "../functions/useWindowDimensions.js";
import { useParams, useSearchParams } from "react-router-dom";

export default function Projects({
  projectList,
  displayCategoryButton,
  displayTagButton,
  displayStyle,
  displayYearButton,
}) {
  const myContext = useContext(AppContext);
  const { width } = useWindowDimensions();
  const { slug } = useParams();
  const [searchSlug, setSearchSlug] = useState();
  const [searchParams] = useSearchParams();

  const [sortingMenuOpen, setSortingMenuOpen] = useState(false);
  const [shouldShowSortingMenu, setShouldShowSortingMenu] = useState(false);

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

    // const tempCategories = [...currentCategories];

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

    console.log("project list", tempProjectList);

    for (let index = 0; index < tempProjectList.length; index++) {
      const post = tempProjectList[index];
      post.value = 0;

      years.push(post.year);

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
            // if (searchSlug === tag) {
            //   const tempTags = [...currentTags];
            //   tempTags.push(tag);
            //   setCurrentTags(tempTags);
            //   let button = document.getElementById("tag_" + tag);
            //   if (button) {
            //     button.classList.add("active");
            //   }
            //   setTimeout(() => {
            //     setFilterHasChanged(false);
            //   }, 10);
            // }
          }
        }
      }

      if (post.categories != null && Array.isArray(post.categories)) {
        for (let index = 0; index < post.categories.length; index++) {
          const category = post.categories[index];

          if (!categoryNames.includes(category.title)) {
            categoryNames.push(category.title);
            categories.push(category);

            // if (searchSlug === category.slug.current) {
            //   tempCategories.push(category.title);

            //   let button = document.getElementById(
            //     "category_" + category.title
            //   );
            //   if (button) {
            //     button.classList.add("active");
            //   }
            // }
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

      console.log(
        "search criteria has been updated",
        currentTags,
        currentCollaborators,
        currentCategories,
        currentYears,
        allPosts
      );

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
      tempSortedPosts.sort((a, b) => b.value - a.value);

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
    const params = [];

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

      document
        .getElementById("category_" + category.category.title)
        .classList.add("active");
    } else if (currentCategories.includes(category.category.title)) {
      var categoryIndex = currentCategories.indexOf(category.category.title);
      currentCategories.splice(categoryIndex, 1);
      const tempCategories = [...currentCategories];
      document
        .getElementById("category_" + category.category.title)
        .classList.remove("active");

      setCurrentCategories(tempCategories);
    }
  }

  return (
    <div className="projects">
      {shouldShowSortingMenu && (
        <button
          className={
            sortingMenuOpen
              ? "fixedFilerButton header-padding active standardButton"
              : "fixedFilerButton header-padding"
          }
          style={{ position: "fixed", zIndex: "999999999999999999999999" }}
          onClick={(evt) => {
            if (sortingMenuOpen) {
              setSortingMenuOpen(false);
              setFilterHasChanged(false);
              setIsMenuIntro(true);
            } else {
              setSortingMenuOpen(true);
            }
          }}
        >
          <img
            alt="filer icon"
            style={{
              transform: filtersHasChanged && "rotate(180g)",
              filter: filtersHasChanged && "invert(1)",
            }}
            src={
              sortingMenuOpen && filtersHasChanged
                ? process.env.PUBLIC_URL + "/filter_list.png"
                : sortingMenuOpen
                ? process.env.PUBLIC_URL + "/close.png"
                : process.env.PUBLIC_URL + "/filter_list.png"
            }
          ></img>
          {sortingMenuOpen && filtersHasChanged
            ? "APPLY FILTERS"
            : sortingMenuOpen
            ? "CLOSE FILTERS"
            : width > 900
            ? "FILTER BY"
            : null}
        </button>
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
          overflow: "hidden",
        }}
      >
        <div className={isMenuIntro ? "flex-column nogap" : "flex-row fold"}>
          <div className={isMenuIntro ? "flex-column" : "flex-row column wrap"}>
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
                            ? "standardButton featured"
                            : "standardButton"
                        }
                        key={index}
                        id={"category_" + category.title + ""}
                        onClick={(evt) => {
                          if (
                            isMenuIntro &&
                            !currentCategories.includes(category.title)
                          ) {
                            setSortingMenuOpen(false);
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
                        style={{ backgroundColor: category.color }}
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
        <div className={isMenuIntro ? "flex-column" : "flex-row wrap"}>
          {displayYearButton &&
            collaborators &&
            collaborators.map((collaborator, index) => (
              <button
                className="sortingButton standardButton"
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
            className="sortingButton standardButton featured"
            onClick={(evt) => {
              setIsMenuIntro(false);
            }}
            style={{ backgroundColor: "yellow" }}
          >
            ALL FILTERS
          </button>
        )}
      </div>

      {displayStyle === "showcase" && (
        <div className="flex-row wrap block showcaseGrid fold">
          <>
            {sortedPosts &&
              sortedPosts.map((project, index) => (
                <ShowcaseCard post={project} key={index} />
              ))}
          </>
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
                place={project.place}
                slug={project.slug.current}
              />
            ))}
        </div>
      )}

      {/* {displayStyle === "list" && (
        <div className="list">
          {sortedPosts
            ? sortedPosts.map((project, index) => (
                <DBItem
                  key={index}
                  url={
                    project.slug
                      ? project.slug.current
                      : project.link
                      ? project.link
                      : "/"
                  }
                  title={project.title}
                  year={project.time ? project.time : project.year}
                  description={project.description}
                  updateVisitedLinks={updateVisitedLinks}
                  visitedLinks={visitedLinks}
                />
              ))
            : null}
        </div>
      )} */}
    </div>
  );
}
