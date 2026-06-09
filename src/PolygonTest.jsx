import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PolygonTest = () => {
  const { t } = useTranslation();
  const [polygonData, setPolygonData] = useState([]);

  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        const response = await axios.get("/api/fields/testpolygon");
        if (response.data) {
          const parsedPolygons = response.data.map((field) => {
            const geojson = JSON.parse(field.geojson);

            return {
              id: field.id,
              name: field.name,
              coordinates: geojson.coordinates[0].map((coord) => [
                coord[1],
                coord[0],
              ]),
            };
          });

          setPolygonData(parsedPolygons);
        }
      } catch (error) {
        console.error("Error fetching polygon data:", error);
      }
    };

    fetchPolygons();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h2 style={{ textAlign: "center" }}>{t("polygonTest.title")}</h2>{" "}
      <MapContainer
        center={[39, 32.5]}
        zoom={6}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {polygonData.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.coordinates}
            color="blue"
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default PolygonTest;
