import { IconWrapper } from "../IconWrapper/IconWrapper";
import { Link } from "react-router-dom";
import "./CardSection.css";

export const CardSection = ({ cards }) => {
  return (
    <div className="initial-page-sections">
      {cards.map((card, index) => {
        const {
          Icon,
          title,
          description,
          background,
          to,
          buttonText,
          primary,
          ButtonIcon,
        } = card;
        return (
          <div
            className={
              background
                ? "initial-page-section-item initial-page-section-item-second"
                : "initial-page-section-item"
            }
            key={index}
            style={!background ? { padding: "2rem", borderRadius: "8px" } : {}}
          >
            <div className="initial-page-section-inner">
              <h3 className="initial-page-section-item-title">
                <IconWrapper>
                  <Icon color="var(--color-icon-primary)" />
                </IconWrapper>
                {title}
              </h3>
              <p className="initial-page-section-item-description">
                {description}
              </p>
            </div>
            {background && (
              <div
                style={{ backgroundImage: background }}
                className="initial-page-section-inner-image"
              ></div>
            )}
            {buttonText && (
              <Link
                to={to}
                className={`initial-page-section-item-button ${primary ? " initial-page-section-item-button-primary" : ""}`}
              >
                {ButtonIcon && <ButtonIcon />}
                {buttonText}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
