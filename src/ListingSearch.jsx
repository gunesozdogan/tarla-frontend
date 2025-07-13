import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "./ListingSearch.css";

const customMarker = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ListingSearch = () => {
  const { t } = useTranslation(); // Hook for translation
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [view, setView] = useState("map");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const params = {};
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minSize) params.minSize = minSize;
      if (maxSize) params.maxSize = maxSize;

      const response = await axios.get("/api/fields/filter", { params });
      setFields(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching fields:", err);
      setError(t("listingSearch.errorMessage"));
    }
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinSize("");
    setMaxSize("");
    fetchFields();
  };

  return (
    <div className="listing-search-page1">
      {/* Filters & View Toggle */}
      <div className="filters-container">
        {/* Toggle Buttons */}
        <div className="view-toggle">
          <button
            className={view === "map" ? "active" : ""}
            onClick={() => setView("map")}
          >
            🗺️ {t("listingSearch.mapView")}
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            📜 {t("listingSearch.listView")}
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="filters">
          <input
            type="number"
            placeholder={t("listingSearch.minPrice")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder={t("listingSearch.maxPrice")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder={t("listingSearch.minSize")}
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
          />
          <input
            type="number"
            placeholder={t("listingSearch.maxSize")}
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="filter-buttons">
          <button className="apply-filters-btn" onClick={fetchFields}>
            {t("listingSearch.applyFilters")}
          </button>
          <button
            className="apply-filters-btn"
            style={{ backgroundColor: "#d9534f" }}
            onClick={clearFilters}
          >
            {t("listingSearch.clearFilters")}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* List View */}
      {view === "list" && (
        <div className="fields-grid1">
          {fields.length > 0 ? (
            fields.map((field) => (
              <div key={field.id} className="field-card1">
                <h3>{field.name}</h3>
                <p>
                  📍 <strong>{t("listingSearch.location")}</strong>{" "}
                  {field.location}
                </p>
                <p>
                  📏 <strong>{t("listingSearch.size")}</strong> {field.size}{" "}
                  acres
                </p>
                <p>
                  💵 <strong>{t("listingSearch.price")}</strong> $
                  {field.price.toLocaleString()}
                </p>
                <button
                  className="view-details-btn1"
                  onClick={() => navigate(`/viewdetails/${field.id}`)}
                >
                  {t("listingSearch.viewDetails")}
                </button>
              </div>
            ))
          ) : (
            <p className="no-fields1">{t("listingSearch.noFieldsAvailable")}</p>
          )}
        </div>
      )}

      {/* Map View */}
      {view === "map" && (
        <div className="map-container1">
          <MapContainer
            center={[39, 35]}
            zoom={6}
            className="leaflet-container"
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MarkerClusterGroup>
              {fields.map((field) => (
                <Marker
                  key={field.id}
                  position={[field.latitude, field.longitude]}
                  icon={customMarker}
                >
                  <Popup>
                    <div className="popup-content">
                      <strong>{field.name}</strong>
                      <br />
                      📍 {t("listingSearch.location")} {field.location}
                      <br />
                      📏 {t("listingSearch.size")} {field.size} acres
                      <br />
                      💵 {t("listingSearch.price")} $
                      {field.price.toLocaleString()}
                      <br />
                      <button
                        className="popup-details-btn"
                        onClick={() => navigate(`/viewdetails/${field.id}`)}
                      >
                        {t("listingSearch.viewDetails")}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ListingSearch;
