import React from "react";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import Video from "./blocks/videoPlayer";
// import ConnectedProjects from "./connectedProject";
import Projects from "./blocks/ProjectSorting";
import TickerComp from "./blocks/ticker";
import ConnectedPress from "./connectedPress";
import ConnectedCollaborators from "./connectedCollaborators";
import { ProjectImage } from "./blocks/image";
import { ConstrainedImage } from "./blocks/image";
import CustomCarousel from "./blocks/Carousel";
import MenuItem from "./menuItem";
import useWindowDimensions from "./functions/useWindowDimensions";

function PageBlock({
  pageBlock,
  color,
  title,
  updatePageTitle,
  updateProjectTitle,
}) {
  const { width } = useWindowDimensions();
  return (
    <>
      {pageBlock._type === "sortedProjects" && (
        <Projects sortCategories={pageBlock.categories} />
      )}
      {/* {page.projects ? <HorizontalScroll projects={page.projects} /> : null} */}
      {pageBlock._type === "gallery" && (
        <>
          {pageBlock.images ? (
            <CustomCarousel
              images={pageBlock.images}
              description={pageBlock.imageDescription}
            ></CustomCarousel>
          ) : null}
        </>
      )}
      {pageBlock._type === "hero" && (
        <Hero
          image={pageBlock.image}
          heading={pageBlock.heading}
          tagLine={pageBlock.tagline}
          type={pageBlock.image.type}
        />
      )}
      {pageBlock._type === "buttons" && (
        <>
          {pageBlock.external_links && (
            <div
              className="flex-row fold space-between gap fullWidthBlock"
              style={{ width: "100%" }}
            >
              {pageBlock.external_links.map((link, index) => (
                <div
                  key={index}
                  className="buttonblock interactable"
                  style={{
                    maxWidth:
                      width > 900 &&
                      100 / pageBlock.external_links.length + "%",
                    backgroundColor: color,
                  }}
                >
                  <MenuItem
                    menuItem={link}
                    imageInline={true}
                    image={link.image}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {pageBlock._type === "connectedProjects" && (
        <>
          {pageBlock.projects && pageBlock.projects.length > 0 ? (
            <Projects
              projectList={pageBlock.projects}
              displayCategoryButton={pageBlock.canBeSorted}
              displayTagButton={pageBlock.canBeSorted}
              displayStyle={pageBlock.type}
              displayYearButton={pageBlock.canBeSorted}
              heading={pageBlock.heading}
              updatePageTitle={updatePageTitle}
              updateProjectTitle={updateProjectTitle}
            />
          ) : (
            <Projects
              projectList={null}
              displayCategoryButton={pageBlock.canBeSorted}
              displayTagButton={pageBlock.canBeSorted}
              displayStyle={pageBlock.type}
              displayYearButton={pageBlock.canBeSorted}
              heading={pageBlock.heading}
              updatePageTitle={updatePageTitle}
              updateProjectTitle={updateProjectTitle}
            />
          )}
        </>
      )}
      {pageBlock._type === "connectedPress" && (
        <>
          <ConnectedPress
            press={pageBlock}
            heading={pageBlock.heading}
            type={pageBlock.type}
            color={color}
            title={title}
          />
        </>
      )}
      {pageBlock._type === "connectedCollaborators" && (
        <>
          <ConnectedCollaborators
            press={pageBlock}
            heading={pageBlock.heading}
            type={pageBlock.type}
            color={color}
            title={title}
          />
        </>
      )}
      {pageBlock._type === "breadContent" && (
        <>
          {pageBlock.content && (
            <div className="blockItem">
              <div
                className={
                  pageBlock.type !== "description"
                    ? "textBlock"
                    : "textBlock mini"
                }
              >
                <BlockContent
                  blocks={pageBlock.content}
                  heading={pageBlock.heading}
                  readmore={pageBlock.readmorecontent}
                />
              </div>
            </div>
          )}
        </>
      )}
      {pageBlock._type === "customImage" && (
        <div
          className="flex-row align-center justify-center block"
          style={{ width: "100%" }}
        >
          <div className="flex-column align-center">
            <ProjectImage
              image={pageBlock.customImage}
              imageDescription={pageBlock.customImage.imageDescription}
            />
          </div>
        </div>
      )}
      {pageBlock._type === "row" && (
        <div
          className="flex-row justify-center gap fold block"
          style={{ width: "100%" }}
        >
          {pageBlock.rowContent.map((rowBlock, index) => (
            <div
              key={index}
              className="rowblock"
              style={{
                maxWidth:
                  width > 900 && 100 / pageBlock.rowContent.length + "%",
              }}
            >
              {rowBlock.customImage && (
                <div className="flex-column align-center">
                  <ConstrainedImage
                    image={rowBlock.customImage}
                    imageDescription={rowBlock.customImage.imageDescription}
                  />
                </div>
              )}
              {rowBlock.content && (
                <div
                  className={
                    rowBlock.type !== "description"
                      ? "textContent"
                      : "textContent mini"
                  }
                >
                  <BlockContent blocks={rowBlock.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}{" "}
      {pageBlock._type === "video" && (
        <div className="block">
          <h1>{pageBlock.title}</h1>
          <Video url={pageBlock.url} width={width} cover={pageBlock.cover} />
          <div>
            <BlockContent blocks={pageBlock.description} />
          </div>
        </div>
      )}
      {pageBlock._type === "ticker" && <TickerComp />}
    </>
  );
}

function PageBlockContainer({
  pageBlock,
  color,
  updatePageTitle,
  updateProjectTitle,
}) {
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${pageBlock.color1} 0%, ${pageBlock.color2} 100%)`,
      }}
      className={
        pageBlock.type === "confined"
          ? "blockContainer confined"
          : "blockContainer free"
      }
    >
      {pageBlock.title && pageBlock.title !== "" ? (
        <h2 className="blockItemOpenRight blockItemHeadline">
          {pageBlock.title}
        </h2>
      ) : null}
      {pageBlock.pageBuilder &&
        pageBlock.pageBuilder.map((page, index) => (
          <PageBlock
            key={index}
            pageBlock={page}
            color={color}
            updatePageTitle={updatePageTitle}
            updateProjectTitle={updateProjectTitle}
          />
        ))}
    </div>
  );
}
export default function PageBuilder({
  pageBuilder,
  color,
  updatePageTitle,
  updateProjectTitle,
}) {
  console.log("pagebuilder", pageBuilder);

  return (
    <div>
      {pageBuilder.map((page, index) => (
        <div key={index}>
          {page._type === "pageBlock" ? (
            <PageBlockContainer
              pageBlock={page}
              color={color}
              updatePageTitle={updatePageTitle}
              updateProjectTitle={updateProjectTitle}
            />
          ) : (
            <>
              <PageBlock
                pageBlock={page}
                color={color}
                updatePageTitle={updatePageTitle}
                updateProjectTitle={updateProjectTitle}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
