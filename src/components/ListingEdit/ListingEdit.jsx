import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import "./ListingEdit.css";

const ListingEdit = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Access the translation function
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    description: "",
    historical_data: "",
    annual_rainfall: "",
    soil_quality_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await axios.get(`/api/fields/${listingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setFormData({
          name: response.data.name,
          size: response.data.size,
          price: response.data.price,
          description: response.data.description,
          annual_rainfall: response.data.annual_rainfall,
          soil_quality_id: response.data.soil_quality_id,
          historical_data: response.data.historical_data,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(t("listingEdit.errorMessage"));
        setLoading(false);
      }
    };
    fetchListingDetails();
  }, [listingId, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      name: formData.name,
      size: formData.size,
      price: formData.price,
      description: formData.description,
      annualRainfall: formData.annual_rainfall,
      soilQualityId: formData.soil_quality_id,
      historicalData: formData.historical_data,
    };

    try {
      await axios.put(`/api/fields/${listingId}`, formattedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess(t("listingEdit.successMessage"));
      setError("");
      setTimeout(() => navigate("/mylistings"), 2000);
    } catch (err) {
      console.error("Error updating listing:", err);
      setError(t("listingEdit.errorMessage"));
      setSuccess("");
    }
  };

  if (loading)
    return <p className="loading-message">{t("listingEdit.loadingMessage")}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="edit-listing-container">
      <h1>{t("listingEdit.title")}</h1>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-listing-form">
        <div className="input-group">
          <label>{t("listingEdit.name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.size")}</label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.price")}</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.description")}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.annualRainfall")}</label>
          <input
            type="number"
            name="annual_rainfall"
            value={formData.annual_rainfall}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.soilQuality")}</label>
          <input
            type="text"
            name="soil_quality_id"
            value={formData.soil_quality_id}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>{t("listingEdit.historicalData")}</label>
          <textarea
            name="historical_data"
            value={formData.historical_data}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="save-btn">
          {t("listingEdit.saveChanges")}
        </button>
      </form>
    </div>
  );
};

export default ListingEdit;
