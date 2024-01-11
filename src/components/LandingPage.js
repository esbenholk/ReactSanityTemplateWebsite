import React, { useContext, useState, useEffect } from "react";
import AppContext from "../globalState";
import PageBuilder from "./pageBuilder";
import Jungle from "./jungle";
import { MenuImage } from "./menuItem";
// import Image from "./blocks/image";
import { NavLink } from "react-router-dom";
import useWindowDimensions from "./functions/useWindowDimensions";

export default function LandingPage() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const { height } = useWindowDimensions();

  const [jungleMenuIsOpen, setJungleMenuIsOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  function updateJungleMenu(bool, name, color) {
    console.log(name, color);

    setJungleMenuIsOpen(bool);
  }

  function openJungleMenuLink(name) {
    let jungleNavigationItem = info.junglenavigation.find((jni) =>
      jni.title.includes(name)
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
        <div
          className={
            jungleMenuIsOpen ? " open jungleMenuFrame" : "jungleMenuFrame"
          }
        ></div>
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
                <MenuImage width={80} image={info.leftButtonLink.image} />
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
                <MenuImage width={80} image={info.rightButtonLink.image} />
              ) : (
                <p>{info.rightButtonLink.title}</p>
              )}
            </NavLink>{" "}
          </div>
        )}
      </div>
      {info.pageBuilder && <PageBuilder pageBuilder={info.pageBuilder} />}
    </div>
  );
}
