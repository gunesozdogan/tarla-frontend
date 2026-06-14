import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaLeaf,
  FaCheck,
  FaMapMarkedAlt,
  FaHandHoldingUsd,
  FaRegLightbulb,
} from "react-icons/fa";
import { Search } from "../icons";
import "./InitialPage.css";
import "./Home.css";

const InitialPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      Icon: FaMapMarkedAlt,
      title: t("initialPage.buyLands"),
      desc: t("initialPage.searchLandsDescription"),
      to: "/search",
      cta: t("initialPage.startSearch"),
    },
    {
      Icon: FaHandHoldingUsd,
      title: t("initialPage.sellLands"),
      desc: t("initialPage.sellLandsDescription"),
      to: "/add-listing",
      cta: t("initialPage.getStarted"),
    },
    {
      Icon: FaRegLightbulb,
      title: t("initialPage.howItWorks"),
      desc: t("initialPage.howItWorksDescription"),
      to: "/how-it-works",
      cta: t("initialPage.learnMore"),
    },
  ];

  const stats = [
    { value: t("home.stat1"), label: t("home.stat1Label") },
    { value: t("home.stat2"), label: t("home.stat2Label") },
    { value: t("home.stat3"), label: t("home.stat3Label") },
  ];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-badge">
            <FaLeaf /> {t("home.badge")}
          </span>
          <h1 className="home-hero__title">{t("hero.mainHeading")}</h1>
          <p className="home-hero__sub">{t("hero.secondaryHeading")}</p>

          <div className="home-hero__actions">
            <Link to="/search" className="btn btn--primary">
              <Search /> {t("initialPage.startSearch")}
            </Link>
            <Link to="/add-listing" className="btn btn--ghost">
              {t("initialPage.sellLands")} <FaArrowRight />
            </Link>
          </div>

          <div className="home-stats">
            {stats.map((s, i) => (
              <div className="home-stat" key={i}>
                <span className="home-stat__value">{s.value}</span>
                <span className="home-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="home-hero__media">
          <div className="home-hero__imgwrap">
            <img src="/images/hero.png" alt="" className="home-hero__img" />
          </div>
          <div className="home-hero__chip">
            <span className="home-hero__chip-icon">
              <FaCheck />
            </span>
            <div>
              <strong>{t("home.stat3")}</strong>
              <small>{t("home.stat3Label")}</small>
            </div>
          </div>
        </div>
      </section>
      <section className="home-features">
        <div className="home-section-head">
          <h2>{t("home.featuresTitle")}</h2>
          <p>{t("home.featuresSubtitle")}</p>
        </div>

        <div className="home-feature-grid">
          {features.map(({ Icon, title, desc, to, cta }, i) => (
            <Link to={to} className="feature-card" key={i}>
              <span className="feature-card__icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="feature-card__link">
                {cta} <FaArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__inner">
          <div>
            <h2>{t("home.ctaTitle")}</h2>
            <p>{t("home.ctaText")}</p>
          </div>
          <Link to="/add-listing" className="btn btn--lime">
            {t("home.ctaButton")} <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InitialPage;
