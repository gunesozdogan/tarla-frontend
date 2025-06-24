import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./InitialPage.css";

const InitialPage = () => {
  const { t } = useTranslation();

  return (
    <div className="listing-search-page">
      <div className="initial-page-sections">
        <Link to="/add-listing">{t("initialPage.sellFields")}</Link>
        <Link to="/search">{t("initialPage.searchFields")}</Link>
        <Link to="/fieldsView">{t("initialPage.checkView")}</Link>
      </div>
    </div>
  );
};

export default InitialPage;
