import React, { useContext, useState, useEffect } from "react";
import BlockContent from "./blocks/BlockContent";
import AppContext from "../globalState";
import MenuItem from "./menuItem";

export default function Footer() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    if (info.greetings) {
      setGreetingIndex(Math.floor(Math.random() * info.greetings.length));
    }
  }, [info.greetings]);

  useEffect(() => {
    const tempGreetingIndex = setInterval(() => {
      setGreetingIndex(Math.floor(Math.random() * info.greetings.length));
    }, 1000);
    return () => {
      clearInterval(tempGreetingIndex);
    };
  }, [info.greetings.length, info.greetings]);

  return (
    <div>
      <footer>
        {info.greetings[greetingIndex] != null ? (
          <div className="greeting">
            {info.greetings[greetingIndex].content &&
            info.greetings[greetingIndex].content.length > 0 ? (
              <BlockContent blocks={info.greetings[greetingIndex].content} />
            ) : null}
          </div>
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
