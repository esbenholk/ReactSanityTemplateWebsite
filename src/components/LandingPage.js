import React, { useContext } from "react";
import AppContext from "../globalState";
import PageBuilder from "./pageBuilder";
import Jungle from "./jungle";
import { MenuImage } from "./menuItem";
import { NavLink } from "react-router-dom";

export default function LandingPage() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  return (
    <div>
      <div className="jungleContainer">
        {info.cubeMap && <Jungle cubeMap={info.cubeMap} />}
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
