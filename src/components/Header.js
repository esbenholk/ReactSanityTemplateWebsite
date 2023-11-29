import React, { useContext, useState, useRef } from "react";
import AppContext from "../globalState";
import { urlFor } from "./blocks/image";
import { useLocation, NavLink } from "react-router-dom";
import { MenuImage } from "./menuItem";
import useWindowDimensions from "./functions/useWindowDimensions";

export default function Header() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userCanInteract, setuserCanInteract] = useState(false);
  const location = useLocation();
  const logoUrl = urlFor(info.logo.asset).width(60).url();
  const { width } = useWindowDimensions();

  const mobileMenu = useRef(null);

  function ToggleMenu(open) {
    if (open) {
      setMenuOpen(true);
      setTimeout(() => {
        setuserCanInteract(true);
      }, 1500);
    } else {
      setMenuOpen(false);
      setuserCanInteract(false);
      if (mobileMenuOpen) {
      }
      ToggleMobileMenu(false);
    }
  }

  function ToggleMobileMenu(open) {
    console.log("toglles mobile menu", open);
    if (open) {
      setMobileMenuOpen(true);
      setMenuOpen(true);
      setuserCanInteract(true);
      if (mobileMenu.current) {
        mobileMenu.current.style.display = "block";
      }
    } else {
      setMobileMenuOpen(false);
      setMenuOpen(false);
      setuserCanInteract(false);
      if (mobileMenu.current) {
        mobileMenu.current.style.display = "none";
      }
    }
  }
  function handleclick(e) {
    if (!userCanInteract) {
      e.preventDefault();
    }
  }
  return (
    <div className="menu">
      {/* top left corner shows logo if not */}
      {info.logo ? (
        <NavLink
          to="/"
          className={
            location.pathname === "/"
              ? "logo top fixed left header-padding"
              : "logo circleIcon top fixed left header-padding"
          }
          style={{
            objectPosition:
              info.logo && info.logo.hotspot
                ? `${info.logo.hotspot.x * 100}% ${info.logo.hotspot.y * 100}%`
                : "none",
            objectFit: "cover",
            backgroundImage: `url(${logoUrl})`,
          }}
          onClick={() => {
            if (width < 600 && mobileMenuOpen) {
              ToggleMobileMenu(false);
            }
          }}
        >
          {" "}
        </NavLink>
      ) : (
        <h1>{info.title}</h1>
      )}

      {info.headerMenu && (
        <div
          className="top fixed right header-padding menuContainer"
          style={{ maxWidth: `${location.pathname === "/" ? "80px" : "50px"}` }}
        >
          <div
            open={menuOpen}
            onMouseEnter={() => {
              if (width > 600) {
                ToggleMenu(true);
              }
            }}
            onMouseLeave={() => {
              if (width > 600) {
                ToggleMenu(false);
              }
            }}
            onClick={() => {
              if (width < 600 && !mobileMenuOpen) {
                ToggleMobileMenu(true);
              }
            }}
            className={`flex-column align-right burger  ${
              menuOpen ? " open" : "closed"
            }`}
          >
            {info.burgerTop && (
              <div
                className={`burgerTop burgerbun  ${
                  menuOpen ? " open" : "closed"
                }`}
                style={{ zIndex: 10 }}
              >
                <MenuImage
                  width={location.pathname != "/" ? 50 : 80}
                  image={info.burgerTop}
                />
              </div>
            )}

            {info.headerMenu.map((menuItem, index) => (
              <NavLink
                key={
                  menuItem.url
                    ? menuItem.url
                    : menuItem.page
                    ? menuItem.page.slug.current
                    : menuItem.project
                    ? menuItem.project.slug.current
                    : null + index
                }
                to={
                  menuItem.url
                    ? menuItem.url
                    : menuItem.page
                    ? menuItem.page.slug.current
                    : menuItem.project
                    ? menuItem.project.slug.current
                    : null
                }
                onClick={(e) => {
                  handleclick(e);
                  if (width < 600) {
                    ToggleMobileMenu(false);
                  } else {
                    ToggleMenu(false);
                  }
                }}
                className={`flex-row burgerLayer  ${
                  location.pathname != "/" ? "smallBurger" : "bigBurger"
                } ${menuOpen ? " open" : "closed"} ${
                  userCanInteract ? " interactable" : "notInteractable"
                }`}
                style={{
                  zIndex: 10 + index,
                }}
              >
                <p>{menuItem.title}</p>
                <MenuImage
                  width={location.pathname != "/" ? 40 : 56}
                  image={menuItem.image}
                />
              </NavLink>
            ))}
            {info.burgerBottom && (
              <div
                className={`burgerBottom burgerbun  ${
                  menuOpen ? " open" : "closed"
                }`}
                style={{ zIndex: 10 }}
              >
                <MenuImage
                  width={location.pathname != "/" ? 50 : 80}
                  image={info.burgerBottom}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div
        ref={mobileMenu}
        className="mobileMenu"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,

          display: "none",
          zIndex: 999,
        }}
      >
        <div
          className="header-padding top absolute right"
          onClick={() => {
            ToggleMobileMenu(false);
          }}
        >
          <img src={process.env.PUBLIC_URL + "/assets/closingIcon.png"}></img>
        </div>
      </div>
    </div>
  );
}
