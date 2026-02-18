import { useTranslation } from "react-i18next";
import "./InitialPage.css";
import { Hero } from "../Hero/Hero";
import { CardSection } from "../CardSection/CardSection";
import { useMemo } from "react";
import { FIRST_CARDS_CONFIG } from "./initialPage.cards";

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

  return (
    <div className="listing-search-page">
      <Hero />
      <CardSection cards={firstCards} />
    </div>
  );
};

export default InitialPage;
