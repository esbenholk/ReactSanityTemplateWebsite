import React, { useContext } from "react";
import BlockContent from "./blocks/BlockContent";
import useWindowDimensions from "./functions/useWindowDimensions";
import AppContext from "../globalState";
import MenuItem from "./menuItem";
import TickerComp from "./blocks/ticker";

export default function Footer() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  const { width } = useWindowDimensions();

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //     /* you can also use 'auto' behaviour
  //        in place of 'smooth' */
  //   });
  // };

  return (
    <div>
      <TickerComp />
      <footer>
        {info.breadContent != null ? (
          <>
            {info.breadContent.content &&
            info.breadContent.content.length > 0 ? (
              <BlockContent
                blocks={info.breadContent.content}
                heading={info.breadContent.heading}
              />
            ) : null}
          </>
        ) : null}
        <div style={{ height: "90px" }}></div>
        <div className="flex-row space-between">
          <>
            {info.footerMenu != null && info.footerMenu.columns.length > 0 ? (
              <div className="flex-row wrapOnMobile">
                {info.footerMenu.columns.map((column, index) => (
                  <div className="flex-column linkColumn" key={index}>
                    {column.links.external_links.map((link, index) => (
                      <MenuItem
                        menuItem={link}
                        imageInline={false}
                        imagesize={30}
                        key={index}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
            {info.footerMenuSocials != null &&
            info.footerMenuSocials.length > 0 ? (
              <div className="flex-column socialLinks">
                {info.footerMenuSocials.map((link, index) => (
                  <MenuItem
                    menuItem={link}
                    imageInline={true}
                    key={index}
                    imagesize={30}
                  />
                ))}
              </div>
            ) : null}
          </>
        </div>
      </footer>
    </div>
  );
}
