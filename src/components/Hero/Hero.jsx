import "./Hero.css";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <h1>{t("hero.mainHeading")}</h1>
          <p>{t("hero.secondaryHeading")}</p>
        </div>

        <div className="hero-right">
          <div className="hero-image"></div>
          <div className="hero-fade"></div>
        </div>
      </div>
    </section>
  );
};
