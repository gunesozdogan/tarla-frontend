import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaRulerCombined, FaLiraSign } from "react-icons/fa";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err.message);
        setError(t("favoritesPage.error"));
      }
    };

    fetchFavorites();
  }, [t]);

  return (
    <div className="favorites-page">
      <h1>{t("favoritesPage.title")}</h1>
      {error && <p className="error-message">{error}</p>}
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((field) => (
            <div key={field.id} className="favorite-card">
              <h3>{field.name}</h3>
              <p>
                <FaMapMarkerAlt /> <strong>{t("favoritesPage.location")}:</strong>{" "}
                {field.location}
              </p>
              <p>
                <FaRulerCombined /> <strong>{t("favoritesPage.size")}:</strong>{" "}
                {field.size != null ? `${Math.round(Number(field.size)).toLocaleString()} m²` : "-"}
              </p>
              <p>
                <FaLiraSign /> <strong>{t("favoritesPage.price")}:</strong>{" "}
                {field.price != null ? `${Number(field.price).toLocaleString("tr-TR")} ₺` : "-"}
              </p>
              <button
                className="view-details-btn"
                onClick={() => navigate(`/viewdetails/${field.id}`)}
              >
                {t("favoritesPage.viewDetails")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-favorites">{t("favoritesPage.noFavorites")}</p>
      )}
    </div>
  );
};

export default FavoritesPage;
