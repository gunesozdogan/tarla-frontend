import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "../src/components/InitialPage/InitialPage.css";

// Custom marker icon
const customMarker = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Home button to reset view
const HomeButton = () => {
  const map = useMap();
  const handleResetView = () => {
    map.setView([39, 35], 6); // Reset to Turkey
  };

  return (
    <button className="map-button home-button" onClick={handleResetView}>
      🏠
    </button>
  );
};

// Toggle between Satellite and Normal map view
const MapStyleToggle = ({ setTileLayer }) => {
  return (
    <button
      className="map-button style-toggle-button"
      onClick={() =>
        setTileLayer((prev) =>
          prev === "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        )
      }
    >
      🌍
    </button>
  );
};

// User Location Button
const UserLocationButton = () => {
  const map = useMap();
  const handleLocateUser = () => {
    map.locate({ setView: true, maxZoom: 12 });
  };

  return (
    <button className="map-button location-button" onClick={handleLocateUser}>
      📍
    </button>
  );
};

// Detects user movement in map
const MapEventHandler = ({ setFields }) => {
  useMapEvents({
    moveend: async (event) => {
      const map = event.target;
      const bounds = map.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      try {
        const response = await axios.get(`/api/fields/search`, {
          params: { north, south, east, west },
        });
        setFields(response.data);
      } catch (err) {
        console.error("Error fetching fields:", err);
      }
    },
  });

  return null;
};

const FieldsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const [tileLayer, setTileLayer] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  );

  // Fetch initial fields when the page loads (default Turkey bounds)
  useEffect(() => {
    const fetchInitialFields = async () => {
      const north = 42;
      const south = 36;
      const east = 44;
      const west = 25;

      try {
        const response = await fetch(
          `/api/fields/search?north=${north}&south=${south}&east=${east}&west=${west}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch initial fields");
        }

        const data = await response.json();
        setFields(data);
      } catch (err) {
        console.error("Error fetching initial fields:", err);
        setError(t("initialPage.error"));
      }
    };

    fetchInitialFields();
  }, [t]);

  return (
    <div className="listing-lower-section">
      {/* Left Section: Field Listings */}
      <div className="fields-list">
        <h2>{t("initialPage.fieldsInView")}</h2>
        {error && <p className="error">{error}</p>}
        <div className="field-cards">
          {fields.length > 0 ? (
            fields.map((field) => (
              <div key={field.id} className="field-card">
                <h3>{field.name}</h3>
                <p>
                  📍 <strong>{t("initialPage.location")}:</strong>{" "}
                  {field.location}
                </p>
                <p>
                  📏 <strong>{t("initialPage.size")}:</strong> {field.size}{" "}
                  acres
                </p>
                <p>
                  💵 <strong>{t("initialPage.price")}:</strong> $
                  {field.price.toLocaleString()}
                </p>
                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/viewdetails/${field.id}`)}
                >
                  {t("initialPage.viewDetails")}
                </button>
              </div>
            ))
          ) : (
            <p>{t("initialPage.noFields")}</p>
          )}
        </div>
      </div>
      {/* Right Section: Map */}
      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer
            center={[39, 35]}
            zoom={6}
            className="leaflet-container"
          >
            <TileLayer
              url={tileLayer}
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapEventHandler setFields={setFields} />
            <HomeButton />
            <MapStyleToggle setTileLayer={setTileLayer} />
            <UserLocationButton />

            {/* Clustered markers */}
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
                      📍 {field.location}
                      <br />
                      📏 {field.size} acres
                      <br />
                      💵 ${field.price.toLocaleString()}
                      <br />
                      <button
                        className="popup-details-btn"
                        onClick={() => navigate(`/viewdetails/${field.id}`)}
                      >
                        {t("initialPage.viewDetails")}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FieldsView;
