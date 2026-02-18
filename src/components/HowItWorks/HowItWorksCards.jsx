import "./HowItWorksCards.css";

export const HowItWorksCards = ({ cards }) => {
  const elements = [];

  cards.forEach((card, index) => {
    const { title, description, backgroundImage } = card;

    elements.push(
      <div key={`card-${index}`} className="how-it-works-card-outer-wrapper">
        <div className="how-it-works-card">
          <div className="how-it-works-card-icon-wrapper">
            <div className="how-it-works-card-number">{index + 1}</div>
            <div
              className="how-it-works-card-icon"
              style={
                backgroundImage
                  ? {
                      backgroundImage: backgroundImage,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            />
          </div>
          <h3 className="how-it-works-card-title">{title}</h3>
          <p className="how-it-works-card-description">{description}</p>
        </div>
      </div>
    );

    if (index < cards.length - 1) {
      elements.push(
        <svg
          key={`connector-${index}`}
          className="how-it-works-connector-svg"
          viewBox="0 0 80 40"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 20 C 20 0, 60 40, 80 20"
            stroke="#5ba877"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          ></path>
        </svg>
      );
    }
  });

  return <div className="how-it-works-cards-outer-container">{elements}</div>;
};
