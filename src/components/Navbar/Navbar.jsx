import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaSearch,
  FaThLarge,
  FaPlusCircle,
  FaBell,
  FaUser,
  FaGlobe,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = ({ user, setUser, darkMode, setDarkMode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  const navInnerRef = useRef(null);
  const highlightRef = useRef(null);
  const linkRefs = useRef([]);

  const navPaths = ["/search", "/add-listing", "/mylistings"];

  const updateHighlight = useCallback(() => {
    const activeIndex = navPaths.indexOf(location.pathname);
    const container = navInnerRef.current;
    const highlight = highlightRef.current;
    const activeLink = linkRefs.current[activeIndex];

    if (!container || !highlight) return;

    if (activeIndex === -1 || !activeLink) {
      highlight.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    highlight.style.opacity = "1";
    highlight.style.left = `${linkRect.left - containerRect.left}px`;
    highlight.style.width = `${linkRect.width}px`;
  }, [location.pathname]);

  useEffect(() => {
    updateHighlight();
  }, [updateHighlight]);

  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    setLanguage(lng);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        <img src={logo} alt="Tarla Logo" />
        <h1>Tarla</h1>
      </Link>

      <div className="nav-links">
        <div className="nav-links-inner" ref={navInnerRef}>
          <div className="nav-highlight" ref={highlightRef}></div>
          <Link
            to="/search"
            ref={(el) => (linkRefs.current[0] = el)}
            className={location.pathname === "/search" ? "active" : ""}
          >
            <FaSearch /> <span>{t("initialPage.buyLands")}</span>
          </Link>
          <Link
            to="/add-listing"
            ref={(el) => (linkRefs.current[1] = el)}
            className={location.pathname === "/add-listing" ? "active" : ""}
          >
            <FaPlusCircle /> <span>{t("initialPage.sellLands")}</span>
          </Link>
          <Link
            to="/mylistings"
            ref={(el) => (linkRefs.current[2] = el)}
            className={location.pathname === "/mylistings" ? "active" : ""}
          >
            <FaThLarge /> <span>{t("navbar.myListings")}</span>
          </Link>
        </div>

        <div className="nav-links-inner">
          <Link
            to="/favorites"
            className={location.pathname === "/favorites" ? "active" : ""}
            title={t("navbar.favorites")}
          >
            <FaStar />
          </Link>
          <Link
            to="/notifications"
            className={location.pathname === "/notifications" ? "active" : ""}
            title={t("navbar.notifications")}
          >
            <FaBell />
          </Link>
          <div className="profile">
            <FaUser size={20} />
            <div className="profile-dropdown">
              {user ? (
                <>
                  <Link to="/profile">{t("navbar.viewProfile")}</Link>
                  <div className="logout-btn" onClick={handleLogout}>
                    {t("navbar.logout")}
                  </div>
                </>
              ) : (
                <div className="login-btn" onClick={() => navigate("/login")}>
                  {t("navbar.login")}
                </div>
              )}
            </div>
          </div>

          <div className="dark-mode-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="language-selector">
            <button
              className="lang-button"
              onClick={() => setLangOpen(!langOpen)}
              title={t("navbar.language")}
            >
              <FaGlobe />
            </button>
            <span className="lang-name">{language.toUpperCase()}</span>
            {langOpen && (
              <div className="lang-dropdown">
                <button onClick={() => changeLanguage("en")}>
                  {t("navbar.english")}
                </button>
                <button onClick={() => changeLanguage("tr")}>
                  {t("navbar.turkish")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="hamburger-menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link
            to="/search"
            className={location.pathname === "/search" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaSearch /> {t("initialPage.buyLands")}
          </Link>
          <Link
            to="/add-listing"
            className={location.pathname === "/add-listing" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaPlusCircle /> {t("initialPage.sellLands")}
          </Link>
          <Link
            to="/mylistings"
            className={location.pathname === "/mylistings" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaThLarge /> {t("navbar.myListings")}
          </Link>
          <div className="mobile-menu-divider" />
          <Link
            to="/favorites"
            className={location.pathname === "/favorites" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaStar /> {t("navbar.favorites")}
          </Link>
          <Link
            to="/notifications"
            className={location.pathname === "/notifications" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaBell /> {t("navbar.notifications")}
          </Link>
          <div className="mobile-menu-divider" />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <FaUser /> {t("navbar.viewProfile")}
              </Link>
              <div className="logout-btn-mobile" onClick={handleLogout}>
                {t("navbar.logout")}
              </div>
            </>
          ) : (
            <div
              className="login-btn-mobile"
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
            >
              {t("navbar.login")}
            </div>
          )}
          <div className="mobile-menu-divider" />
          <div className="mobile-language-selector">
            <span className="mobile-lang-label">
              <FaGlobe /> {t("navbar.language")}
            </span>
            <div className="mobile-lang-options">
              <button
                className={language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
              >
                {t("navbar.english")}
              </button>
              <button
                className={language === "tr" ? "active" : ""}
                onClick={() => changeLanguage("tr")}
              >
                {t("navbar.turkish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
