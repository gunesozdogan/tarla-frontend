import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginWarning.css";

const LoginWarning = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="login-warning-container">
      <div className="login-warning-box">
        <h2>🔒 {t("loginWarning.accessRestricted")}</h2>
        <p>{t("loginWarning.loginRequired")}</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          {t("loginWarning.loginButton")}
        </button>
      </div>
    </div>
  );
};

export default LoginWarning;
