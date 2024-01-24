import React from "react";
import PostCard from "./blocks/pressCard";
import HeroProjectGrid from "./blocks/heroProjectGrid";

function ConnectedProjects({ projects, heading, type }) {
  const connectedProjects = projects;

  return (
    <div className="grid">
      {connectedProjects &&
        connectedProjects.map((project, index) => (
          <>
            {type === "cover" ? (
              <HeroProjectGrid
                image={
                  project.heroImage ? project.heroImage : project.mainImage
                }
                heading={project.title}
                logo={project.logoImage}
                time={project.time}
                place={project.place}
                slug={project.slug.current}
              />
            ) : (
              <PostCard post={project} key={index} />
            )}
          </>
        ))}
    </div>
  );
}

export default ConnectedProjects;
