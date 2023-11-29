import React from "react";
import { motion } from "framer-motion";
import BlockContent from "./blocks/BlockContent";
import Hero from "./blocks/hero";
import Video from "./blocks/videoPlayer";
import ConnectedProjects from "./connectedProject";
import HorizontalScroll from "./blocks/HorizontalScroll";
import Projects from "./blocks/ProjectSorting";
import TickerComp from "./blocks/ticker";

function PageBlock({ pageBlock }) {
  console.log("PAGEBLOCK", pageBlock);
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${pageBlock.color1} 0%, ${pageBlock.color2} 100%)`,
      }}
    >
      {pageBlock.pageBuilder.map((pageBlock, index) => (
        <>
          {" "}
          {pageBlock._type === "sortedProjects" && (
            <Projects sortCategories={pageBlock.categories} />
          )}
          {/* {page.projects ? <HorizontalScroll projects={page.projects} /> : null} */}
          {pageBlock._type === "hero" && (
            <Hero
              image={pageBlock.image}
              heading={pageBlock.heading}
              tagLine={pageBlock.tagline}
            />
          )}
          {pageBlock._type === "connectedProjects" && (
            <ConnectedProjects
              projects={pageBlock.projects}
              heading={pageBlock.heading}
              type={pageBlock.type}
            />
          )}
          {pageBlock._type === "breadContent" && (
            <>
              {pageBlock.content && (
                <div className="textblock">
                  <BlockContent
                    blocks={pageBlock.content}
                    heading={pageBlock.heading}
                  />
                </div>
              )}
            </>
          )}
          {pageBlock._type === "video" && <Video videoContent={pageBlock} />}
          {pageBlock._type === "ticker" && <TickerComp />}
        </>
      ))}
    </div>
  );
}
export default function PageBuilder({ pageBuilder }) {
  console.log("PAGE", pageBuilder);

  return (
    <div>
      {pageBuilder.map((page, index) => (
        <div key={index} className="block">
          {/* {page._type != "hero" &&
          page.heading != null &&
          page.heading != "" ? (
            <h1>{page.heading}</h1>
          ) : null} */}
          {page._type === "pageBlock" && <PageBlock pageBlock={page} />}

          {page._type === "sortedProjects" && (
            <Projects sortCategories={page.categories} />
          )}

          {/* {page.projects ? <HorizontalScroll projects={page.projects} /> : null} */}

          {page._type === "hero" && (
            <Hero
              image={page.image}
              heading={page.heading}
              tagLine={page.tagline}
            />
          )}
          {page._type === "connectedProjects" && (
            <ConnectedProjects
              projects={page.projects}
              heading={page.heading}
              type={page.type}
            />
          )}
          {page._type === "breadContent" && (
            <>
              {page.content && (
                <div className="textblock">
                  <BlockContent blocks={page.content} heading={page.heading} />
                </div>
              )}
            </>
          )}
          {page._type === "video" && <Video videoContent={page} />}

          {page._type === "ticker" && <TickerComp />}
        </div>
      ))}
    </div>
  );
}
