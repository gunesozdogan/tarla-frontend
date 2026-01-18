import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";
import googleLogo from "../../assets/google-icon.svg";
import facebookLogo from "../../assets/facebook-logo.svg";

const LoginPage = ({ setUser }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users/login", {
        username,
        password,
      });

      if (response.data.token) {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(response.data.user);
        setError("");
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(t("loginPage.invalidCredentials"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>{t("loginPage.welcomeBack")}</h2>
          <p>{t("loginPage.loginToAccess")}</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{t("loginPage.username")}</label>
              <input
                type="text"
                placeholder={t("loginPage.enterUsername")}
                value={username}
                className="login-input"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("loginPage.password")}</label>
              <input
                type="password"
                placeholder={t("loginPage.enterPassword")}
                value={password}
                className="login-input"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-btn">
              {t("loginPage.loginButton")}
            </button>
          </form>

          <div className="social-login">
            <a
              className="google-btn"
              href="http://localhost:4000/api/users/auth/google"
            >
              <img src={googleLogo} alt="Google" />
              {t("loginPage.loginWithGoogle")}
            </a>

            <a
              className="facebook-btn"
              href="http://localhost:4000/api/users/auth/facebook"
            >
              <img src={facebookLogo} alt="Facebook" />
              {t("loginPage.loginWithFacebook")}
            </a>
          </div>

          <div className="signup-link">
            <p>
              {t("loginPage.dontHaveAccount")}{" "}
              <span onClick={() => navigate("/signup")}>
                {t("loginPage.signUpLink")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
