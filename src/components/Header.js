import React, { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../globalState";
import { urlFor } from "./blocks/image";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { MenuImage } from "./menuItem";
import useWindowDimensions from "./functions/useWindowDimensions";
import { useParams } from "react-router-dom";

export function HeaderLogoButton({
  projectName,
  mobileMenuOpen,
  ToggleMobileMenu,
}) {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const logoUrl = urlFor(info.logo.asset).width(60).url();
  const { width } = useWindowDimensions();
  const location = useLocation();
  return (
    <>
      {" "}
      {info.logo ? (
        <>
          <NavLink
            to="/"
            className={
              location.pathname === "/"
                ? "logo header-padding"
                : "logo circleIcon header-padding"
            }
            style={{
              objectPosition:
                info.logo && info.logo.hotspot
                  ? `${info.logo.hotspot.x * 100}% ${
                      info.logo.hotspot.y * 100
                    }%`
                  : "none",
              objectFit: "cover",
              backgroundImage:
                location.pathname !== "/" &&
                projectName !== null &&
                projectName !== ""
                  ? `url(${process.env.PUBLIC_URL + "/assets/returnArrow.png"}`
                  : `url(${logoUrl}`,
            }}
            onClick={() => {
              if (width < 600 && mobileMenuOpen) {
                ToggleMobileMenu(false);
              }
            }}
          >
            {" "}
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/"
          onClick={() => {
            if (width < 600 && mobileMenuOpen) {
              ToggleMobileMenu(false);
            }
          }}
        >
          <h1>{info.title}</h1>
        </NavLink>
      )}
    </>
  );
}
export default function Header({ pageName, projectName }) {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userCanInteract, setuserCanInteract] = useState(false);
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { slug } = useParams();

  const navigate = useNavigate();

  const mobileMenu = useRef(null);

  useEffect(() => {
    ToggleMobileMenu(false);
  }, [slug]);

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
      {mobileMenuOpen && (
        <div
          className="header-padding fixed absolute right"
          onClick={() => {
            ToggleMobileMenu(false);
          }}
          style={{
            zIndex: 9999999,
            position: "fixed",
            top: "0",
            right: "0",
          }}
        >
          <img
            alt="closing icon for mobile menu"
            src={process.env.PUBLIC_URL + "/assets/closingIcon.png"}
          ></img>
        </div>
      )}

      {/* top left corner shows logo if not */}
      <div
        className="flex-row top fixed left align-center space-between"
        style={{ width: "100%" }}
      >
        <div className="flex-row align-center" id="header">
          {location.pathname !== "/" &&
          projectName !== null &&
          projectName !== "" ? (
            <>
              <div
                className="circleIcon header-padding interactable"
                style={{
                  backgroundImage: `url(${
                    process.env.PUBLIC_URL + "/assets/returnArrow.png"
                  })`,
                }}
                onClick={() => {
                  navigate(-1);

                  if (width < 600 && mobileMenuOpen) {
                    ToggleMobileMenu(false);
                  }
                }}
              >
                {" "}
              </div>
            </>
          ) : (
            <>
              {" "}
              <HeaderLogoButton
                projectName={projectName}
                mobileMenuOpen={mobileMenuOpen}
                ToggleMobileMenu={ToggleMobileMenu}
              />
              {location.pathname !== "/" &&
              pageName &&
              pageName !== "" &&
              pageName.toLowerCase() !== "timeline" ? (
                <div className="standardButton">
                  <p>{pageName}</p>
                </div>
              ) : null}
            </>
          )}
        </div>

        {location.pathname !== "/" &&
        projectName !== null &&
        projectName !== "" ? (
          <>
            <div className="standardButton projectTitle">
              <p>{projectName}</p>
            </div>

            <div className="header-padding circleIcon empty"> </div>
          </>
        ) : null}
      </div>

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
                style={{ zIndex: 20 }}
              >
                <MenuImage width={80} image={info.burgerTop} />
              </div>
            )}

            {info.headerMenu.map((menuItem, index) => (
              <>
                {menuItem.url ? (
                  <>
                    {" "}
                    <a
                      key={menuItem.url + index}
                      href={menuItem.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        handleclick(e);
                        if (width < 600) {
                          ToggleMobileMenu(false);
                        } else {
                          ToggleMenu(false);
                        }
                      }}
                      className={`flex-row burgerLayer  ${
                        location.pathname !== "/" ? "smallBurger" : "bigBurger"
                      } ${menuOpen ? " open" : "closed"} ${
                        userCanInteract ? " interactable" : "notInteractable"
                      }`}
                      style={{
                        zIndex: 10 - index,
                      }}
                    >
                      <p className="link">{menuItem.title}</p>
                      <MenuImage height={35} image={menuItem.image} />
                    </a>
                  </>
                ) : (
                  <>
                    {" "}
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
                          ? { pathname: menuItem.url }
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
                        location.pathname !== "/" ? "smallBurger" : "bigBurger"
                      } ${menuOpen ? " open" : "closed"} ${
                        userCanInteract ? " interactable" : "notInteractable"
                      }`}
                      style={{
                        zIndex: 10 - index,
                      }}
                    >
                      <p className="link">{menuItem.title}</p>
                      <MenuImage height={35} image={menuItem.image} />
                    </NavLink>
                  </>
                )}
              </>
            ))}
            {info.burgerBottom && (
              <div
                className={`burgerBottom burgerbun  ${
                  menuOpen ? " open" : "closed"
                }`}
                style={{ zIndex: 0 }}
              >
                <MenuImage width={80} image={info.burgerBottom} />
              </div>
            )}
          </div>
        </div>
      )}
      {/* mobile menu background */}
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
      ></div>
    </div>
  );
}
