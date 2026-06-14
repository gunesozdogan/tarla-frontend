import "./Footer.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SocialIcon = ({ children }) => (
  <span style={{ fontSize: "1.2rem" }}>{children}</span>
);

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer-container">
      <div className="upper-container">
        <div className="logo-container">
          <img src={logo} alt="Tarla Logo" />
          <h1>Tarla</h1>
        </div>
        <div className="link-container">
          <Link to="/add-listing">{t("initialPage.sellLands")}</Link>
          <Link to="/search">{t("initialPage.buyLands")}</Link>
          <Link to="/fieldsView">{t("initialPage.checkLands")}</Link>
          <Link to="/about">{t("initialPage.about")}</Link>
        </div>
      </div>
      <div className="divider" />
      <div className="footer-bottom">
        <div className="lower-container">
          <p>
            <span>{t("footerPage.rightsReserved")}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <Link>Terms of Service</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <Link>Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
