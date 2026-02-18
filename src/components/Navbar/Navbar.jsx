import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaStar,
  FaSearch,
  FaThLarge,
  FaPlusCircle,
  FaBell,
  FaUser,
  FaGlobe,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = ({ user, setUser, darkMode, setDarkMode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

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
      <div className="logo-container">
        <img src={logo} alt="Tarla Logo" />
        <h1>Tarla</h1>
      </div>

      <div className="nav-links">
        <div className="nav-links-inner">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <FaHome /> {t("navbar.home")}
          </Link>
          <Link
            to="/search"
            className={location.pathname === "/search" ? "active" : ""}
          >
            <FaSearch /> {t("initialPage.buyLands")}
          </Link>
          <Link
            to="/add-listing"
            className={location.pathname === "/add-listing" ? "active" : ""}
          >
            <FaPlusCircle /> {t("initialPage.sellLands")}
          </Link>
          <Link
            to="/mylistings"
            className={location.pathname === "/mylistings" ? "active" : ""}
          >
            <FaThLarge /> {t("navbar.myListings")}
          </Link>
        </div>

        <div className="nav-links-inner">
          <Link
            to="/favorites"
            className={location.pathname === "/favorites" ? "active" : ""}
          >
            <FaStar />
          </Link>
          <Link
            to="/notifications"
            className={location.pathname === "/notifications" ? "active" : ""}
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
    </nav>
  );
};

export default Navbar;
