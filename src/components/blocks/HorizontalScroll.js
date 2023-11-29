import React, { useState, useRef, useEffect } from "react";
import PostCard from "./postCard";

const HorizontalScroll = ({ projects }) => {
  console.log(projects);
  const containerRef = useRef(null);
  const [visibleProjects, setVisibleProjects] = useState([...projects]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Check if the user has scrolled to the end
      if (scrollLeft + clientWidth === scrollWidth) {
        // User has reached the end, add more projects to the right
        setVisibleProjects([...visibleProjects, ...projects]);
      }

      // Check if the user has scrolled to the beginning
      if (scrollLeft === 0) {
        // User has reached the beginning, add more projects to the left
        setVisibleProjects([...projects, ...visibleProjects]);
        // Also, adjust the scroll position to show the new projects added to the left
        container.scrollLeft = scrollWidth;
      }
    }
  };

  useEffect(() => {
    // Attach scroll event listener when the component mounts
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Detach the scroll event listener when the component unmounts
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleProjects, projects]);

  return (
    <div className="infinite-scroll" ref={containerRef}>
      {visibleProjects.map((project, index) => (
        <div key={index} className="project-item">
          <PostCard post={project} card={true} />
        </div>
      ))}
    </div>
  );
};

export default HorizontalScroll;
