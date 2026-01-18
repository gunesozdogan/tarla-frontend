import { useTranslation } from "react-i18next";
import "./InitialPage.css";
import { Hero } from "../Hero/Hero";
import { CardSection } from "../CardSection/CardSection";
import { useMemo } from "react";
import { FIRST_CARDS_CONFIG, SECOND_CARDS_CONFIG } from "./initialPage.cards";

const InitialPage = () => {
  const { t } = useTranslation();

  const firstCards = useMemo(
    () =>
      FIRST_CARDS_CONFIG.map((prop) => {
        return {
          title: t(prop.titleKey),
          description: t(prop.descKey),
          Icon: prop.Icon,
          to: prop.to,
          ButtonIcon: prop.ButtonIcon,
          buttonText: prop.buttonTextKey ? t(prop.buttonTextKey) : "",
          primary: prop.primary,
          background: prop.background,
        };
      }),
    [t],
  );

  const secondCards = useMemo(
    () =>
      SECOND_CARDS_CONFIG.map((prop) => {
        return {
          title: t(prop.titleKey),
          description: t(prop.descKey),
          Icon: prop.Icon,
          to: prop.to,
          ButtonIcon: prop.ButtonIcon,
          buttonText: prop.buttonTextKey ? t(prop.buttonTextKey) : "",
          primary: prop.primary,
          background: prop.background,
        };
      }),
    [t],
  );

  return (
    <div className="listing-search-page">
      <Hero />
      <CardSection cards={firstCards} />
      <section className="how-it-works-section">
        <h2>{t("initialPage.howItWorks")}</h2>
        <CardSection cards={secondCards} />
      </section>
    </div>
  );
};

export default InitialPage;
