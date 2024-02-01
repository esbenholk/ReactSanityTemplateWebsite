import React from "react";
import { NavLink } from "react-router-dom";
import { urlFor } from "./blocks/image";

export const MenuImage = ({ height, width, image }) => {
  return (
    <img
      src={
        width
          ? urlFor(image.asset).width(width).url()
          : urlFor(image.asset).height(height).url()
      }
      alt="menu icon"
      style={{
        height: height,
        objectFit: "contain",
        maxWidth: "none",
      }}
    />
  );
};
export const Button = ({ url, name, color }) => {
  return (
    <a
      className="standardButton interactable"
      href={url}
      rel="noreferrer"
      target={url && url.includes("http") ? "_blank" : ""}
      style={{ backgroundColor: color }}
    >
      {name}
    </a>
  );
};
export default function MenuItem({ menuItem, imageInline, imagesize }) {
  return (
    <>
      {/* {imageInline && menuItem.image ? <>hej</> : null} */}
      {menuItem.image !== null ? (
        <>
          {menuItem.url ? (
            <a
              href={menuItem.url}
              className="flex-row"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <MenuImage height={imagesize} image={menuItem.image} />
              {imageInline ? <p> {menuItem.title}</p> : null}
            </a>
          ) : (
            <>
              {/* else check for page reference */}
              {menuItem.page ? (
                <NavLink
                  key={menuItem.page.slug.current}
                  to={menuItem.page.slug.current}
                >
                  <MenuImage height={imagesize} image={menuItem.image} />
                  {imageInline && <p>{menuItem.title}</p>}
                </NavLink>
              ) : (
                <>
                  {/* else check for project reference */}
                  {menuItem.project && (
                    <NavLink
                      key={menuItem.project.slug.current}
                      to={menuItem.project.slug.current}
                    >
                      <MenuImage height={imagesize} image={menuItem.image} />
                      {imageInline && <p>{menuItem.title}</p>}
                    </NavLink>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {/* prioritse to check for external link */}
          {menuItem.url ? (
            <a
              href={menuItem.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {menuItem.title}
            </a>
          ) : (
            <>
              {/* else check for page reference */}
              {menuItem.page ? (
                <NavLink
                  key={menuItem.page.slug.current}
                  to={menuItem.page.slug.current}
                >
                  {menuItem.title}
                </NavLink>
              ) : (
                <>
                  {/* else check for project reference */}
                  {menuItem.project && (
                    <NavLink
                      key={menuItem.project.slug.current}
                      to={menuItem.project.slug.current}
                    >
                      {menuItem.title}
                    </NavLink>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
