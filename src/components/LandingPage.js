import React, { useContext, useState, useEffect } from "react";
import AppContext from "../globalState";
import PageBuilder from "./pageBuilder";
import Jungle from "./jungle";
import { MenuImage } from "./menuItem";
import Image from "./blocks/image";
import { NavLink } from "react-router-dom";
import useWindowDimensions from "./functions/useWindowDimensions";

export default function LandingPage() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const { height, width } = useWindowDimensions();

  const [jungleMenuIsOpen, setJungleMenuIsOpen] = useState(false);
  const [jungleMenuItem, setJungleMenuItem] = useState({
    description: "hej",
    url: "/about-us",
    image: info.mainImage,
    title: "about us",
    color: "8E8E8E",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function updateJungleMenu(bool, name, color) {
    const r = /\d+/;
    const number = name.match(r);

    let navObject = info.junglenavigation.find((item) =>
      item.title.includes(number)
    );

    if (name !== "" && navObject && navObject.frameTitle) {
      let currentJungleItem = {
        description: navObject.frameDescription,
        url: navObject.url,
        image: navObject.image,
        title: navObject.frameTitle,
        color: color,
      };
      setJungleMenuItem(currentJungleItem);
      setJungleMenuIsOpen(bool);
    } else if (name === "") {
      setJungleMenuIsOpen(bool);
    }
  }

  function openJungleMenuLink(name) {
    const r = /\d+/;
    const number = name.match(r);

    let jungleNavigationItem = info.junglenavigation.find((jni) =>
      jni.title.includes(number)
    );

    if (jungleNavigationItem) {
      if (
        jungleNavigationItem.url &&
        jungleNavigationItem.url.includes("http")
      ) {
        window.open(jungleNavigationItem.url, "_blank");
      } else if (jungleNavigationItem.url) {
        window.location.href =
          process.env.PUBLIC_URL + jungleNavigationItem.url;
      } else {
        // console.log("does not have link");
      }
    }
  }

  return (
    <div>
      <div className="jungleContainer" style={{ position: "relative" }}>
        {info.cubeMap && (
          <Jungle
            cubeMap={info.cubeMap}
            height={height}
            info={info}
            updateJungleMenu={updateJungleMenu}
            openJungleMenuLink={openJungleMenuLink}
          />
        )}
        {info.leftButtonLink && (
          <div className="absolute bottom left icon header-padding">
            {" "}
            <NavLink
              to={
                info.leftButtonLink.url
                  ? info.leftButtonLink.url
                  : info.leftButtonLink.page
                  ? info.leftButtonLink.page.slug.current
                  : info.leftButtonLink.project
                  ? info.leftButtonLink.project.slug.current
                  : null
              }
            >
              {info.leftButtonLink.image ? (
                <MenuImage width={283} image={info.leftButtonLink.image} />
              ) : (
                <p>{info.leftButtonLink.title}</p>
              )}
            </NavLink>{" "}
          </div>
        )}
        {info.rightButtonLink && (
          <div className="absolute bottom right icon header-padding">
            {" "}
            <NavLink
              to={
                info.rightButtonLink.url
                  ? info.rightButtonLink.url
                  : info.rightButtonLink.page
                  ? info.rightButtonLink.page.slug.current
                  : info.rightButtonLink.project
                  ? info.rightButtonLink.project.slug.current
                  : null
              }
            >
              {info.rightButtonLink.image ? (
                <MenuImage width={283} image={info.rightButtonLink.image} />
              ) : (
                <p>{info.rightButtonLink.title}</p>
              )}
            </NavLink>{" "}
          </div>
        )}

        {jungleMenuItem && (
          <div
            className={`jungleMenuFrame flex-column ${
              jungleMenuIsOpen && " open "
            }`}
          >
            <NavLink
              to={jungleMenuItem.url}
              className="jungleMenuFrameFrame"
              style={{
                border: `#${jungleMenuItem.color} ${
                  width > 900 ? "16px " : "10px"
                } solid`,
              }}
            >
              {jungleMenuItem.image && <Image image={jungleMenuItem.image} />}
            </NavLink>{" "}
            {jungleMenuItem.title && (
              <div
                style={{
                  backgroundColor: `#${jungleMenuItem.color}`,
                }}
                className="jungleMenuFrameTitle"
              >
                <p>{jungleMenuItem.title}</p>
              </div>
            )}
            {jungleMenuItem.description && (
              <div className="jungleMenuFrameDescription flex-row wrap align-center justify-content">
                <p style={{ color: `#${jungleMenuItem.color}` }}>
                  {jungleMenuItem.description}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <mask
                    id="mask0_1247_1181"
                    // style={"mask-type:alpha"}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect
                      width="24"
                      height="24"
                      fill={`#${jungleMenuItem.color}`}
                    />
                  </mask>
                  <g mask="url(#mask0_1247_1181)">
                    <path
                      d="M14 18L12.6 16.55L16.15 13H4V11H16.15L12.6 7.45L14 6L20 12L14 18Z"
                      fill={`#${jungleMenuItem.color}`}
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      {info.pageBuilder && <PageBuilder pageBuilder={info.pageBuilder} />}
    </div>
  );
}
