import React from "react";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import Video from "./blocks/videoPlayer";
import ConnectedProjects from "./connectedProject";
// import HorizontalScroll from "./blocks/HorizontalScroll";
import Projects from "./blocks/ProjectSorting";
import TickerComp from "./blocks/ticker";
import ConnectedPress from "./connectedPress";
import Image from "./blocks/image";
import Masonry from "react-masonry-css";

function PageBlock({ pageBlock }) {
  return (
    <>
      {pageBlock._type === "sortedProjects" && (
        <Projects sortCategories={pageBlock.categories} />
      )}

      {/* {page.projects ? <HorizontalScroll projects={page.projects} /> : null} */}
      {pageBlock._type === "gallery" && (
        <>
          {pageBlock.images ? (
            <Masonry
              breakpointCols={{
                default: 2,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column singleProjectMasonry"
            >
              {pageBlock.images.map((image, index) => (
                <div className="squareImage" key={index}>
                  <Image image={image} width={790} />
                </div>
              ))}
            </Masonry>
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
      {pageBlock._type === "connectedProjects" && (
        <ConnectedProjects
          projects={pageBlock.projects}
          heading={pageBlock.heading}
          type={pageBlock.type}
        />
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
              <div className="textblock">
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
        <div className="flex-row align-center" style={{ width: "100%" }}>
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
  console.log("PAGEBLOCK", pageBlock);
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${pageBlock.color1} 0%, ${pageBlock.color2} 100%)`,
      }}
    >
      {pageBlock._type !== "hero" &&
      pageBlock.title !== null &&
      pageBlock.title !== "" ? (
        <div className="blockItem">
          <h1>{pageBlock.title}</h1>
        </div>
      ) : null}
      {pageBlock.pageBuilder.map((page, index) => (
        <div key={index} className="block">
          <PageBlock pageBlock={page} />
        </div>
      ))}
    </div>
  );
}
export default function PageBuilder({ pageBuilder }) {
  console.log("PAGEBUILDER", pageBuilder);

  return (
    <div>
      {pageBuilder.map((page, index) => (
        <div key={index} className="block">
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
