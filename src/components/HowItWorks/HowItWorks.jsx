import { useMemo } from "react";
import { SECOND_CARDS_CONFIG } from "../InitialPage/initialPage.cards";
import { useTranslation } from "react-i18next";
import { HowItWorksCards } from "./HowItWorksCards";

export const HowItWorks = () => {
  const { t } = useTranslation();

  const secondCards = useMemo(
    () =>
      SECOND_CARDS_CONFIG.map((prop) => {
        return {
          title: t(prop.titleKey),
          description: t(prop.descKey),
          Icon: prop.Icon,
          backgroundImage: prop.background,
        };
      }),
    [t]
  );
  return (
    <section className="how-it-works-section">
      <h2>{t("initialPage.howItWorks")}</h2>
      <HowItWorksCards cards={secondCards} />
    </section>
  );
};
