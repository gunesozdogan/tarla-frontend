import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./ViewDetailsPage.css";
import heartEmpty from "../../assets/heart-empty.png";
import heartFilled from "../../assets/heart-filled.png";
import markerIcon from "../../assets/marker-icon.png";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const BACKEND_URL = "http://localhost:4000";
new L.Icon({
  iconUrl: markerIcon,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});
const ViewDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [field, setField] = useState(null);
  const [polygonData, setPolygonData] = useState(null);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const response = await axios.get(`/api/fields/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setField(response.data);

        const favResponse = await axios.get(`/api/users/favorites/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsFavorite(favResponse.data.isFavorite);
      } catch (err) {
        console.error("Error fetching field details:", err);
        setError(t("viewDetailsPage.fieldDetailsError"));
      }
    };

    const fetchPolygonData = async () => {
      try {
        const response = await axios.get(`/api/fields/${id}/geojson`);
        if (response.data.geojson) {
          const geojson = JSON.parse(response.data.geojson);
          setPolygonData(
            geojson.coordinates[0].map((coord) => [coord[1], coord[0]]),
          );
        }
      } catch (err) {
        console.error("Error fetching polygon data:", err);
      }
    };

    fetchFieldDetails();
    fetchPolygonData();
  }, [id, t]);

  if (error) return <p className="details-error-message">{error}</p>;
  if (!field)
    return (
      <p className="details-loading-message">
        {t("viewDetailsPage.fieldDetailsLoading")}
      </p>
    );

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % field.photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + field.photos.length) % field.photos.length,
    );
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/users/favorites/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(
          "/api/users/favorites",
          { fieldId: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      }

      const favResponse = await axios.get(`/api/users/favorites/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsFavorite(favResponse.data.isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="view-details-page">
      <div className="details-info-container">
        <div className="details-header">
          <h1>{field.name}</h1>
          <p className="details-price">{field.price != null ? `${Number(field.price).toLocaleString("tr-TR")} ₺` : "-"}</p>
          <button className="favorite-btn" onClick={toggleFavorite}>
            <img
              src={isFavorite ? heartFilled : heartEmpty}
              alt="Favorite Icon"
            />
          </button>
        </div>

        <div className="details-info">
          <p>
            <strong>{t("viewDetailsPage.fieldOwnerName")}</strong>{" "}
            {field.owner_name}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldOwnerPhone")}</strong>{" "}
            {field.owner_phone}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldLocation")}</strong>{" "}
            {field.location}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldSize")}</strong>{" "}
            {field.size != null ? `${Math.round(Number(field.size)).toLocaleString()} m²` : "-"}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldRainfall")}</strong>{" "}
            {field.annual_rainfall} mm
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldSoilQuality")}</strong>{" "}
            {field.soil_quality_description || "Unknown"}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldCropTypes")}</strong>{" "}
            {field.crop_types.join(", ")}
          </p>
          <p>
            <strong>{t("viewDetailsPage.fieldDescription")}</strong>{" "}
            {field.description}
          </p>
        </div>

        <div className="details-photos-section">
          <h2>{t("viewDetailsPage.photosSectionTitle")}</h2>
          {field.photos && field.photos.length > 0 ? (
            <div className="details-photos-grid">
              {field.photos.slice(0, 4).map((photo, index) => (
                <img
                  key={index}
                  src={`${BACKEND_URL}${photo}`}
                  alt={`${index + 1}`}
                  className="details-photo"
                  onClick={() => {
                    setShowModal(true);
                    setCurrentPhotoIndex(index);
                  }}
                />
              ))}
              {field.photos.length > 4 && (
                <div
                  className="details-more-photos-btn"
                  onClick={() => {
                    setShowModal(true);
                    setCurrentPhotoIndex(4);
                  }}
                  style={{
                    backgroundImage: `url(${BACKEND_URL}${field.photos[4]})`,
                  }}
                >
                  <span>
                    +{field.photos.length - 4} {t("viewDetailsPage.morePhotos")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p>{t("viewDetailsPage.noPhotosAvailable")}</p>
          )}
        </div>
      </div>

      <div className="details-map-container">
        <MapContainer
          center={[field.latitude, field.longitude]}
          zoom={16}
          className="details-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {polygonData && (
            <Polygon positions={polygonData} color="blue">
              <Popup>
                {field.name} - {t("viewDetailsPage.mapFieldBoundary")}
              </Popup>
            </Polygon>
          )}
        </MapContainer>
      </div>

      {showModal && field.photos && field.photos.length > 0 && (
        <div
          className="photo-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="photo-modal-close"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <img
              src={`${BACKEND_URL}${field.photos[currentPhotoIndex]}`}
              alt={`${currentPhotoIndex + 1}`}
              className="modal-photo"
            />
            <p className="photo-count">
              <button className="photo-modal-prev" onClick={handlePrevPhoto}>
                ←
              </button>
              {currentPhotoIndex + 1} / {field.photos.length}
              <button className="photo-modal-next" onClick={handleNextPhoto}>
                →
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetailsPage;
