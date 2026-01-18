import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import { useTranslation } from "react-i18next";

const AdminNavbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <h1>{t("adminNavbar.title")}</h1>
      </div>
      <ul className="admin-navbar-links">
        <li>
          <NavLink to="/admin/dashboard" activeClassName="active-link">
            {t("adminNavbar.dashboard")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/requests" activeClassName="active-link">
            {t("adminNavbar.requests")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/fields" activeClassName="active-link">
            {t("adminNavbar.fields")}
          </NavLink>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        {t("adminNavbar.logout")}
      </button>
    </nav>
  );
};

export default AdminNavbar;
