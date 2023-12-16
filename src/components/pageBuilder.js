import React from "react";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import Video from "./blocks/videoPlayer";
// import ConnectedProjects from "./connectedProject";
import Projects from "./blocks/ProjectSorting";
import TickerComp from "./blocks/ticker";
import ConnectedPress from "./connectedPress";
import Image from "./blocks/image";
import CustomCarousel from "./blocks/Carousel";

function PageBlock({ pageBlock }) {
  return (
    <>
      {pageBlock._type === "sortedProjects" && (
        <Projects sortCategories={pageBlock.categories} />
      )}

      {/* {page.projects ? <HorizontalScroll projects={page.projects} /> : null} */}
      {pageBlock._type === "gallery" && (
        <>
          <div className="block">
            {pageBlock.images ? (
              <CustomCarousel
                images={pageBlock.images}
                description={pageBlock.imageDescription}
              ></CustomCarousel>
            ) : null}
          </div>
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
      {pageBlock._type === "connectedProjects" && (
        <>
          {pageBlock.projects && pageBlock.projects.length > 0 ? (
            <Projects
              projectList={pageBlock.projects}
              displayCategoryButton={pageBlock.canBeSorted}
              displayTagButton={pageBlock.canBeSorted}
              displayStyle={pageBlock.type}
              displayYearButton={pageBlock.canBeSorted}
            />
          ) : (
            <Projects
              projectList={null}
              displayCategoryButton={pageBlock.canBeSorted}
              displayTagButton={pageBlock.canBeSorted}
              displayStyle={pageBlock.type}
              displayYearButton={pageBlock.canBeSorted}
            />
          )}
        </>
      )}
      {pageBlock._type === "connectedPress" && (
        <ConnectedPress
          press={pageBlock}
          heading={pageBlock.heading}
          type={pageBlock.type}
        />
      )}
      {pageBlock._type === "breadContent" && (
        <>
          {pageBlock.content && (
            <div className="blockItem">
              <div className="textBlock">
                <BlockContent
                  blocks={pageBlock.content}
                  heading={pageBlock.heading}
                />
              </div>
            </div>
          )}
        </>
      )}

      {pageBlock._type === "customImage" && (
        <div className="flex-row align-center block" style={{ width: "100%" }}>
          <div className="flex-column align-center">
            <Image image={pageBlock.customImage} />
            {pageBlock.customImage.imageDescription && (
              <p>{pageBlock.customImage.imageDescription}</p>
            )}
          </div>
        </div>
      )}

      {pageBlock._type === "video" && <Video videoContent={pageBlock} />}

      {pageBlock._type === "ticker" && <TickerComp />}
    </>
  );
}

function PageBlockContainer({ pageBlock }) {
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${pageBlock.color1} 0%, ${pageBlock.color2} 100%)`,
      }}
      className="blockContainer"
    >
      {pageBlock._type !== "hero" &&
      pageBlock.title !== null &&
      pageBlock.title !== "" ? (
        <div>
          <h3 className="fullWidthBlock blockTop">{pageBlock.title}</h3>
        </div>
      ) : null}
      {pageBlock.pageBuilder.map((page, index) => (
        <PageBlock key={index} pageBlock={page} />
      ))}
    </div>
  );
}
export default function PageBuilder({ pageBuilder }) {
  console.log("PAGEBUILDER", pageBuilder);

  return (
    <div>
      {pageBuilder.map((page, index) => (
        <div key={index}>
          {page._type === "pageBlock" ? (
            <PageBlockContainer pageBlock={page} />
          ) : (
            <PageBlock pageBlock={page} />
          )}
        </div>
      ))}
    </div>
  );
}
