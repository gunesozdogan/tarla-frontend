import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ListingAnalytics.css";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ListingAnalytics = () => {
  const { fieldId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/fields/${fieldId}/analytics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(t("listingAnalytics.error"));
      }
    };

    fetchAnalytics();
  }, [fieldId, t]);

  if (error) return <p className="analytics-error">{error}</p>;
  if (!analytics)
    return <p className="analytics-loading">{t("listingAnalytics.loading")}</p>;

  return (
    <div className="analytics-container">
      <h1>{t("listingAnalytics.title")}</h1>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>📊 {t("listingAnalytics.views")}</h3>
          <p>{analytics.num_views}</p>
        </div>
        <div className="summary-card">
          <h3>✏️ {t("listingAnalytics.edits")}</h3>
          <p>{analytics.num_edits}</p>
        </div>
        <div className="summary-card">
          <h3>💰 {t("listingAnalytics.priceChange")}</h3>
          <p>{analytics.price_change}%</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h2>{t("listingAnalytics.viewsVsEdits")}</h2>
          <Pie
            data={{
              labels: [
                t("listingAnalytics.views"),
                t("listingAnalytics.edits"),
              ],
              datasets: [
                {
                  data: [analytics.num_views, analytics.num_edits],
                  backgroundColor: ["#2e6b2d", "#f44336"],
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="chart-card">
          <h2>{t("listingAnalytics.priceComparison")}</h2>
          <Bar
            data={{
              labels: [
                t("listingAnalytics.priceLabel"),
                t("listingAnalytics.priceLabel"),
              ],
              datasets: [
                {
                  label: t("listingAnalytics.priceLabel"),
                  data: [
                    parseFloat(analytics.initial_price),
                    parseFloat(analytics.initial_price) *
                      (1 + analytics.price_change / 100),
                  ],
                  backgroundColor: ["#007bff", "#ff9800"],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        <div className="chart-card">
          <h2>{t("listingAnalytics.interactions")}</h2>
          <Doughnut
            data={{
              labels: [
                t("listingAnalytics.edits"),
                t("listingAnalytics.views"),
              ],
              datasets: [
                {
                  data: [analytics.num_edits, analytics.num_views],
                  backgroundColor: ["#f44336", "#2e6b2d"],
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingAnalytics;
