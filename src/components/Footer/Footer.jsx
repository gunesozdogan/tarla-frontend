import "./Footer.css";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
          <Link to="/search">{t("initialPage.searchLands")}</Link>
          <Link to="/fieldsView">{t("initialPage.checkLands")}</Link>
          <Link to="/about">{t("initialPage.about")}</Link>
        </div>
      </div>
      <div className="lower-container">
        <p>
          <span>{t("footerPage.rightsReserved")}</span>|
          <Link>Terms of Service</Link>|<Link>Privacy</Link>
        </p>
      </div>
    </div>
  );
};
