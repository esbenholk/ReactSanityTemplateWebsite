import React, { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../globalState";
import { urlFor } from "./blocks/image";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { MenuImage } from "./menuItem";
import useWindowDimensions from "./functions/useWindowDimensions";
import { useParams } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

export function HeaderLogoButton({
  projectName,
  mobileMenuOpen,
  ToggleMobileMenu,
}) {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const logoUrl = urlFor(info.logo.asset).width(80).url();
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
              zIndex: 999999,
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
                  ? `url(${process.env.PUBLIC_URL + "/assets/arrowBack.svg"}`
                  : `url(${logoUrl}`,
            }}
            onClick={() => {
              if (width < 900 && mobileMenuOpen) {
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
            if (width < 900 && mobileMenuOpen) {
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
export default function Header({
  pageName,
  projectName,
  projectLogo,
  updateDarkMode,
  isDarkMode,
}) {
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
      }, 850);
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
      {/* top left corner shows logo if not */}
      <div
        className="flex-row top fixed left align-center space-between"
        // style={{ width: "100%" }}
      >
        <div className="flex-row align-center" id="header">
          {location.pathname !== "/" &&
          projectName !== null &&
          projectName !== "" ? (
            <>
              <div
                className="circleIcon header-padding interactable return"
                style={{
                  backgroundImage: `url(${
                    process.env.PUBLIC_URL + "/assets/returnArrow.svg"
                  })`,
                }}
                onClick={() => {
                  navigate(-1);

                  if (width < 900 && mobileMenuOpen) {
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
              {!mobileMenuOpen &&
              location.pathname !== "/" &&
              pageName &&
              pageName !== "" &&
              !location.pathname.includes("timeline") ? (
                <div className="headingButton lightButton">
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
            <div
              className="headingButton lightButton projectTitle"
              style={{
                position: "fixed",
                left: "50%",
                transform: "translate(-50%,0)",
              }}
            >
              {projectLogo ? (
                <img
                  src={projectLogo}
                  className="logoImage iconThatShouldChangebackInNightMode"
                  alt="logo"
                />
              ) : (
                <p>{projectName}</p>
              )}
            </div>

            <div className="header-padding circleIcon empty"> </div>
          </>
        ) : null}
      </div>
      {width > 900 && (
        <div className="lightmodebutton desktop">
          <DarkModeToggle />
        </div>
      )}

      {/* mobile menu background */}
      <div
        onClick={() => {
          ToggleMobileMenu(false);
        }}
        ref={mobileMenu}
        className="mobileMenu"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,

          display: "none",
          zIndex: 9999999,
        }}
      >
        {width < 900 && (
          <div className="absolute bottom left darkmodebutton">
            <DarkModeToggle />
          </div>
        )}
      </div>

      {info.headerMenu && (
        <div
          className="menuContainer top fixed right "
          style={{
            maxWidth: `${location.pathname === "/" ? "90px" : "80px"}`,
            zIndex: 99999999999,
          }}
          onMouseEnter={() => {
            if (width > 900) {
              ToggleMenu(true);
            }
          }}
          onMouseLeave={() => {
            if (width > 900) {
              ToggleMenu(false);
            }
          }}
          onClick={() => {
            if (width < 900 && !mobileMenuOpen) {
              ToggleMobileMenu(true);
            }
          }}
        >
          <div
            // open={menuOpen}

            className={`flex-column align-right burger  ${
              menuOpen ? " open" : "closed"
            }${location.pathname !== "/" ? " small" : " big"}`}
          >
            {info.burgerTop && (
              <div
                className={`burgerTop burgerbun  ${
                  menuOpen ? " open" : "closed"
                }`}
                style={{ zIndex: 999999 + 20 }}
              >
                <MenuImage width={320} image={info.burgerTop} />
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
                        if (width < 900) {
                          ToggleMobileMenu(false);
                        } else {
                          ToggleMenu(false);
                        }
                      }}
                      className={`flex-row burgerLayer   ${
                        menuOpen ? " open" : "closed"
                      } ${
                        userCanInteract ? " interactable" : "notInteractable"
                      }`}
                      style={{
                        zIndex: 999999 + 10 - index,
                      }}
                    >
                      <p className="link">{menuItem.title}</p>
                      <MenuImage width={320} image={menuItem.image} />
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
                        if (width < 900) {
                          ToggleMobileMenu(false);
                        } else {
                          ToggleMenu(false);
                        }
                      }}
                      className={`flex-row burgerLayer   ${
                        menuOpen ? " open" : "closed"
                      } ${
                        userCanInteract ? " interactable" : "notInteractable"
                      }`}
                      style={{
                        zIndex: 999999 + 10 - index,
                      }}
                    >
                      <p className="link">{menuItem.title}</p>
                      <MenuImage width={320} image={menuItem.image} />
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
                style={{ zIndex: 999999 + 0 }}
              >
                <MenuImage width={320} image={info.burgerBottom} />
              </div>
            )}
          </div>
        </div>
      )}
      {mobileMenuOpen && (
        <div
          className="header-padding fixed absolute right tabletright"
          onClick={() => {
            ToggleMobileMenu(false);
          }}
          style={{
            zIndex: 999999999999999,
            position: "fixed",
            top: "10px",
          }}
        >
          <img
            alt="closing icon for mobile menu"
            src={process.env.PUBLIC_URL + "/assets/closingIcon.png"}
          ></img>
        </div>
      )}
    </div>
  );
}
