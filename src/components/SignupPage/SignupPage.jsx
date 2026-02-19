import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "./SignupPage.css";

const SignupPage = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Validate form data
    if (password !== confirmPassword) {
      setError(t("signupPage.errorPasswordMismatch"));
      return;
    }

    try {
      const response = await axios.post("/api/users/signup", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(t("signupPage.successSignup"));
        setError("");

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        if (err.response.data.code === "USERNAME_EXISTS") {
          setError(t("signupPage.errorUsernameExists"));
        } else {
          setError(t("signupPage.errorEmailExists"));
        }
      } else {
        setError(t("signupPage.errorSignupFailed"));
        setSuccess("");
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h1>{t("signupPage.title")}</h1>
          <p>{t("signupPage.createNewAccount")}</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("signupPage.username")}</label>
              <input
                type="text"
                name="username"
                placeholder={t("signupPage.enterUsername")}
                value={formData.username}
                onChange={handleInputChange}
                className="signup-input"
                required
              />
            </div>

            <div className="form-group">
              <label>{t("signupPage.email")}</label>
              <input
                type="email"
                name="email"
                placeholder={t("signupPage.enterEmail")}
                value={formData.email}
                onChange={handleInputChange}
                className="signup-input"
                required
              />
            </div>

            <div className="form-group">
              <label>{t("signupPage.password")}</label>
              <input
                type="password"
                name="password"
                placeholder={t("signupPage.enterPassword")}
                value={formData.password}
                onChange={handleInputChange}
                className="signup-input"
                required
              />
            </div>

            <div className="form-group">
              <label>{t("signupPage.confirmPassword")}</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("signupPage.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="signup-input"
                required
              />
            </div>

            <button type="submit" className="signup-btn">
              {t("signupPage.submitButton")}
            </button>
          </form>

          <div className="signup-link">
            <p>
              {t("signupPage.alreadyHaveAccount")}{" "}
              <button
                type="button"
                className="back-to-login-btn"
                onClick={() => navigate("/login")}
              >
                {t("signupPage.backToLoginButton")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
